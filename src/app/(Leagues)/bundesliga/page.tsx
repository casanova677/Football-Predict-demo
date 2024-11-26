import { filterLeague, getFixturesById } from "@/api"
import LeagueMatches from "@/components/LeagueMatches";
import LeagueTable from "@/components/LeagueTable"
import Livescore from "@/components/Livescore";
import Standings from "@/components/Table"


const Bundesliga = async () => {
  
  const leagueId = 175 ;
  const getBundesliga = await getFixturesById(leagueId);
  const germanFixtures = getBundesliga.result;
  console.log(germanFixtures);

  if (!germanFixtures ) {
    return (
      <div className=" w-full">
        <div className="py-2 px-2 my-2">
        <Livescore leagueId={leagueId}/>
          <p className="text-center justify-center py-2">
            No Fixtures Today 
          </p>
        </div>

        <div className="py-2 px-2 my-2">
          <p className="text-center justify-center py-2">
          Bundesliga Standings
          </p>
          <Standings leagueId={leagueId} />
        </div>
      </div>
      
    );
  } else{

      return (
        <div className='w-full'>
          
          <Livescore leagueId={leagueId}/>

            <div key={germanFixtures.id}>
              <LeagueMatches data={germanFixtures} leagueId={leagueId} />
            </div>

            

          <div className="py-2 px-2 my-2">
            <p className="text-center justify-center py-2">Bundesliga Standings</p>
            <Standings leagueId={leagueId} />
          </div>
        </div>
      )
    }
}

export default Bundesliga