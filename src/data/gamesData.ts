export interface GameData {
  id: string;
  title: string;
  description: string;
  path: string;
  previewType: string;
  isAvailable: boolean;
}

export const gamesData: GameData[] = [
  {
    id: "snake",
    title: "Snake Game",
    description: "Classic snake game with wrap-around edges",
    path: "/games/snake",
    previewType: "snake",
    isAvailable: true,
  },
  // Future games will be added here
  // Example:
  // {
  //   id: 'tetris',
  //   title: 'Tetris',
  //   description: 'Classic block-stacking puzzle game',
  //   path: '/games/tetris',
  //   previewType: 'tetris',
  //   isAvailable: false,
  // },
];
