import { useState } from 'react'
import ControlPanel from './components/ControlPanel'
import HexBoard from './components/HexBoard'
import { DEFAULT_BLOCKERS, statusCopy, useCatchTheCat } from './hooks/useCatchTheCat'
import './App.css'

const DIFFICULTY_PRESETS = {
  easy: { label: 'Easy', blockers: 14 },
  normal: { label: 'Normal', blockers: DEFAULT_BLOCKERS },
  hard: { label: 'Hard', blockers: 6 },
} as const

type DifficultyKey = keyof typeof DIFFICULTY_PRESETS

const DEFAULT_DIFFICULTY: DifficultyKey = 'normal'

function App() {
  const [difficulty, setDifficulty] =
    useState<DifficultyKey>(DEFAULT_DIFFICULTY)
  const {
    game,
    layoutConfig,
    hexCells,
    viewBox,
    isInteractive,
    handleCellClick,
    handleHint,
    resetGame,
  } = useCatchTheCat(DIFFICULTY_PRESETS[DEFAULT_DIFFICULTY].blockers)

  const difficultyOptions = Object.entries(DIFFICULTY_PRESETS).map(
    ([value, config]) => ({
      value,
      label: `${config.label} · ${config.blockers} blockers`,
    }),
  )

  const handleDifficultyChange = (value: string) => {
    if (value in DIFFICULTY_PRESETS) {
      setDifficulty(value as DifficultyKey)
    }
  }

  const handleStartGame = () => {
    resetGame(DIFFICULTY_PRESETS[difficulty].blockers)
  }

  return (
    <main className="app">
      <section className="panel">
        <ControlPanel
          status={game.status}
          moveCount={game.moveCount}
          statusCopy={statusCopy}
          difficulty={difficulty}
          difficultyOptions={difficultyOptions}
          onDifficultyChange={handleDifficultyChange}
          onHint={handleHint}
          onStart={handleStartGame}
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
