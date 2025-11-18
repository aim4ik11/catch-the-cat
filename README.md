# Catch the Cat 🐱

A web-based puzzle game where you must trap a cat by strategically blocking hex tiles before it reaches the edge of the board. Built with React, TypeScript, and Vite.

![Game Screenshot](https://via.placeholder.com/800x400?text=Catch+the+Cat+Game)

## 🎮 How to Play

1. **Click** on any open hex tile to place a blocker
2. The cat will automatically move one step toward the nearest edge each turn
3. **Win** by blocking all possible paths to the edge, trapping the cat
4. **Lose** if the cat reaches any edge of the board

### Features

- 🎯 **Hint System**: Get suggestions on optimal blocking moves
- 📊 **Move Counter**: Track your progress
- 🎨 **Responsive Design**: Play on desktop or mobile devices
- ♿ **Accessible**: Full keyboard navigation support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/catch-the-cat.git
cd catch-the-cat
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🏗️ Project Structure

```
catch-the-cat/
├── src/
│   ├── components/          # React components
│   │   ├── ControlPanel.tsx # Game controls and status
│   │   └── HexBoard.tsx     # Hexagonal grid board
│   ├── hooks/
│   │   └── useCatchTheCat.ts # Game logic and state management
│   ├── assets/
│   │   └── catch-the-cat/
│   │       └── cat.png      # Cat sprite
│   ├── App.tsx              # Main app component
│   ├── App.css              # App styles
│   ├── index.css            # Global styles
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── index.html               # HTML template
└── package.json             # Dependencies and scripts
```

## 🧩 Technical Details

### Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **react-hexgrid** - Hexagonal grid rendering

### Game Logic

The game uses a **Breadth-First Search (BFS)** algorithm to:
- Find the shortest path from the cat's position to any edge
- Determine optimal cat movement
- Check win/loss conditions

### Hexagonal Grid

The game uses an **even-r (pointy-top)** hexagonal coordinate system:
- Each hex has axial coordinates (q, r, s)
- Neighbor calculation accounts for row parity
- Responsive layout adapts to screen size

## 🎨 Customization

### Grid Size

Modify `GRID_WIDTH` and `GRID_HEIGHT` in `src/hooks/useCatchTheCat.ts`:

```typescript
const GRID_WIDTH = 11
const GRID_HEIGHT = 11
```

### Initial Blockers

Change `INITIAL_BLOCKERS` to adjust starting difficulty:

```typescript
const INITIAL_BLOCKERS = 10
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the original Unity "Catch the Virus" mini-game
- Built with modern React patterns and best practices

---

Made with ❤️ using React and TypeScript
