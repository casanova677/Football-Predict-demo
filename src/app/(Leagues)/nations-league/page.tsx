import { filterLeague, getFixturesById} from "@/api"
import LeagueMatches from "@/components/LeagueMatches";
import LeagueTable from "@/components/LeagueTable"
import Livescore from "@/components/Livescore";
import Standings from "@/components/Table";
import { FixtureType } from "@/types";

const Nations = async () => {
  const leagueId = 633 ;
  const getNationsLeague = await getFixturesById(leagueId);

  const NationsFixtures = getNationsLeague.result;
  console.log(NationsFixtures)


  if (!NationsFixtures ) {
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
            Nations League Standings
          </p>
          <Standings leagueId={leagueId} />
        </div>
      </div>
      
    );
  } else{

      return (
        <div className='w-full'>
          
          <Livescore leagueId={leagueId}/>
          
            <div key={NationsFixtures.id}>
              <LeagueMatches data={NationsFixtures}  leagueId={leagueId} />
            </div>
          

          <div className="py-2 px-2 my-2">
            <p className="text-center justify-center py-2">Nationss League Standings</p>
            <Standings leagueId={leagueId} />
          </div>
        </div>
      )
    }
}

export default Nations;