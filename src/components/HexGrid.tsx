import React, {useCallback, useState} from 'react'
import {HexCell} from './HexCell'

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

type HexGridProps = {
  rows: number
  columns: number
  hexSize: number // 六角形の1辺の長さ
}

export const HexGrid: React.FC<HexGridProps> = ({rows, columns, hexSize}) => {
  const hexWidth = hexSize * 2
  const hexHeight = Math.sqrt(3) * hexSize
  const horizontalStep = hexWidth * 0.75
  const verticalStep = hexHeight

  // SVGの描画範囲を計算
  const svgWidth = columns * horizontalStep + hexSize
  const svgHeight = rows * verticalStep + hexHeight / 2

  // 周りの爆弾の数を計算する関数
  const countBombs = (board: Cell[][]): Cell[][] => {
    const evenColOffsets = [
      [-1, 0],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
    ]
    const oddColOffsets = [
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
        const offsets = col % 2 === 0 ? oddColOffsets : evenColOffsets
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
  const createBoard = (): Cell[][] => {
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
  }

  const [board, setBoard] = useState<Cell[][]>(createBoard())

  // 左クリックイベント
  const onLeftClick = useCallback(
    (row: number, col: number) => {
      if (board[row][col].isFlag) return
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((rowCells, rIdx) => {
          return rowCells.map((cell, cIdx) => {
            if (rIdx === row && cIdx === col) {
              return {...cell, isRevealed: true}
            }
            return cell
          })
        })
        return newBoard
      })
    },
    [board],
  )

  // 右クリックイベント（旗の切り替え）
  const onRightClick = useCallback((row: number, col: number) => {
    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((rowCells, rIdx) => {
        return rowCells.map((cell, cIdx) => {
          if (rIdx === row && cIdx === col) {
            return {...cell, isFlag: !cell.isFlag}
          }
          return cell
        })
      })
      return newBoard
    })
  }, [])

  return (
    <svg
      width={svgWidth + hexSize}
      height={svgHeight + hexSize}
      viewBox={`0 0 ${svgWidth + hexSize} ${svgHeight + hexSize}`}>
      {board.map((rowCells) =>
        rowCells.map((cell) => (
          <React.Fragment key={`${cell.row}-${cell.col}`}>
            <HexCell
              cell={cell}
              size={hexSize}
              onLeftClick={() => onLeftClick(cell.row, cell.col)}
              onRightClick={() => onRightClick(cell.row, cell.col)}
              stroke="black"
            />
          </React.Fragment>
        )),
      )}
    </svg>
  )
}
