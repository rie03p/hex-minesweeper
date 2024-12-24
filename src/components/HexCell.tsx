import React from 'react'

type HexCellProps = {
  x: number
  y: number
  size: number
  fill: string
  stroke: string
  isFlag: boolean
  onLeftClick: () => void
  onRightClick: () => void
}

export const HexCell: React.FC<HexCellProps> = ({x, y, size, fill, stroke, isFlag, onLeftClick, onRightClick}) => {
  return (
    <g
      onClick={onLeftClick}
      onContextMenu={(e) => {
        e.preventDefault() // 右クリックメニューを無効にする
        onRightClick()
      }}>
      <polygon points={getHexagonPoints(x, y, size)} fill={fill} stroke={stroke} />
      {isFlag && <image href="/flag.svg" x={x - size / 2} y={y - size / 2} width={size} height={size} />}
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
