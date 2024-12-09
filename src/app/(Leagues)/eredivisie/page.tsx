import { filterLeague, getFixturesById } from "@/api";
import LeagueMatches from "@/components/LeagueMatches";
import LeagueTable from "@/components/LeagueTable";
import Standings from "@/components/Table";
import React, { useMemo } from "react";

const Eredivisie = async () => {
  const leagueId = 152;
  const getCopaLibertadores = await getFixturesById(leagueId);
  const chiampionsFixtures = getCopaLibertadores.result;

  // Check if data is available
  if (!chiampionsFixtures) {
    return (
      <div className=" w-full">
        <div className="py-2 px-2 my-2">
          <p className="text-center justify-center py-2">No Fixtures Today</p>
        </div>

        <div className="py-2 px-2 my-2">
          <p className="text-center justify-center py-2">
          Eredivisie Standings
          </p>
          <Standings leagueId={leagueId} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full">
        <div key={chiampionsFixtures.id}>
          <LeagueMatches data={chiampionsFixtures} leagueId={leagueId} />
        </div>

        <div className="py-2 px-2 my-2">
          <p className="text-center justify-center py-2">
            Eredivisie Standings
          </p>
          <Standings leagueId={leagueId} />
        </div>
      </div>
    );
  }
};

export default Eredivisie;
