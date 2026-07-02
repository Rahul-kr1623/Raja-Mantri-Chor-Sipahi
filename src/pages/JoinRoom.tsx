import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { PageTransition } from '../components/animations/PageTransition';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';
import { multiplayer } from '../services/multiplayer/peer';
import { AVATAR_OPTIONS } from '../constants';
import { usePlayerStore } from '../store/playerStore';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export const JoinRoom: React.FC = () => {
  const navigate = useNavigate();
  const { setPlayer } = usePlayerStore();
  
  const [searchParams] = useSearchParams();
  
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState(searchParams.get('code') || '');
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)]);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (roomCode.trim().length !== 6) {
      toast.error('Room code must be 6 characters');
      return;
    }

    setIsLoading(true);
    const formattedCode = roomCode.trim().toUpperCase();
    
    try {
      const playerId = uuidv4();
      
      const player = {
        id: playerId,
        name: name.trim(),
        avatar: avatar,
        ready: false,
        connected: true,
        score: 0,
        role: null,
        lastSeen: Date.now(),
      };
      
      await multiplayer.connectToHost(formattedCode, player);
      
      setPlayer(playerId, name.trim(), avatar);
      navigate(`/lobby/${formattedCode}`);
    } catch (error: any) {
      console.error(error);
      
      let errorMsg = error.message || 'Failed to join room';
      if (error.type === 'peer-unavailable' || errorMsg.includes('Could not connect to peer')) {
        errorMsg = 'Room not found. Please check the code and try again.';
      }
      
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md">
          <h2 className="mb-6 text-3xl heritage-heading font-black text-center">Join Room</h2>
          
          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[var(--color-heritage-indigo)] mb-2 uppercase tracking-wider">Room Code</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full tactile-border bg-white px-4 py-4 text-center text-3xl heritage-heading font-bold tracking-[0.2em] text-[var(--color-heritage-saffron)] placeholder-gray-300 focus:border-[var(--color-heritage-saffron)] focus:outline-none focus:ring-1 focus:ring-[var(--color-heritage-saffron)] transition-colors uppercase rounded-sm"
                placeholder="XXXXXX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--color-heritage-indigo)] mb-2 uppercase tracking-wider">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={15}
                className="w-full tactile-border bg-white px-4 py-3 text-[var(--color-heritage-indigo)] placeholder-gray-400 focus:border-[var(--color-heritage-saffron)] focus:outline-none focus:ring-1 focus:ring-[var(--color-heritage-saffron)] transition-colors rounded-sm"
                placeholder="Enter your name..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--color-heritage-indigo)] mb-2 uppercase tracking-wider">Choose Avatar</label>
              <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {AVATAR_OPTIONS.map((a) => (
                  <Avatar
                    key={a}
                    emoji={a}
                    size="sm"
                    isSelected={avatar === a}
                    onClick={() => setAvatar(a)}
                  />
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <Button type="button" variant="ghost" className="flex-1" onClick={() => navigate('/')}>
                Back
              </Button>
              <Button type="submit" className="flex-2 w-full" isLoading={isLoading}>
                Join Game
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageTransition>
  );
};
