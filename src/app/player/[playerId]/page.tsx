// app/player/[playerId]/page.tsx
import ProtectedRoute from "@/components/ProtectedRoute";
import Player from "@/components/Player";

interface PlayerPageProps {
  params: { playerId: string };
}

export default function PlayerPage({ params }: PlayerPageProps) {
  return (
    <ProtectedRoute>
      <div className="flex justify-center items-center w-full">
        <Player params={{ playerId: Number(params.playerId) }} />
      </div>
    </ProtectedRoute>
  );
}