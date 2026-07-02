import { createBrowserRouter } from 'react-router';
import { GameLayout } from '../layouts/GameLayout';
import { Landing } from '../pages/Landing';
import { CreateRoom } from '../pages/CreateRoom';
import { JoinRoom } from '../pages/JoinRoom';
import { Lobby } from '../pages/Lobby';
import { Game } from '../pages/Game';
import { Winner } from '../pages/Winner';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <GameLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'create',
        element: <CreateRoom />,
      },
      {
        path: 'join',
        element: <JoinRoom />,
      },
      {
        path: 'lobby/:roomId',
        element: <Lobby />,
      },
      {
        path: 'game/:roomId',
        element: <Game />,
      },
      {
        path: 'winner/:roomId',
        element: <Winner />,
      },
    ],
  },
]);
