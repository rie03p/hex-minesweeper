import React, {useCallback, useState} from 'react'
import {Board} from './Board'

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
  const [isGameOver, setIsGameOver] = useState<boolean>(false)
  const hexWidth = hexSize * 2
  const hexHeight = Math.sqrt(3) * hexSize
  const horizontalStep = hexWidth * 0.75
  const verticalStep = hexHeight

  // SVGの描画範囲を計算
  const svgWidth = columns * horizontalStep + hexSize * 2
  const svgHeight = rows * verticalStep + hexHeight / 2 + hexSize

  // 周りの爆弾の数を計算する関数
  const countBombs = (board: Cell[][]): Cell[][] => {
    const oddColOffsets = [
      [-1, 0],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
    ]
    const evenColOffsets = [
      [-1, 0],
      [-1, 1],
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, -1],
    ]

    const newBoard = board.map((rowCells, row) =>
      rowCells.map((cell, col) => {
        let count = 0
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

  // ボードを生成する関数
  const createBoard = useCallback((): Cell[][] => {
    const board: Cell[][] = []
    for (let row = 0; row < rows; row++) {
      const rowCells: Cell[] = []
      for (let col = 0; col < columns; col++) {
        const x = col * horizontalStep + hexSize
        const y = row * verticalStep + (col % 2 === 0 ? 0 : hexHeight / 2) + hexSize
        // isBombをランダムで設定
        const isBomb = Math.random() < 0.1
        rowCells.push({x, y, row, col, isFlag: false, isBomb, isRevealed: false})
      }
      board.push(rowCells)
    }
    return countBombs(board)
  }, [rows, columns, horizontalStep, verticalStep, hexSize, hexHeight])

  // ボードの状態
  const [board, setBoard] = useState<Cell[][]>(createBoard)

  // Restart ボタンの処理
  const handleRestart = useCallback(() => {
    setBoard(createBoard())
    setIsGameOver(false)
  }, [createBoard])

  return (
    <div>
      {isGameOver && (
        <div>
          <h2>Game Over</h2>
          <button onClick={handleRestart}>Restart</button>
        </div>
      )}
      <Board
        key={JSON.stringify(board)}
        cells={board}
        hexSize={hexSize}
        svgWidth={svgWidth}
        svgHeight={svgHeight}
        onGameOver={() => setIsGameOver(true)}
      />
    </div>
  )
}
