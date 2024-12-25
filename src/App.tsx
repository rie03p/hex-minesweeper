import React from 'react'
import {ManageBoard} from './components/ManageBoard'

export const App: React.FC = () => {
  return (
    <div>
      <h1>Hexagon Minesweeper</h1>
      <ManageBoard rows={10} columns={11} hexSize={30} />
    </div>
  )
}
