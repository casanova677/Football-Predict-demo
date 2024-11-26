import { filterLeague, getFixturesById } from "@/api";
import LeagueMatches from "@/components/LeagueMatches";
import LeagueTable from "@/components/LeagueTable";
import Standings from "@/components/Table";

const Ligue1 = async () => {
  
  const leagueId = 168 ;
  const getLigue1 = await getFixturesById(leagueId);
  const ligue1Fixtures = getLigue1.result;
  console.log(ligue1Fixtures);

  if (!ligue1Fixtures ) {
    return (
      <div className=" w-full">
        <div className="py-2 px-2 my-2">
          <p className="text-center justify-center py-2">
            No Fixtures Today 
          </p>
        </div>

        <div className="py-2 px-2 my-2">
          <p className="text-center justify-center py-2">
            Premier League Standings
          </p>
          <Standings leagueId={leagueId} />
        </div>
      </div>
      
    );
  } else{

      return (
        <div className='w-full'>
          
            <div key={ligue1Fixtures.id}>
              <LeagueMatches  leagueId={leagueId} data={ligue1Fixtures} />
            </div>
          

       
            <p className="text-center justify-center py-2">Premier League Standings</p>
            <Standings leagueId={leagueId} />
        
        </div>
      )
    }
  
};

export default Ligue1;
