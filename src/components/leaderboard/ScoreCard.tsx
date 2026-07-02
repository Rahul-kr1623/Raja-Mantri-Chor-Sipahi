import React from 'react';
import { Player, Role } from '../../types';
import { ROLE_INFO } from '../../constants';
import { NumberRoll } from '../animations/NumberRoll';
import { Crown, Shield, Search, Sword } from 'lucide-react';

const ICONS: Record<string, any> = { Crown, Shield, Search, Sword };

interface ScoreCardProps {
  player: Player;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ player }) => {
  const roleInfo = player.role ? ROLE_INFO[player.role as Role] : null;
  const Icon = roleInfo ? ICONS[roleInfo.icon] : null;

  return (
    <div className="glass rounded-2xl p-4 flex flex-col items-center justify-center">
      <span className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Total Score</span>
      <div className="text-4xl font-display font-bold text-white mb-2">
        <NumberRoll value={player.score} />
      </div>
      {roleInfo && (
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/30 border border-white/10">
          <Icon size={12} style={{ color: roleInfo.color }} />
          <span className="text-xs font-bold" style={{ color: roleInfo.color }}>
            {roleInfo.name}
          </span>
        </div>
      )}
    </div>
  );
};
