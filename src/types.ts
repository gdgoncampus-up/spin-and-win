export interface Category {
  id: string;
  name: string;
  lines: readonly [string, string];
  color: string;
  description: string;
}

export type GameStatus = 'idle' | 'spinning' | 'winner';

export interface WheelState {
  status: GameStatus;
  winnerIndex: number | null;
  /** Wheel rotation in degrees once it has come to rest. */
  restAngle: number;
  /** Slice lit up while the wheel is moving (used by the Hop style). */
  cursorIndex: number | null;
}
