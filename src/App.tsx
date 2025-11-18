import ControlPanel from './components/ControlPanel'
import HexBoard from './components/HexBoard'
import { statusCopy, useCatchTheCat } from './hooks/useCatchTheCat'
import './App.css'

function App() {
  const {
    game,
    layoutConfig,
    hexCells,
    viewBox,
    isInteractive,
    handleCellClick,
    handleHint,
    resetGame,
  } = useCatchTheCat()

  return (
    <main className="app">
      <section className="panel">
        <ControlPanel
          status={game.status}
          moveCount={game.moveCount}
          statusCopy={statusCopy}
          onHint={handleHint}
          onReset={resetGame}
        />

        <section className="board" aria-label="Hex board">
          <HexBoard
            hexCells={hexCells}
            layoutConfig={layoutConfig}
            viewBox={viewBox}
            isInteractive={isInteractive}
            onCellClick={handleCellClick}
          />
        </section>
      </section>
    </main>
  )
}

export default App
