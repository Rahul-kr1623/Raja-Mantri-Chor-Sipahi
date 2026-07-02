import React from 'react';
import { Outlet } from 'react-router';
import { SoundToggle } from '../components/common/SoundToggle';
import { useRoomStore } from '../store/roomStore';
import { usePlayerStore } from '../store/playerStore';
import { RoomStatus } from '../types';

export const GameLayout: React.FC = () => {
  const room = useRoomStore(state => state.room);
  const playerId = usePlayerStore(state => state.playerId);

  const myPlayer = room && playerId ? room.players[playerId] : null;

  return (
    <div className="relative min-h-screen w-full font-body overflow-x-hidden selection:bg-[var(--color-heritage-saffron)] selection:text-white">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-40 p-4 flex justify-between items-start pointer-events-none">
        <div className="flex space-x-2 pointer-events-auto">
          <SoundToggle />
        </div>

        {room && room.status !== RoomStatus.Finished && (
          <div className="flex flex-col items-end space-y-2 pointer-events-auto">
            <div className="bg-white border-2 border-[var(--color-heritage-indigo)] px-4 py-1.5 rounded-full text-xs font-bold text-[var(--color-heritage-indigo)] tracking-widest uppercase shadow-[var(--shadow-tactile-sm)]">
              Room: <span className="text-[var(--color-heritage-saffron)]">{room.id}</span>
            </div>
            
            {myPlayer && (
              <div className="flex items-center space-x-2 bg-white border-2 border-[var(--color-heritage-indigo)] px-3 py-1.5 rounded-full shadow-[var(--shadow-tactile-sm)]">
                <div className={`h-2 w-2 rounded-full ${myPlayer.connected ? 'bg-green-400' : 'bg-red-500 animate-pulse'}`} />
                <span className="text-xs font-bold text-[var(--color-heritage-indigo)] truncate max-w-[100px]">{myPlayer.name}</span>
                <span>{myPlayer.avatar}</span>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex min-h-screen flex-col pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
