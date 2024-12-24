import React from 'react'
import {HexGrid} from './components/HexGrid'

export const App: React.FC = () => {
  return (
    <div>
      <h1>Hexagon Grid</h1>
      <HexGrid rows={5} columns={6} hexSize={30} />
    </div>
  )
}
