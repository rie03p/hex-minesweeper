import React, {useCallback, useState} from 'react'
import {Board} from './Board'
import {evenColOffsets, GameState, oddColOffsets} from '../utils/constants'

export type Cell = {
  x: number
  y: number
  row: number
  col: number
  isFlag: boolean
  isBomb: boolean
  isRevealed: boolean
  value?: number
}

type ManageBoardProps = {
  rows: number
  columns: number
  hexSize: number // 六角形の1辺の長さ
}
export const ManageBoard: React.FC<ManageBoardProps> = ({rows, columns, hexSize}) => {
  const [gameState, setGameState] = useState<GameState>(GameState.Playing)
  const hexWidth = hexSize * 2
  const hexHeight = Math.sqrt(3) * hexSize
  const horizontalStep = hexWidth * 0.75
  const verticalStep = hexHeight

  // SVGの描画範囲を計算
  const svgWidth = columns * horizontalStep + hexSize * 2
  const svgHeight = rows * verticalStep + hexHeight / 2 + hexSize

  // 周りの爆弾の数を計算する関数
  const countBombs = (board: Cell[][]): Cell[][] => {
    const newBoard = board.map((rowCells, row) =>
      rowCells.map((cell, col) => {
        let count = 0
        // 偶数列と奇数列で隣接セルのオフセットが異なる
        const offsets = col % 2 === 0 ? evenColOffsets : oddColOffsets
        for (const [dy, dx] of offsets) {
          const newRow = row + dy
          const newCol = col + dx

          // 隣接セルが範囲内か確認
          if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length) {
            if (board[newRow][newCol].isBomb) {
              count++
            }
          }
        }
        return {
          ...cell,
          value: count,
        }
      }),
    )
    return newBoard
  }

  const createBoard = useCallback((): Cell[][] => {
    const totalCells = rows * columns
    // 爆弾が設置される割合を指定できるよ
    const totalBombs = Math.floor(totalCells * 0.15)

    const bombPositions = new Set<number>()
    while (bombPositions.size < totalBombs) {
      bombPositions.add(Math.floor(Math.random() * totalCells))
    }

    const board: Cell[][] = []
    for (let row = 0; row < rows; row++) {
      const rowCells: Cell[] = []
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col
        const x = col * horizontalStep + hexSize
        const y = row * verticalStep + (col % 2 === 0 ? 0 : hexHeight / 2) + hexSize
        rowCells.push({
          x,
          y,
          row,
          col,
          isFlag: false,
          isBomb: bombPositions.has(index),
          isRevealed: false,
        })
      }
      board.push(rowCells)
    }
    return countBombs(board)
  }, [rows, columns, horizontalStep, verticalStep, hexSize, hexHeight])

  const [board, setBoard] = useState<Cell[][]>(createBoard)

  const handleRestart = useCallback(() => {
    setBoard(createBoard())
    setGameState(GameState.Playing)
  }, [createBoard])

  return (
    <div>
      {gameState === GameState.GameOver && (
        <div>
          <h2>Game Over</h2>
          <button onClick={handleRestart}>Restart</button>
        </div>
      )}
      {gameState === GameState.GameClear && (
        <div>
          <h2>Game Clear</h2>
          <button onClick={handleRestart}>Restart</button>
        </div>
      )}
      <Board
        key={JSON.stringify(board)}
        cells={board}
        hexSize={hexSize}
        svgWidth={svgWidth}
        svgHeight={svgHeight}
        gameState={gameState}
        onGameClear={() => setGameState(GameState.GameClear)}
        onGameOver={() => setGameState(GameState.GameOver)}
      />
    </div>
  )
}
