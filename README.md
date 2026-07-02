# Raja Mantri Chor Sipahi Online 👑 🗡️ 💰 🛡️

The definitive online multiplayer version of the classic Indian childhood guessing game. Built with a modern, zero-backend, peer-to-peer architecture and a premium "Tactile Heritage" design system.

![Raja Mantri Chor Sipahi](public/favicon.svg)

---

## 🌟 Vision & Overview

This project brings the nostalgic classroom game of **Raja, Mantri, Chor, Sipahi** to the digital world. The experience is designed to feel highly tactile and premium—like playing with physical cards on a cream paper table—while leveraging cutting-edge web technologies to deliver an instant, download-free, and real-time multiplayer experience.

### Key Features
- **Zero-Backend Architecture:** Uses WebRTC (PeerJS) to connect players directly. The host's browser acts as the server, meaning zero database costs, zero server latency, and complete privacy.
- **Instant Multiplayer:** Create a room and share a 5-character code (or a direct link) to instantly play with 3 other friends.
- **Tactile Heritage UI:** A custom design system featuring rich indigo text on cream paper backgrounds, with solid borders and crisp shadows inspired by Indian heritage aesthetics.
- **Smooth Animations:** Powered by Framer Motion, every card flip, role reveal, and point tally feels satisfying and alive.
- **In-Game Chat:** Real-time table chat with an unread message badge so you can strategize (or bluff) during the round.
- **Responsive & Mobile First:** Plays flawlessly on laptops, tablets, and phones.
- **Auto-Reconnection Handling:** Gracefully handles player disconnects and page refreshes.

---

## 📜 How to Play (The Rules)

The game requires exactly **4 players**. 

1. **Assign Roles:** At the start of a round, 4 chits are distributed randomly among the players:
   - 👑 **Raja (King):** 1000 points
   - 🗡️ **Mantri (Minister):** 800 points
   - 💰 **Chor (Thief):** 0 points
   - 🛡️ **Sipahi (Police):** 500 points
2. **The Reveal:** The Raja and Sipahi's identities are kept secret. The game begins when the Raja announces themselves by asking: *"Mera Mantri Kaun Hai?"* (Who is my Minister?).
3. **The Mantri Steps Up:** The Mantri reveals their identity.
4. **The Guess:** The Mantri must now guess who the **Chor** (Thief) is from the remaining two unidentified players.
5. **Scoring:** 
   - If the Mantri guesses correctly: The Mantri keeps their 800 points, and the Chor gets 0 points.
   - If the Mantri guesses incorrectly: The Mantri loses their points (gets 0), and the Chor gets the 800 points!
   - The Raja and Sipahi always get their fixed points (1000 and 500 respectively).
6. **Winning:** After a set number of rounds (e.g., 5, 10, or 15), the player with the highest total score is crowned the ultimate winner!

---

## 💻 Tech Stack

This project is entirely frontend-driven, utilizing modern web standards:

- **Core:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (for lightweight, scalable state)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (using custom CSS variables for the theme)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Multiplayer/Network:** [PeerJS](https://peerjs.com/) (WebRTC for P2P data channels)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Audio:** [Howler.js](https://howlerjs.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Effects:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🏗️ Architecture: Zero-Backend Multiplayer

Unlike traditional multiplayer games that require a Node.js server and a WebSocket/Database layer (like Firebase or Supabase), this game uses a **Host-Client topology over WebRTC**:

1. **The Host:** The player who creates the room generates a unique 5-character ID. Their browser initializes a PeerJS node that listens for connections. The Host's browser memory (managed by Zustand) acts as the single source of truth (the "Server").
2. **The Clients:** When players join via the code, they establish a direct Peer-to-Peer WebRTC connection to the Host.
3. **State Sync:** Actions taken by clients (e.g., "Submit Guess", "Send Chat") are sent as messages to the Host. The Host processes the game logic, updates the Zustand state, and broadcasts the new state snapshot to all connected clients instantly.

*Note: Because the game state lives in the Host's RAM, if the Host refreshes or closes their tab, the room is destroyed. The application includes fallback logic to gracefully detect this and return players to the main menu.*

---

## 📂 Project Structure

```text
src/
├── components/          # Reusable React components
│   ├── animations/      # Page transitions and micro-animations
│   ├── common/          # Buttons, Avatars, Countdown timers
│   ├── gameplay/        # Phase-specific UI (Role Reveal, Guessing, Chat)
│   ├── lobby/           # Pre-game room setup and player slots
│   └── leaderboard/     # Score rows and animations
├── hooks/               # Custom React hooks
│   ├── useGamePhase.ts  # Derives current UI state from game data
│   ├── usePresence.ts   # Manages ping/pong keepalive for connections
│   └── useRoom.ts       # Initializes and tears down multiplayer connections
├── pages/               # Top-level route components (Home, Lobby, Game, Winner)
├── services/            # Core business logic
│   └── multiplayer/     
│       ├── peer.ts      # WebRTC PeerJS implementation
│       └── gameLogic.ts # Pure functions handling game rules and actions
├── store/               # Zustand state stores
│   ├── gameStore.ts     # Local UI state (modals, tooltips)
│   ├── playerStore.ts   # Local player identity (Name, Avatar, ID)
│   └── roomStore.ts     # The shared multiplayer state
├── types/               # TypeScript interfaces and enums
├── constants.ts         # Global configs (Timings, Avatars, Roles)
├── index.css            # Tailwind directives and Tactile Heritage design tokens
└── main.tsx             # Application entry point and Router provider
```

---

## 🚀 Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/udaysharmadev/Raja-Mantri-Chor-Sipahi.git
   cd Raja-Mantri-Chor-Sipahi
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Play locally:**
   Open `http://localhost:5173` in your browser. To test multiplayer locally, open multiple tabs or incognito windows, create a room in one, and join using the room code in the others.

---

## 🌍 Deployment

This project is optimized for instant deployment on [Vercel](https://vercel.com).

1. Push your code to GitHub.
2. Import the repository into Vercel.
3. Vercel will automatically detect Vite and run the build command (`npm run build`).
4. Since there are no environment variables or backend databases to configure, your game will be live instantly!

---

## 🎨 The "Tactile Heritage" Design System

The UI rejects standard dark-mode glassmorphism in favor of a bright, tactile, and highly readable aesthetic. 

- **Background:** `var(--color-heritage-paper)` - A warm, textured cream color.
- **Primary Text/Borders:** `var(--color-heritage-indigo)` - A deep, sharp navy blue for ultra-high contrast.
- **Accents:** `var(--color-heritage-saffron)` - A vibrant orange for buttons and highlights.
- **Typography:** Bold, serif-inspired display fonts mixed with clean sans-serif for readability.
- **Cards:** Solid white backgrounds with thick indigo borders and crisp drop shadows to make elements feel like physical paper cutouts resting on a table.

---

*Built with ❤️ for those nostalgic classroom days.*
#   R a j a - M a n t r i - C h o r - S i p a h i  
 