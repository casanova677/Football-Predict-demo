import { filterLeague, getFixturesById} from "@/api"
import LeagueMatches from "@/components/LeagueMatches";
import LeagueTable from "@/components/LeagueTable"
import Livescore from "@/components/Livescore";
import Standings from "@/components/Table";
import { FixtureType } from "@/types";

const English = async () => {
  const leagueId = 244 ;
  const getEnglishLeague = await getFixturesById(leagueId);
  const englishFixtures = getEnglishLeague.result;


  if (!englishFixtures ) {
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
            Premier League Standings
          </p>
          <Standings leagueId={leagueId} />
        </div>
      </div>
      
    );
  } else{

      return (
        <div className='w-full'>
          
          <Livescore leagueId={leagueId}/>
          
            <div key={englishFixtures.id}>
              <LeagueMatches leagueId={leagueId} data={englishFixtures} />
            </div>
          

          <div className="py-2 px-2 my-2">
            <p className="text-center justify-center py-2">Premier League Standings</p>
            <Standings leagueId={leagueId} />
          </div>
        </div>
      )
    }
}

export default English
