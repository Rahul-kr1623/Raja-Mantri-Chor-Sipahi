import React from 'react';
import { CopyButton } from '../common/CopyButton';
import toast from 'react-hot-toast';

interface RoomCodeDisplayProps {
  roomCode: string;
}

export const RoomCodeDisplay: React.FC<RoomCodeDisplayProps> = ({ roomCode }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 tactile-card mx-auto w-full max-w-sm mb-8">
      <h3 className="text-[var(--color-heritage-indigo)] uppercase tracking-widest text-sm mb-2 font-bold opacity-70">Room Code</h3>
      <div className="flex items-center space-x-4 bg-[var(--color-heritage-paper-dark)] rounded-sm px-6 py-3 tactile-border">
        <span className="heritage-heading text-4xl font-bold tracking-[0.2em] text-[var(--color-heritage-saffron)]">
          {roomCode}
        </span>
        <div className="h-10 w-px bg-[var(--color-heritage-indigo)] mx-2 opacity-20" />
        <CopyButton text={roomCode} />
      </div>
      <div className="flex flex-col gap-2 mt-4 w-full">
        <button
          onClick={() => {
            const url = `${window.location.origin}/join?code=${roomCode}`;
            navigator.clipboard.writeText(url);
            toast.success('Invite link copied!');
          }}
          className="w-full bg-[var(--color-heritage-saffron)] text-white py-2 rounded-sm tactile-border text-sm font-bold uppercase tracking-widest hover:bg-[#D54D2B] transition-colors shadow-[var(--shadow-tactile-sm)]"
        >
          Copy Invite Link
        </button>
        <p className="text-[var(--color-heritage-indigo)] opacity-60 text-xs text-center font-bold">
          Share this link or code to invite friends
        </p>
      </div>
    </div>
  );
};
