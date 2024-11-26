import Image from "next/image";
import { Team, Player } from "@/types";
import getFixturesByTeamId from "@/app/util/getFixturesByTeamId";
import { fetchTeamData, getFixturesById } from "@/api";
import Fixtures from "./components/Fixtures";
import LeagueTable from "@/components/LeagueTable";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function Team({ params }: PageProps) {
  let info: Team  = await fetchTeamData(parseInt(params.id));
  const teamInfo = info
  
  let ByTeamId = await getFixturesById(parseInt(params.id));
  const fixturesByTeamId = ByTeamId.result
 
  
  if (!teamInfo) {
    return (
      <div className="flex w-full justify-center items-center py-5">
        <div className="text-center text-neutral-100 text-lg">Team Info Not Available</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full justify-center items-center text-neutral-100 py-5 px-4 md:px-0 max-w-full">
      <div className="flex text-center justify-center flex-wrap md:flex-nowrap max-w-7xl w-full mb-3">

        {/* Team Info Section */}
        <div className="flex flex-col items-center w-full md:w-1/3 bg-gradient-to-r from-black/40 to-black/20 p-5 rounded-lg shadow-lg mb-6 md:mb-0">
          <Image
            src={teamInfo.team_logo}
            alt="Team Logo"
            width={150}
            height={150}
            className="rounded-lg mb-4"
          />
          <div className="text-3xl font-bold text-center">{teamInfo.team_name}</div>
         
          </div>
      </div>

        {/* Players List */}
        <div className="flex flex-col w-full md:w-2/3">
          <h2 className="text-2xl font-semibold mb-4 text-center">Team Players</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamInfo.players.map((player: Player) => (
              <div
                key={player.player_key}
                className="flex flex-col items-center bg-slate-600 p-4 rounded-lg shadow hover:bg-slate-700 transition-all duration-200"
              >
                <Image
                  src={player.player_image || "img/default-player.png"}
                  alt={player.player_name}
                  width={80}
                  height={80}
                  className="rounded-full mb-2"
                />
                <div className="text-xl font-semibold text-center">{player.player_name}</div>
                <div className="text-gray-300 text-center">{player.player_type}</div>
                <div className="text-gray-300 text-center">#{player.player_number || "N/A"}</div>
                <div className="text-gray-300 text-center">Age: {player.player_age || "N/A"}</div>
                <div className="text-gray-300 text-center">
                  Goals: {player.player_goals || "0"} | Matches: {player.player_match_played || "0"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      

  );
}
