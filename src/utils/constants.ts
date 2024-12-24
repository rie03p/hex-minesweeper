export enum GameState {
  Playing,
  GameOver,
  GameClear,
}

export const oddColOffsets = [
  [-1, 0],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
]
export const evenColOffsets = [
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, -1],
]
