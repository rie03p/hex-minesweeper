import React from 'react'
import {ManageBoard} from './components/ManageBoard'

export const App: React.FC = () => {
  return (
    <div>
      <h1>Hexagon Grid</h1>
      <ManageBoard rows={5} columns={6} hexSize={30} />
    </div>
  )
}
