import { filterLeague, getFixturesById } from "@/api";
import LeagueMatches from "@/components/LeagueMatches";
import LeagueTable from "@/components/LeagueTable";
import Livescore from "@/components/Livescore";
import Standings from "@/components/Table";
import { FixtureType } from "@/types";

const English = async () => {
  const leagueId = 152;
  const getEnglishLeague = await getFixturesById(leagueId);
  const englishFixtures = getEnglishLeague.result;

  if (!englishFixtures) {
    return (
      <div className="w-full space-y-6">
        <div className="p-4 space-y-4 rounded-lg shadow-md dark:bg-gray-700">
          <Livescore leagueId={leagueId} />
          <p className="text-center text-sm font-medium text-gray-500">
            No Fixtures Today
          </p>
        </div>

        <div className="p-4 space-y-4 rounded-lg shadow-md dark:bg-gray-700">
          <p className="text-center text-lg font-bold text-gray-500">
            Premier League Standings
          </p>
          <Standings leagueId={leagueId} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full space-y-6">
        <div className="p-4 space-y-4 rounded-lg shadow-md dark:bg-gray-700">
          <Livescore leagueId={leagueId} />
        </div>

        <div
          className="p-4 space-y-4 rounded-lg shadow-md dark:bg-gray-700"
          key={englishFixtures.id}
        >
          <LeagueMatches leagueId={leagueId} data={englishFixtures} />
        </div>

        <div className="p-4 space-y-4 rounded-lg shadow-md dark:bg-gray-700">
          <p className="text-center text-sm font-medium text-gray-500">
            Premier League Standings
          </p>
          <Standings leagueId={leagueId} />
        </div>
      </div>
    );
  }
};

export default English;
