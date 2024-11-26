import React from 'react';
import Competition from './Competition';
import Matches from './Matches';
import { FixtureType, matchesType } from '@/types';

interface LeagueTableProps {
  data: FixtureType[];
  

}



const LeagueTable: React.FC<LeagueTableProps> = React.memo(({ data }) => {
  
  return (
    <div className="py-3 px-2 md:px-3 rounded-md flex flex-col bg-[rgb(40,46,58)] mb-2">
      
      <Matches data={data}  />
    </div>
  );
});

export default LeagueTable;
