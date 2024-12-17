import { filterLeague, getFixturesById } from "@/api";
import LeagueMatches from "@/components/LeagueMatches";
import LeagueTable from "@/components/LeagueTable";
import Livescore from "@/components/Livescore";
import Standings from "@/components/Table";

const Africansup = async () => {
 
  const leagueId = 29 ;
  const getPrimeiraLiga = await getFixturesById(leagueId);
  const primeFixtures = getPrimeiraLiga.result;
  

  const sortedFixtures = primeFixtures.sort((a: { league_round: string; }, b: { league_round: any; }) => {
    
    if (typeof a.league_round === 'string' && typeof b.league_round === 'string') {
      return a.league_round.localeCompare(b.league_round);
    }
    return 0;
  });

 

  if (!primeFixtures ) {
    return (
      <div className=" w-full">
        <div className="py-2 px-2 my-2">
          <p className="text-center justify-center py-2">
            No Fixtures Today 
          </p>
        </div>

        <div className="py-2 px-2 my-2">
          <p className="text-center justify-center py-2">
            Primeira Liga Standings
          </p>
          <Standings leagueId={leagueId} />
        </div>
      </div>
      
    );
  } else{

      return (
        <div className='w-full'>

            <Livescore leagueId={leagueId} />
          
            <div key={primeFixtures.id}>
              <LeagueMatches data={sortedFixtures}  leagueId={leagueId} />
            </div>
          

          <div className="py-2 px-2 my-2">
            <p className="text-center justify-center py-2">Africans Cup of Nations Standings</p>
            <Standings leagueId={leagueId} />
          </div>
        </div>
      )
    }
};

export default Africansup;
