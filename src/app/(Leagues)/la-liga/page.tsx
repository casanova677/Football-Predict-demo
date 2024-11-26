import { filterLeague, getFixturesById } from "@/api";
import LeagueMatches from "@/components/LeagueMatches";
import LeagueTable from "@/components/LeagueTable";
import Standings from "@/components/Table";

const LaLiga = async () => {

  const leagueId = 302 ;
  const getLaLiga = await getFixturesById(leagueId);
  const laligaFixtures = getLaLiga.result;
  console.log(laligaFixtures);

  if (!laligaFixtures ) {
    return (
      <div className=" w-full">
        <div className="py-2 px-2 my-2">
          <p className="text-center justify-center py-2">
            No Fixtures Today 
          </p>
        </div>

        <div className="py-2 px-2 my-2">
          <p className="text-center justify-center py-2">
            La Liga Standings
          </p>
          <Standings leagueId={leagueId} />
        </div>
      </div>
      
    );
  } else{

      return (
        <div className='w-full'>
          
           
            <div key={laligaFixtures.id}>
              <LeagueMatches data={laligaFixtures}  leagueId={leagueId} />
            </div>
          

          <div className="py-2 px-2 my-2">
            <p className="text-center justify-center py-2">La liga Standings</p>
            <Standings leagueId={leagueId} />
          </div>
        </div>
      )
    }
  
};

export default LaLiga;
