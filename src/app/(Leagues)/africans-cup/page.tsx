import { filterLeague, getFixturesById } from "@/api";
import LeagueMatches from "@/components/LeagueMatches";
import LeagueTable from "@/components/LeagueTable";
import Livescore from "@/components/Livescore";
import Standings from "@/components/Table";

const Africansup = async () => {
  const leagueId = 29;

  try {
    const getPrimeiraLiga = await getFixturesById(leagueId);
    const primeFixtures = getPrimeiraLiga?.result || [];

    const sortedFixtures = Array.isArray(primeFixtures)
      ? primeFixtures.sort((a, b) => {
          if (typeof a.league_round === 'string' && typeof b.league_round === 'string') {
            return a.league_round.localeCompare(b.league_round);
          }
          return 0;
        })
      : [];

    if (!sortedFixtures.length) {
      return (
        <div className=" w-full">
          <div className="py-2 px-2 my-2">
            <p className="text-center justify-center py-2">No Fixtures Today</p>
          </div>
          <div className="py-2 px-2 my-2">
            <p className="text-center justify-center py-2">
              Primeira Liga Standings
            </p>
            <Standings leagueId={leagueId} />
          </div>
        </div>
      );
    }

    return (
      <div className="w-full">
        <Livescore leagueId={leagueId} />
        <div key={primeFixtures.id}>
          <LeagueMatches data={sortedFixtures} leagueId={leagueId} />
        </div>
        <div className="py-2 px-2 my-2">
          <p className="text-center justify-center py-2">Africans Cup of Nations Standings</p>
          <Standings leagueId={leagueId} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    return (
      <div className=" w-full">
        <p className="text-center justify-center py-2">Error fetching data</p>
      </div>
    );
  }
};

export default Africansup;
