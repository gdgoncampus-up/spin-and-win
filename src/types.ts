export type IconName = 'sparkle' | 'shield' | 'monitor' | 'bug' | 'bulb' | 'dice';

export interface Category {
  id: string;
  name: string;
  lines: readonly [string, string];
  color: string;
  ink: string;
  icon: IconName;
  description: string;
}

export type GameStatus = 'idle' | 'spinning' | 'winner';

export interface WheelState {
  status: GameStatus;
  winnerIndex: number | null;
}
