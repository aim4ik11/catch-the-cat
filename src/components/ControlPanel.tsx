import type { GameStatus } from '../hooks/useCatchTheCat'

type ControlPanelProps = {
  status: GameStatus
  moveCount: number
  statusCopy: Record<GameStatus, string>
  onHint: () => void
  onReset: () => void
}

export const ControlPanel = ({
  status,
  moveCount,
  statusCopy,
  onHint,
  onReset,
}: ControlPanelProps) => (
  <>
    <div className="panel__header">
      <h1>Catch the Cat</h1>
      <p>
        Inspired by the original Unity mini-game. Block hex tiles to keep the
        cat from reaching the edge of the board.
      </p>
    </div>

    <div className="status-line">
      <span className={`status-pill status-${status}`}>{statusCopy[status]}</span>
      <span className="moves">Moves: {moveCount}</span>
    </div>

    <div className="actions">
      <button onClick={onHint} disabled={status !== 'playing'}>
        Hint
      </button>
      <button onClick={onReset}>
        {status === 'playing' ? 'Reset' : 'Play again'}
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

