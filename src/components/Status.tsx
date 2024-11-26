'use client'
import React, { useState } from 'react';
import { FixtureType, matchesType } from '@/types';
import LeagueTable from './LeagueTable';

interface StatusProps {
  matchesList: FixtureType[];
  matchesListFinished: FixtureType[];
}

const Status: React.FC<StatusProps> = ({ matchesList, matchesListFinished }) => {

  const [statusMatch, setStatusMatch] = useState<"TODAY" | "FINISHED">("TODAY");

  const filteredMatches = statusMatch === "TODAY"
    ? matchesList.filter(match => match.status === "TIMED")
    : matchesListFinished;
   

  return (
    <div>
      <div className="flex space-x-4 mb-2 md:mb-4 w-full">
        <button
          onClick={() => setStatusMatch("TODAY")}
          className={`px-2 py-1 text-primary text-xs md:text-sm rounded-md ${statusMatch === 'TODAY' ? 'bg-teal-400 font-semibold' : 'bg-slate-500 font-regular'}`}
        >
          Today
        </button>
       
      </div>

      <div className="w-full">
        
      <LeagueTable data={matchesList} />
      
      </div>
    </div>
  );
};

export default Status;
