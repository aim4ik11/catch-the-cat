import { HexGrid, Hexagon, Layout } from 'react-hexgrid'
import catSprite from '../assets/catch-the-cat/cat.png'
import type {
  HexCell,
  LayoutConfig,
  Cell,
} from '../hooks/useCatchTheCat'

type HexBoardProps = {
  hexCells: HexCell[]
  layoutConfig: LayoutConfig
  viewBox: string
  isInteractive: (cell: Cell) => boolean
  onCellClick: (x: number, y: number) => void
}

export const HexBoard = ({
  hexCells,
  layoutConfig,
  viewBox,
  isInteractive,
  onCellClick,
}: HexBoardProps) => (
  <div className="hexgrid-wrapper">
    <HexGrid width="100%" height="100%" viewBox={viewBox}>
      <Layout {...layoutConfig}>
        {hexCells.map((cell) => (
          <Hexagon
            key={`${cell.q}-${cell.r}-${cell.s}`}
            q={cell.q}
            r={cell.r}
            s={cell.s}
            onClick={() => onCellClick(cell.x, cell.y)}
            role="button"
            tabIndex={isInteractive(cell) ? 0 : -1}
            aria-label={`Hex ${cell.x},${cell.y}`}
            onKeyDown={(event) => {
              if (!isInteractive(cell)) return
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onCellClick(cell.x, cell.y)
              }
            }}
            className={[
              'hexagon',
              cell.blocked ? 'hexagon--blocked' : '',
              cell.hasCat ? 'hexagon--cat' : '',
              !isInteractive(cell) ? 'hexagon--disabled' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {cell.hasCat && (
              <g className="hexagon-cat">
                <image
                  href={catSprite}
                  width="5"
                  height="5"
                  x="-2.5"
                  y="-2.5"
                  preserveAspectRatio="xMidYMid meet"
                />
              </g>
            )}
          </Hexagon>
        ))}
      </Layout>
    </HexGrid>
  </div>
)

export default HexBoard

