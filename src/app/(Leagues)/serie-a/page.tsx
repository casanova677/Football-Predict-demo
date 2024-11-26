import { filterLeague, getFixturesById } from "@/api";
import LeagueTable from "@/components/LeagueTable";
import Standings from "@/components/Table";


const SerieA = async () => {

  const leagueId = 207 ;
  const serieAData = await getFixturesById(leagueId);
  const seriAFixtures = serieAData.result;
  console.log(seriAFixtures);

  if (!seriAFixtures ) {
    return (
      <div className=" w-full">
        <div className="py-2 px-2 my-2">
          <p className="text-center justify-center py-2">
            No Fixtures Today 
          </p>
        </div>

        <div className="py-2 px-2 my-2">
          <p className="text-center justify-center py-2">
            Serie A Standings
          </p>
          <Standings leagueId={leagueId} />
        </div>
      </div>
      
    );
  } else{

      return (
        <div className='w-full'>
          
            <div key={seriAFixtures.id}>
              <LeagueTable data={seriAFixtures} />
            </div>
          

          <div className="py-2 px-2 my-2">
            <p className="text-center justify-center py-2">Serie A Standings</p>
            <Standings leagueId={leagueId} />
          </div>
        </div>
      )
    }
};

export default SerieA;
