import { Role } from '../types';

export const SCORING = {
  [Role.Raja]: { correct: 1000, wrong: 1000 },
  [Role.Mantri]: { correct: 800, wrong: 0 },
  [Role.Sipahi]: { correct: 500, wrong: 500 },
  [Role.Chor]: { correct: 0, wrong: 800 },
};

export const ROLE_INFO = {
  [Role.Raja]: {
    name: 'Raja',
    hindiName: 'राजा',
    description: 'The King. You will ask "Mera Mantri Kaun Hai?"',
    color: 'var(--color-royal-gold)',
    icon: 'Crown',
  },
  [Role.Mantri]: {
    name: 'Mantri',
    hindiName: 'मंत्री',
    description: 'The Minister. You must find the Chor to protect your points.',
    color: 'var(--color-emerald)',
    icon: 'Shield',
  },
  [Role.Sipahi]: {
    name: 'Sipahi',
    hindiName: 'सिपाही',
    description: 'The Soldier. You follow orders and earn steady points.',
    color: 'var(--color-royal-blue)',
    icon: 'Sword',
  },
  [Role.Chor]: {
    name: 'Chor',
    hindiName: 'चोर',
    description: 'The Thief. Try to act like a Sipahi to fool the Mantri!',
    color: 'var(--color-crimson)',
    icon: 'Search', // Using search as placeholder for stealth/thief
  },
};

export const ROUND_OPTIONS = [
  { value: 5, label: '5 Rounds' },
  { value: 10, label: '10 Rounds' },
  { value: 15, label: '15 Rounds' },
  { value: 20, label: '20 Rounds' },
  { value: 999, label: 'Unlimited' },
];

export const AVATAR_OPTIONS = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', 
  '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
  '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺',
];

export const EMOJI_REACTIONS = ['❤️', '😂', '😎', '🔥', '👏', '🤯', '😢', '🎉'];

export const TIMING = {
  ROLE_REVEAL_DURATION: 3000, // Ms to show role card initially
  RAJA_ANNOUNCEMENT_DURATION: 3000,
  RESULT_REVEAL_DURATION: 5000,
  ROUND_TRANSITION_COUNTDOWN: 3, // Seconds
};
