import React, {useCallback, useState} from 'react'
import {HexCell} from './HexCell'
import {Cell} from './ManageBoard'

type Board = {
  cells: Cell[][]
  hexSize: number
  svgWidth: number
  svgHeight: number
}

export const Board: React.FC<Board> = ({cells, hexSize, svgWidth, svgHeight}) => {
  const [board, setBoard] = useState<Cell[][]>(cells)

  // 左クリックイベント
  const onLeftClick = useCallback((row: number, col: number) => {
    setBoard((prevBoard) => {
      // セルを直接更新する
      const cell = prevBoard[row][col]
      if (cell.isFlag || cell.isRevealed) return prevBoard

      const updatedCell = {...cell, isRevealed: true}
      const newBoard = [...prevBoard]
      newBoard[row] = [...prevBoard[row]]
      newBoard[row][col] = updatedCell
      return newBoard
    })
  }, [])

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
    <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
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
