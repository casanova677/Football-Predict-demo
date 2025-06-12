// app/team/[teamId]/page.tsx
import ProtectedRoute from "@/components/ProtectedRoute";
import Team from "@/components/Team";

interface TeamPageProps {
  params: { teamId: string }; // teamId is a string in params
}

export default function TeamPage({ params }: TeamPageProps) {
  return (
    <ProtectedRoute>
      <div className="flex justify-center items-center w-full">
        <Team params={{ teamId: Number(params.teamId) }} />
      </div>
    </ProtectedRoute>
  );
}