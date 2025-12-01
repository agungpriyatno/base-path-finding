# Pathfinding Visualizer

An interactive visualization tool for pathfinding algorithms built with Next.js 16, TypeScript, and Tailwind CSS v4. Watch how algorithms like A\* and Dijkstra find the shortest path between two points while avoiding obstacles.

![Pathfinding Visualizer Demo](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **Multiple Pathfinding Algorithms**
  - A\* (A-Star) Algorithm
  - Dijkstra's Algorithm
- **Interactive Grid Interface**

  - Mode-based interaction (Draw obstacles, Set start point, Add endpoints)
  - Visual feedback for all actions
  - Customizable grid size (10x10 to 80x80)

- **Multiple Named Endpoints**

  - Create and name multiple destination points
  - Select which endpoint to pathfind to
  - Modal-based naming with form validation

- **Animated Visualization**

  - Watch visited nodes in real-time
  - See the shortest path highlighted
  - Adjustable animation speed

- **Modern UI/UX**
  - Dark/Light mode support
  - Responsive design
  - Glassmorphism effects
  - Built with shadcn/ui components

## 🧠 Algorithm Explanations

### A\* (A-Star) Algorithm

A\* is an **informed search algorithm** that uses heuristics to find the shortest path more efficiently than Dijkstra's algorithm.

**How it works:**

- Uses a combination of two costs:
  - **g(n)**: The actual cost from the start node to the current node
  - **h(n)**: The heuristic (estimated) cost from the current node to the end node
- **f(n) = g(n) + h(n)**: The total estimated cost
- Always explores the node with the lowest f(n) value first

**Advantages:**

- ✅ Faster than Dijkstra in most cases
- ✅ Guaranteed to find the shortest path (when using an admissible heuristic)
- ✅ More efficient - explores fewer nodes

**Use cases:**

- Navigation systems (GPS, game AI)
- Robot path planning
- Any scenario where you know the direction of the goal

### Dijkstra's Algorithm

Dijkstra's algorithm is an **uninformed search algorithm** that guarantees the shortest path by exploring all possible routes systematically.

**How it works:**

- Starts from the source node
- Explores all neighboring nodes
- Always visits the unvisited node with the smallest known distance
- Continues until the destination is reached

**Advantages:**

- ✅ Always finds the shortest path
- ✅ Works in all scenarios (doesn't need a heuristic)
- ✅ Simple and reliable

**Disadvantages:**

- ❌ Slower than A\* - explores more nodes
- ❌ Doesn't use any information about the goal location

**Use cases:**

- Network routing protocols
- Finding shortest paths in maps (when no heuristic available)
- Social network analysis

### Key Differences

| Aspect             | A\*                             | Dijkstra                       |
| ------------------ | ------------------------------- | ------------------------------ |
| **Type**           | Informed (uses heuristic)       | Uninformed                     |
| **Speed**          | Faster                          | Slower                         |
| **Nodes Explored** | Fewer                           | More                           |
| **Optimal Path**   | Yes (with admissible heuristic) | Yes                            |
| **Best for**       | When goal direction is known    | General shortest path problems |

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Form Handling**: react-hook-form
- **Validation**: Zod
- **Theme**: next-themes
- **Icons**: lucide-react

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd path-finding

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 Usage Guide

### 1. Select Interaction Mode

Choose what you want to do on the grid:

- **Draw**: Click and drag to create/remove obstacles
- **Set Start**: Click to place the start point (green)
- **Add End Point**: Click to place and name a new endpoint (red)

### 2. Create Your Maze

- Select "Draw" mode
- Click and drag on the grid to create walls/obstacles
- Place your start point and destination(s)

### 3. Choose Your Algorithm

Select either:

- **A\* Algorithm**: Faster, uses heuristics
- **Dijkstra**: Explores all paths, guaranteed shortest

### 4. Configure Settings

- **Grid Size**: Adjust from 10x10 to 80x80
- **Animation Speed**: Control how fast the visualization runs
- **Destination**: Select which endpoint to pathfind to (if multiple)

### 5. Run the Visualization

Click **"Start Pathfinding"** and watch:

- Blue cells = nodes being explored
- Primary colored path = shortest route found

### 6. Manage Your Session

- **Clear Path**: Remove the visualization but keep obstacles
- **Reset Grid**: Start fresh with an empty grid

## 🎨 Features in Detail

### Mode-Based Interaction

Unlike traditional drag-and-drop, this visualizer uses explicit modes:

- Clear visual feedback showing active mode
- Helper text explaining what each mode does
- Automatic mode reset after placing start/end points

### Multiple Named Endpoints

- Create multiple destinations with custom names
- Modal dialog with validation (1-20 characters)
- Select which endpoint to pathfind to
- Delete endpoints you no longer need

### Theme Support

Toggle between light and dark modes using the theme switcher in the top-right corner.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── algorithms/         # Algorithm implementations
│   │   ├── astar.ts
│   │   ├── dijkstra.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── providers/          # React context providers
│   ├── ui/                 # shadcn/ui components
│   ├── cell.tsx            # Grid cell component
│   ├── control-panel.tsx   # Control panel with settings
│   ├── end-point-name-modal.tsx  # Endpoint naming modal
│   ├── grid.tsx            # Main grid component
│   ├── mode-toggle.tsx     # Theme switcher
│   └── pathfinding-visualizer.tsx  # Main visualizer
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- Inspired by classic pathfinding visualizers
- Built with modern web technologies
- UI components from [shadcn/ui](https://ui.shadcn.com/)

---

**Happy Pathfinding! 🎯**
