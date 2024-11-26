import { filterLeague, getFixturesById } from "@/api";
import LeagueMatches from "@/components/LeagueMatches";
import LeagueTable from "@/components/LeagueTable";
import Standings from "@/components/Table";

const PrimeiraLiga = async () => {
 
  const leagueId = 266 ;
  const getPrimeiraLiga = await getFixturesById(leagueId);
  const primeFixtures = getPrimeiraLiga.result;
  console.log(primeFixtures);

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
          
            <div key={primeFixtures.id}>
              <LeagueMatches data={primeFixtures}  leagueId={leagueId} />
            </div>
          

          <div className="py-2 px-2 my-2">
            <p className="text-center justify-center py-2">Primeira Liga Standings</p>
            <Standings leagueId={leagueId} />
          </div>
        </div>
      )
    }
};

export default PrimeiraLiga;
