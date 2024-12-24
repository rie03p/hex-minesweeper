import React from 'react'
import {Cell} from './HexGrid'

type HexCellProps = {
  cell: Cell
  size: number
  stroke: string
  onLeftClick: () => void
  onRightClick: () => void
}

export const HexCell: React.FC<HexCellProps> = ({cell, size, stroke, onLeftClick, onRightClick}) => {
  const fill = cell.isRevealed ? 'white' : 'lightblue'

  return (
    <g
      onClick={onLeftClick}
      onContextMenu={(e) => {
        e.preventDefault() // 右クリックメニューを無効にする
        onRightClick()
      }}>
      <polygon points={getHexagonPoints(cell.x, cell.y, size)} fill={fill} stroke={stroke} />
      {cell.isFlag && <image href="/flag.svg" x={cell.x - size / 2} y={cell.y - size / 2} width={size} height={size} />}
      {cell.isBomb && <image href="/bomb.svg" x={cell.x - size / 2} y={cell.y - size / 2} width={size} height={size} />}
      {cell.isRevealed && cell.value && cell.value > 0 && !cell.isBomb && (
        <text x={cell.x} y={cell.y} textAnchor="middle" dominantBaseline="middle" fill="black">
          {cell.value}
        </text>
      )}
    </g>
  )
}

const getHexagonPoints = (x: number, y: number, size: number): string => {
  const angle = (Math.PI / 180) * 60
  let points = ''
  for (let i = 0; i < 6; i++) {
    points += `${x + size * Math.cos(angle * i)},${y + size * Math.sin(angle * i)} `
  }
  return points.trim()
}
