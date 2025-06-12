// components/Team.tsx
import { getTeam } from "@/api/index";
import { Team as TeamType, Player } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface TeamPageProps {
  params: { teamId: number };
}

export default async function Team({ params }: TeamPageProps) {
  const { teamId } = params;

  try {
    const teamData = await getTeam(teamId);

    if (!teamData || !teamData.result || teamData.result.length === 0) {
      notFound();
    }

    const team: TeamType = teamData.result[0];
    const players: Player[] = team.players || [];

    // Group players by position
    const groupedPlayers = players.reduce((acc, player) => {
      const type = player.player_type || "Unknown";
      acc[type] = acc[type] || [];
      acc[type].push(player);
      return acc;
    }, {} as Record<string, Player[]>);

    const positionOrder = ["Goalkeepers", "Defenders", "Midfielders", "Forwards", "Unknown"];

    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto">
          {/* Team Header */}
          <div className="text-center mb-12">
            <Image
              src={team.team_logo || "/default-team-logo.png"}
              alt={`${team.team_name} logo`}
              width={150}
              height={150}
              className="rounded-full mx-auto shadow-lg"
              priority
            />
            <h1 className="text-4xl md:text-5xl font-bold text-teal-400 mt-6">
              {team.team_name}
            </h1>
            <p className="text-lg text-gray-400 mt-2">Team ID: {team.team_key}</p>
          </div>

          {/* Squad Section */}
          <div className="rounded-xl p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-teal-800 mb-6">Squad</h2>
            {players.length > 0 ? (
              positionOrder.map((position) =>
                groupedPlayers[position] && groupedPlayers[position].length > 0 ? (
                  <div key={position} className="mb-8">
                    <h3 className="text-xl font-semibold text-teal-200 mb-4">
                      {position}
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-200 text-gray-900">
                          <tr>
                            <th className="p-3 rounded-tl-lg">Player</th>
                            <th className="p-3">No.</th>
                            <th className="p-3">Age</th>
                            <th className="p-3">Matches</th>
                            <th className="p-3">Goals</th>
                            <th className="p-3">Yellow</th>
                            <th className="p-3 rounded-tr-lg">Red</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupedPlayers[position].map((player) => (
                            <tr
                              key={player.player_key}
                              className="border-b border-gray-300 hover:bg-gray-600 transition-colors duration-200"
                            >
                              <td className="p-3">
                                <Link
                                  href={`/player/${player.player_key}`}
                                  className="flex items-center gap-3 whitespace-nowrap text-blue-600 hover:underline"
                                >
                                  <Image
                                    src={player.player_image || "/default-player.png"}
                                    alt={`${player.player_name} image`}
                                    width={32}
                                    height={32}
                                    className="rounded-full player-image"
                                  />
                                  <span>{player.player_name}</span>
                                </Link>
                              </td>
                              <td className="p-3">{player.player_number || "-"}</td>
                              <td className="p-3">{player.player_age || "-"}</td>
                              <td className="p-3">{player.player_match_played || "0"}</td>
                              <td className="p-3">{player.player_goals || "0"}</td>
                              <td className="p-3">{player.player_yellow_cards || "0"}</td>
                              <td className="p-3">{player.player_red_cards || "0"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null
              )
            ) : (
              <p className="text-gray-500 text-center">No player data available.</p>
            )}
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-teal-500 hover:text-teal-400 underline transition-colors duration-300"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching team data:", error);
    notFound();
  }
}