import React, {useCallback, useState} from 'react'
import {HexCell} from './HexCell'

type Cell = {
  x: number
  y: number
  row: number
  col: number
  isFlag: boolean
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

  // ボードを生成する関数
  const createBoard = (): Cell[][] => {
    const board: Cell[][] = []
    for (let row = 0; row < rows; row++) {
      const rowCells: Cell[] = []
      for (let col = 0; col < columns; col++) {
        const x = col * horizontalStep + hexSize
        const y = row * verticalStep + (col % 2 === 0 ? 0 : hexHeight / 2) + hexSize
        rowCells.push({x, y, row, col, isFlag: false})
      }
      board.push(rowCells)
    }
    return board
  }

  const [board, setBoard] = useState<Cell[][]>(createBoard())

  // 左クリックイベント
  const onLeftClick = useCallback(
    (row: number, col: number) => {
      if (board[row][col].isFlag) return
      console.log(`Left Clicked: Row ${row}, Col ${col}`)
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
              x={cell.x}
              y={cell.y}
              size={hexSize}
              onLeftClick={() => onLeftClick(cell.row, cell.col)}
              onRightClick={() => onRightClick(cell.row, cell.col)}
              fill="lightblue"
              stroke="black"
              isFlag={cell.isFlag}
            />
          </React.Fragment>
        )),
      )}
    </svg>
  )
}
