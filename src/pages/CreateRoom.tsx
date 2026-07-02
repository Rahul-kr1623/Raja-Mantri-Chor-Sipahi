import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageTransition } from '../components/animations/PageTransition';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';
import { multiplayer } from '../services/multiplayer/peer';
import { AVATAR_OPTIONS, ROUND_OPTIONS } from '../constants';
import { usePlayerStore } from '../store/playerStore';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const { setPlayer } = usePlayerStore();
  
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);
  const [maxRounds, setMaxRounds] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsLoading(true);
    try {
      const playerId = uuidv4();
      setPlayer(playerId, name.trim(), avatar);
      
      const roomCode = uuidv4().substring(0, 6).toUpperCase();
      
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
      
      await multiplayer.initializeHost(roomCode, player, maxRounds);
      
      navigate(`/lobby/${roomCode}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create room. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md">
          <h2 className="mb-6 text-3xl heritage-heading font-black text-center">Create Room</h2>
          
          <form onSubmit={handleCreate} className="space-y-6">
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

            <div>
              <label className="block text-sm font-bold text-[var(--color-heritage-indigo)] mb-2 uppercase tracking-wider">Number of Rounds</label>
              <div className="flex flex-wrap gap-2">
                {ROUND_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMaxRounds(option.value)}
                    className={`px-3 py-1.5 rounded-sm text-sm font-bold transition-all tactile-border ${
                      maxRounds === option.value 
                        ? 'bg-[var(--color-heritage-indigo)] text-white shadow-[var(--shadow-tactile-sm)]' 
                        : 'bg-white text-[var(--color-heritage-indigo)] hover:bg-[var(--color-heritage-paper-dark)]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <Button type="button" variant="ghost" className="flex-1" onClick={() => navigate('/')}>
                Back
              </Button>
              <Button type="submit" className="flex-2 w-full" isLoading={isLoading}>
                Create Game
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageTransition>
  );
};
