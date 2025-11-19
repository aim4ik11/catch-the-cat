import type { GameStatus } from '../hooks/useCatchTheCat'

type ControlPanelProps = {
  status: GameStatus
  moveCount: number
  statusCopy: Record<GameStatus, string>
  difficulty: string
  difficultyOptions: { value: string; label: string }[]
  onDifficultyChange: (value: string) => void
  onHint: () => void
  onStart: () => void
}

export const ControlPanel = ({
  status,
  moveCount,
  statusCopy,
  difficulty,
  difficultyOptions,
  onDifficultyChange,
  onHint,
  onStart,
}: ControlPanelProps) => (
  <>
    <div className="panel__header">
      <h1>Catch the Cat</h1>
      <p>
        Block hex tiles to keep the cat from reaching the edge. Difficulty
        shifts according to the BFS path the cat can calculate and the number
        of predefined obstacles already seeded on the map.
      </p>
      <div className="difficulty-picker">
        <label htmlFor="difficulty-select">Difficulty</label>
        <div className="difficulty-controls">
          <select
            id="difficulty-select"
            value={difficulty}
            onChange={(event) => onDifficultyChange(event.target.value)}
          >
            {difficultyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button onClick={onStart}>Start game</button>
        </div>
      </div>
    </div>

    <div className="status-line">
      <span className={`status-pill status-${status}`}>{statusCopy[status]}</span>
      <span className="moves">Moves: {moveCount}</span>
    </div>

    <div className="actions">
      <button onClick={onHint} disabled={status !== 'playing'}>
        Hint
      </button>
    </div>

    <ul className="rules">
      <li>Click an open hex to place a blocker.</li>
      <li>The cat moves one step toward the border every turn.</li>
      <li>Trap the cat (no path to an edge) to win.</li>
    </ul>
  </>
)

export default ControlPanel

