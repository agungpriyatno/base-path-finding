import { ModeToggle } from "@/components/mode-toggle";
import { PathfindingVisualizer } from "@/components/pathfinding-visualizer";

export default function Home() {
  return (
    <main className="h-screen w-screen relative bg-background">
      <PathfindingVisualizer />
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
    </main>
  );
}
