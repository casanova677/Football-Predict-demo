import { filterLeague, getFixturesById } from '@/api'
import LeagueMatches from '@/components/LeagueMatches'
import LeagueTable from '@/components/LeagueTable'
import Livescore from '@/components/Livescore'
import Standings from '@/components/Table'

const Brasileiro = async () => {

  const leagueId = 99
  
  const getBrasileiro = await getFixturesById(leagueId);
  const BrasiloFixtures = getBrasileiro.result;
  

  if (!BrasiloFixtures ) {
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
          
            <div key={BrasiloFixtures.id}>
              <LeagueMatches data={BrasiloFixtures}  leagueId={leagueId} />
            </div>
          

          <div className="py-2 px-2 my-2">
            <p className="text-center justify-center py-2">Nations League Standings</p>
            <Standings leagueId={leagueId} />
          </div>
        </div>
      )
    }
}

export default Brasileiro