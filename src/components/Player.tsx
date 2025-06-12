// components/Player.tsx
import { getPlayer } from "@/api/index";
import { Player as PlayerType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PlayerPageProps {
  params: { playerId: number };
}

export default async function Player({ params }: PlayerPageProps) {
  const { playerId } = params;

  try {
    const playerData = await getPlayer(playerId);

    if (!playerData || !playerData.result || playerData.result.length === 0) {
      notFound();
    }

    const player: PlayerType = playerData.result[0];

    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto">
          {/* Player Header */}
          <div className="text-center mb-12">
            <Image
              src={player.player_image || "/default-player.png"}
              alt={`${player.player_name} image`}
              width={120}
              height={120}
              className="rounded-full mx-auto shadow-lg"
              priority
            />
            <h1 className="text-4xl md:text-5xl font-bold text-teal-400 mt-6">
              {player.player_name}
            </h1>
            <p className="text-lg text-gray-400 mt-2">
              {player.player_number ? `No. ${player.player_number} | ` : ""}
              {player.player_type} | {player.team_name}
            </p>
            <Link
              href={`/team/${player.team_key}`}
              className="text-blue-400 hover:text-blue-300 underline mt-2 inline-block"
            >
              View {player.team_name} Team
            </Link>
          </div>

          {/* Player Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Info */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-semibold text-teal-300 mb-4">General Information</h2>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Age:</span> {player.player_age || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Country:</span> {player.player_country || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Injured:</span> {player.player_injured || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Captain:</span>{" "}
                {player.player_is_captain === "1" ? "Yes" : "No"}
              </p>
            </div>

            {/* Performance Stats */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-semibold text-teal-300 mb-4">Performance Stats</h2>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Matches Played:</span>{" "}
                {player.player_match_played || "0"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Minutes:</span> {player.player_minutes || "0"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Goals:</span> {player.player_goals || "0"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Assists:</span> {player.player_assists || "0"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Shots Total:</span>{" "}
                {player.player_shots_total || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Key Passes:</span>{" "}
                {player.player_key_passes || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Passes:</span> {player.player_passes || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Pass Accuracy:</span>{" "}
                {player.player_passes_accuracy || "N/A"}
              </p>
            </div>

            {/* Disciplinary Stats */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-semibold text-teal-300 mb-4">Disciplinary Stats</h2>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Yellow Cards:</span>{" "}
                {player.player_yellow_cards || "0"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Red Cards:</span>{" "}
                {player.player_red_cards || "0"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Fouls Committed:</span>{" "}
                {player.player_fouls_commited || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Penalties Committed:</span>{" "}
                {player.player_pen_comm || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Penalties Won:</span>{" "}
                {player.player_pen_won || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Penalties Scored:</span>{" "}
                {player.player_pen_scored || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Penalties Missed:</span>{" "}
                {player.player_pen_missed || "N/A"}
              </p>
            </div>

            {/* Defensive Stats */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-semibold text-teal-300 mb-4">Defensive Stats</h2>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Tackles:</span> {player.player_tackles || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Blocks:</span> {player.player_blocks || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Interceptions:</span>{" "}
                {player.player_interceptions || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Clearances:</span>{" "}
                {player.player_clearances || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Saves:</span> {player.player_saves || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Inside Box Saves:</span>{" "}
                {player.player_inside_box_saves || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Goals Conceded:</span>{" "}
                {player.player_goals_conceded || "N/A"}
              </p>
            </div>

            {/* Dribbling & Duels */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-md md:col-span-2">
              <h2 className="text-xl font-semibold text-teal-300 mb-4">Dribbling & Duels</h2>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Duels Total:</span>{" "}
                {player.player_duels_total || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Duels Won:</span>{" "}
                {player.player_duels_won || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Dribble Attempts:</span>{" "}
                {player.player_dribble_attempts || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Dribble Success:</span>{" "}
                {player.player_dribble_succ || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Dispossessed:</span>{" "}
                {player.player_dispossesed || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Crosses Total:</span>{" "}
                {player.player_crosses_total || "N/A"}
              </p>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-teal-400 hover:text-teal-300 underline transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching player data:", error);
    notFound();
  }
}