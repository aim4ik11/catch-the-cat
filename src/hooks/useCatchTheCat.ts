import { useMemo, useState } from 'react'
import { HexUtils } from 'react-hexgrid'

export type Coordinates = { x: number; y: number }
export type Cell = Coordinates & { blocked: boolean; hasCat: boolean }
export type Grid = Cell[][]
export type GameStatus = 'playing' | 'won' | 'lost'
export type GameState = {
  grid: Grid
  cat: Coordinates
  status: GameStatus
  moveCount: number
}
export type HexCell = Cell & { q: number; r: number; s: number }
export type LayoutConfig = {
  size: { x: number; y: number }
  flat: boolean
  spacing: number
  origin: { x: number; y: number }
}

const GRID_WIDTH = 11
const GRID_HEIGHT = 11
export const DEFAULT_BLOCKERS = 10

const FLAT_ORIENTATION = {
  f0: 1.5,
  f1: 0,
  f2: Math.sqrt(3) / 2,
  f3: Math.sqrt(3),
  b0: 2 / 3,
  b1: 0,
  b2: -1 / 3,
  b3: Math.sqrt(3) / 3,
  startAngle: 0,
} as const

const POINTY_ORIENTATION = {
  f0: Math.sqrt(3),
  f1: Math.sqrt(3) / 2,
  f2: 0,
  f3: 1.5,
  b0: Math.sqrt(3) / 3,
  b1: -1 / 3,
  b2: 0,
  b3: 2 / 3,
  startAngle: 0.5,
} as const

export const statusCopy: Record<GameStatus, string> = {
  playing: 'Block the glowing tiles to trap the cat',
  won: 'You trapped the cat! Great reflexes.',
  lost: 'The cat escaped — try again!',
}

const createCell = (x: number, y: number): Cell => ({
  x,
  y,
  blocked: false,
  hasCat: false,
})

const createGrid = (): Grid =>
  Array.from({ length: GRID_WIDTH }, (_, x) =>
    Array.from({ length: GRID_HEIGHT }, (_, y) => createCell(x, y)),
  )

const serialize = ({ x, y }: Coordinates) => `${x}-${y}`

const isEdge = ({ x, y }: Coordinates) =>
  x === 0 || y === 0 || x === GRID_WIDTH - 1 || y === GRID_HEIGHT - 1

const neighborOffsets = {
  even: [
    { dx: 1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: -1 },
    { dx: 0, dy: 1 },
  ],
  odd: [
    { dx: 1, dy: 0 },
    { dx: -1, dy: -1 },
    { dx: 0, dy: -1 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 1 },
  ],
} as const

const getNeighbors = ({ x, y }: Coordinates): Coordinates[] => {
  const parity = y % 2 === 0 ? 'even' : 'odd'

  return neighborOffsets[parity]
    .map(({ dx, dy }) => ({ x: x + dx, y: y + dy }))
    .filter(
      (coord) =>
        coord.x >= 0 &&
        coord.x < GRID_WIDTH &&
        coord.y >= 0 &&
        coord.y < GRID_HEIGHT,
    )
}

type Node = Coordinates & { parent: Node | null }

const buildPath = (node: Node): Coordinates[] => {
  const path: Coordinates[] = []
  let current: Node | null = node

  while (current) {
    path.push({ x: current.x, y: current.y })
    current = current.parent
  }

  return path.reverse()
}

const findPath = (grid: Grid, start: Coordinates): Coordinates[] | null => {
  const queue: Node[] = [{ ...start, parent: null }]
  const visited = new Set([serialize(start)])

  while (queue.length > 0) {
    const current = queue.shift()!

    if (isEdge(current)) {
      return buildPath(current)
    }

    for (const neighbor of getNeighbors(current)) {
      const cell = grid[neighbor.x][neighbor.y]
      const key = serialize(neighbor)

      if (cell.blocked || visited.has(key)) continue

      visited.add(key)
      queue.push({ ...neighbor, parent: current })
    }
  }

  return null
}

const evaluateStatusFromPath = (path: Coordinates[] | null): GameStatus => {
  if (!path) return 'won'
  if (path.length === 1) return 'lost'
  return 'playing'
}

const cloneGrid = (grid: Grid): Grid =>
  grid.map((column) => column.map((cell) => ({ ...cell })))

const seedBlockedCells = (
  grid: Grid,
  exclude: Coordinates,
  blockedCount: number,
) => {
  const candidates: Coordinates[] = []

  for (let x = 0; x < GRID_WIDTH; x += 1) {
    for (let y = 0; y < GRID_HEIGHT; y += 1) {
      if (x === exclude.x && y === exclude.y) continue
      candidates.push({ x, y })
    }
  }

  const shuffled = shuffle(candidates)

  for (let i = 0; i < Math.min(blockedCount, shuffled.length); i += 1) {
    const { x, y } = shuffled[i]
    grid[x][y] = { ...grid[x][y], blocked: true }
  }
}

const shuffle = <T,>(entries: T[]): T[] => {
  const copy = [...entries]

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }

  return copy
}

const advanceCat = (
  grid: Grid,
  currentCat: Coordinates,
): { grid: Grid; cat: Coordinates; status: GameStatus } => {
  const path = findPath(grid, currentCat)
  const statusFromPath = evaluateStatusFromPath(path)

  if (statusFromPath !== 'playing') {
    return { grid, cat: currentCat, status: statusFromPath }
  }

  const [, nextStep] = path!

  grid[currentCat.x][currentCat.y] = {
    ...grid[currentCat.x][currentCat.y],
    hasCat: false,
  }

  grid[nextStep.x][nextStep.y] = {
    ...grid[nextStep.x][nextStep.y],
    hasCat: true,
  }

  const status = isEdge(nextStep) ? 'lost' : 'playing'

  return { grid, cat: nextStep, status }
}

const createGameState = (blockedCount = DEFAULT_BLOCKERS): GameState => {
  const grid = createGrid()
  const cat = {
    x: Math.floor(GRID_WIDTH / 2),
    y: Math.floor(GRID_HEIGHT / 2),
  }

  grid[cat.x][cat.y] = { ...grid[cat.x][cat.y], hasCat: true }
  seedBlockedCells(grid, cat, blockedCount)

  return {
    grid,
    cat,
    status: 'playing',
    moveCount: 0,
  }
}

export const useCatchTheCat = (initialBlockers = DEFAULT_BLOCKERS) => {
  const [game, setGame] = useState<GameState>(() =>
    createGameState(initialBlockers),
  )

  const layoutConfig = useMemo<LayoutConfig>(
    () => ({
      size: { x: 3.2, y: 3.2 },
      flat: false,
      spacing: 1.02,
      origin: { x: 0, y: 0 },
    }),
    [],
  )

  const hexCells = useMemo<HexCell[]>(() => {
    const cells: HexCell[] = []

    for (let y = 0; y < GRID_HEIGHT; y += 1) {
      for (let x = 0; x < GRID_WIDTH; x += 1) {
        const cell = game.grid[x][y]
        const q = x - Math.floor((y + (y % 2)) / 2)
        const r = y
        const s = -q - r

        cells.push({
          ...cell,
          q,
          r,
          s,
        })
      }
    }

    return cells
  }, [game.grid])

  const layoutDimension = useMemo(
    () => ({
      orientation: layoutConfig.flat ? FLAT_ORIENTATION : POINTY_ORIENTATION,
      size: layoutConfig.size,
      origin: layoutConfig.origin,
      spacing: layoutConfig.spacing,
    }),
    [layoutConfig],
  )

  const viewBox = useMemo(() => {
    const points = hexCells.map((cell) =>
      HexUtils.hexToPixel(cell, layoutDimension),
    )
    const xs = points.map((point) => point.x)
    const ys = points.map((point) => point.y)

    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    const paddingX = layoutConfig.size.x * 1.2
    const paddingY = layoutConfig.size.y * 1.2

    return `${minX - paddingX} ${minY - paddingY} ${
      maxX - minX + paddingX * 2
    } ${maxY - minY + paddingY * 2}`
  }, [hexCells, layoutConfig.size.x, layoutConfig.size.y, layoutDimension])

  const resetGame = (blockedCount = initialBlockers) => {
    setGame(createGameState(blockedCount))
  }

  const handleCellClick = (x: number, y: number) => {
    setGame((prev) => {
      if (prev.status !== 'playing') return prev

      const target = prev.grid[x][y]
      if (target.blocked || target.hasCat) return prev

      const nextGrid = cloneGrid(prev.grid)
      nextGrid[x][y] = { ...nextGrid[x][y], blocked: true }

      const { grid, cat, status } = advanceCat(nextGrid, prev.cat)

      return {
        grid,
        cat,
        status,
        moveCount: prev.moveCount + 1,
      }
    })
  }

  const handleHint = () => {
    setGame((prev) => {
      if (prev.status !== 'playing') return prev

      const nextGrid = cloneGrid(prev.grid)
      const path = findPath(nextGrid, prev.cat)
      const statusFromPath = evaluateStatusFromPath(path)

      if (statusFromPath !== 'playing') {
        return { ...prev, status: statusFromPath }
      }

      if (!path || path.length <= 1) return prev

      const [, hintCell] = path
      const target = nextGrid[hintCell.x][hintCell.y]

      if (target.blocked || target.hasCat) return prev

      nextGrid[hintCell.x][hintCell.y] = { ...target, blocked: true }

      const updatedStatus = evaluateStatusFromPath(
        findPath(nextGrid, prev.cat),
      )

      return {
        ...prev,
        grid: nextGrid,
        status: updatedStatus,
      }
    })
  }

  const isInteractive = (cell: Cell) =>
    game.status === 'playing' && !cell.blocked && !cell.hasCat

  return {
    game,
    layoutConfig,
    hexCells,
    viewBox,
    isInteractive,
    handleCellClick,
    handleHint,
    resetGame,
  }
}

