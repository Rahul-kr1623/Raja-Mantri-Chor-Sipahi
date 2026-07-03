import Peer, { DataConnection } from 'peerjs';
import { Room, Player } from '../../types';
import { useRoomStore } from '../../store/roomStore';
import { handleClientAction } from './gameLogic';
import toast from 'react-hot-toast';

// Callback invoked when the local player is kicked by the host
let onKickedCallback: (() => void) | null = null;
export const setOnKickedCallback = (cb: () => void) => { onKickedCallback = cb; };

// PeerJS assigns an ID. We prefix room codes so they are less likely to collide globally.
const PREFIX = 'rmcs-game-'; 

class MultiplayerService {
  private peer: Peer | null = null;
  public connections: Map<string, DataConnection> = new Map();
  public isHost: boolean = false;
  private myPlayerId: string | null = null;

  // --- HOST LOGIC ---
  public async initializeHost(roomCode: string, hostPlayer: Player, maxRounds: number): Promise<void> {
    this.isHost = true;
    this.myPlayerId = hostPlayer.id;
    
    return new Promise((resolve, reject) => {
      this.peer = new Peer(PREFIX + roomCode);

      this.peer.on('open', (id) => {
        console.log('Host created room:', roomCode);
        
        // Initialize room state
        useRoomStore.getState().initRoom(roomCode, hostPlayer.id, maxRounds, hostPlayer);
        resolve();
      });

      this.peer.on('error', (err) => {
        console.error('Peer error:', err);
        reject(err);
      });

      this.peer.on('connection', (conn) => {
        // A client joined
        conn.on('open', () => {
          this.connections.set(conn.peer, conn);
          
          conn.on('data', (data: any) => {
            if (data.type === 'JOIN') {
              this.handlePlayerJoin(conn.peer, data.player);
            } else {
              handleClientAction(data);
            }
          });

          conn.on('close', () => {
            this.handlePlayerLeave(conn.peer);
          });
        });
      });
    });
  }

  private handlePlayerJoin(peerId: string, player: Player) {
    const room = useRoomStore.getState().room;
    if (!room) return;

    if (Object.keys(room.players).length >= 4) {
      // Room full, reject
      const conn = this.connections.get(peerId);
      if (conn) {
        conn.send({ type: 'ERROR', message: 'Room is full' });
        setTimeout(() => conn.close(), 500);
      }
      return;
    }

    // Add player to state
    useRoomStore.getState().addPlayer(player);
    
    // Acknowledge join success
    const conn = this.connections.get(peerId);
    if (conn) {
      conn.send({ type: 'JOIN_SUCCESS' });
    }
  }

  private handlePlayerLeave(peerId: string) {
    this.connections.delete(peerId);
    
    // Find player by peer ID (in our implementation, we can just use peerId as playerId for simplicity,
    // or pass playerId in JOIN. Assuming playerId = peerId for remote clients for simplicity,
    // wait, we pass actual playerId. Let's find player whose connected status needs updating)
    
    const room = useRoomStore.getState().room;
    if (!room) return;
    
    // In our simplified setup, peerId === client's player.id (except host).
    // Let's rely on peerId being the playerId.
    useRoomStore.getState().removePlayer(peerId);
  }

  public broadcastState(room: Room) {
    if (!this.isHost) return;
    const data = { type: 'STATE_UPDATE', room };
    this.connections.forEach(conn => {
      if (conn.open) {
        conn.send(data);
      }
    });
  }

  // --- CLIENT LOGIC ---
  public async connectToHost(roomCode: string, player: Player): Promise<void> {
    this.isHost = false;
    this.myPlayerId = player.id;

    return new Promise((resolve, reject) => {
      // Setup a connection timeout
      const timeout = setTimeout(() => {
        if (this.peer) {
          this.peer.destroy();
        }
        reject(new Error('Connection timed out. Please try again.'));
      }, 10000);

      this.peer = new Peer(PREFIX + player.id);

      this.peer.on('open', (id) => {
        const conn = this.peer!.connect(PREFIX + roomCode, { reliable: true });

        conn.on('open', () => {
          this.connections.set('host', conn);
          
          // Send join info - we do NOT resolve here anymore, we wait for JOIN_SUCCESS
          conn.send({ type: 'JOIN', player });
        });

        conn.on('data', (data: any) => {
          if (data.type === 'JOIN_SUCCESS') {
            clearTimeout(timeout);
            resolve();
          } else if (data.type === 'STATE_UPDATE') {
            useRoomStore.getState().updateFromSnapshot(data.room);
          } else if (data.type === 'ERROR') {
            clearTimeout(timeout);
            toast.error(data.message);
            reject(new Error(data.message));
          } else if (data.type === 'KICK') {
            toast.error('You have been kicked from the room by the host.');
            useRoomStore.getState().clearRoom();
            if (onKickedCallback) onKickedCallback();
          }
        });

        conn.on('close', () => {
          toast.error('Host disconnected. Room closed.');
          useRoomStore.getState().clearRoom();
        });
      });

      this.peer.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  public sendAction(action: any) {
    if (this.isHost) {
      // Direct local execution
      handleClientAction({ ...action, playerId: this.myPlayerId });
    } else {
      const hostConn = this.connections.get('host');
      if (hostConn && hostConn.open) {
        hostConn.send({ ...action, playerId: this.myPlayerId });
      }
    }
  }

  // HOST-ONLY: send a KICK message to a specific peer and close the connection
  public kickPlayer(targetPeerId: string) {
    if (!this.isHost) return;
    const conn = this.connections.get(PREFIX + targetPeerId);
    if (conn && conn.open) {
      conn.send({ type: 'KICK' });
      setTimeout(() => conn.close(), 500);
    }
  }

  public disconnect() {
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.connections.clear();
  }
}

export const multiplayer = new MultiplayerService();
