'use client';
import React, { useState, useEffect } from 'react';
import { getEplTable, getStandingsFootball, getTopScorers } from '@/api';
import { ActiveTabType, GroupedStandings, Standing, TopScorer } from '@/types';
import { usePathname } from 'next/navigation';
import Image from 'next/image';



interface StandingsResponse {
  standings: Standing[];
}



const Table = ({ standings }: { standings: Standing[] }) => {
  return (
    <div className="overflow-x-auto py-3">
      <table className="table-auto w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">Position</th>
            <th scope="col" className="py-3 px-6">Team</th>
            <th scope="col" className="py-3 px-6">Played</th>
            <th scope="col" className="py-3 px-6">Won</th>
            <th scope="col" className="py-3 px-6">Drawn</th>
            <th scope="col" className="py-3 px-6">Lost</th>
            <th scope="col" className="py-3 px-6">GF</th>
            <th scope="col" className="py-3 px-6">GA</th>
            <th scope="col" className="py-3 px-6">GD</th>
            <th scope="col" className="py-3 px-6">Points</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing) => (
            <tr key={standing.team_key} className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900">
              <td className="py-4 px-6">{standing.standing_place}</td>
              <td className="py-4 px-6 flex items-center">
                <img src={standing.team_logo} alt={standing.standing_team} className="w-6 h-6 mr-2" />
                {standing.standing_team}
              </td>
              <td className="py-4 px-6">{standing.standing_P}</td>
              <td className="py-4 px-6">{standing.standing_W}</td>
              <td className="py-4 px-6">{standing.standing_D}</td>
              <td className="py-4 px-6">{standing.standing_L}</td>
              <td className="py-4 px-6">{standing.standing_F}</td>
              <td className="py-4 px-6">{standing.standing_A}</td>
              <td className="py-4 px-6">{standing.standing_GD}</td>
              <td className="py-4 px-6">{standing.standing_PTS}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const GroupedTable = ({standings}: { standings: Standing[] } )=>{
  // Group standings by league_round

  const groupedStandings: GroupedStandings = standings.reduce((acc, standing) => {
    const round = standing.league_round;
    
    if (!acc[round]) {
      acc[round] = [];
    }
    
    acc[round].push(standing);
    
    return acc;
  }, {} as GroupedStandings);

  return (
    <div className="overflow-x-auto py-3">
      {Object.entries(groupedStandings).map(([round, groupedData]) => (
        <div key={round} className="mb-8">
          {/* Heading for each league_round */}
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">{`Round: ${round}`}</h2>
          
          {/* Table for the current group */}
          <table className="table-auto w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6">Position</th>
                <th scope="col" className="py-3 px-6">Team</th>
                <th scope="col" className="py-3 px-6">Played</th>
                <th scope="col" className="py-3 px-6">Won</th>
                <th scope="col" className="py-3 px-6">Drawn</th>
                <th scope="col" className="py-3 px-6">Lost</th>
                <th scope="col" className="py-3 px-6">GF</th>
                <th scope="col" className="py-3 px-6">GA</th>
                <th scope="col" className="py-3 px-6">GD</th>
                <th scope="col" className="py-3 px-6">Points</th>
              </tr>
            </thead>
            <tbody>
              {groupedData.map((standing) => (
                <tr
                  key={standing.team_key}
                  className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                  <td className="py-4 px-6">{standing.standing_place}</td>
                  <td className="py-4 px-6 flex items-center">
                    <img
                      src={standing.team_logo}
                      alt={standing.standing_team}
                      className="w-6 h-6 mr-2"
                    />
                    {standing.standing_team}
                  </td>
                  <td className="py-4 px-6">{standing.standing_P}</td>
                  <td className="py-4 px-6">{standing.standing_W}</td>
                  <td className="py-4 px-6">{standing.standing_D}</td>
                  <td className="py-4 px-6">{standing.standing_L}</td>
                  <td className="py-4 px-6">{standing.standing_F}</td>
                  <td className="py-4 px-6">{standing.standing_A}</td>
                  <td className="py-4 px-6">{standing.standing_GD}</td>
                  <td className="py-4 px-6">{standing.standing_PTS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};


// Component to render the top scorers table
const TopScorersTable = ({ topScorers, teamLogos }: { topScorers: TopScorer[]; teamLogos:  any  }) => (
  <div className="overflow-x-auto py-3">
    <table className="table-auto w-full text-left text-sm text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th className="py-3 px-6">Position</th>
          <th className="py-3 px-6">Player</th>
          <th className="py-3 px-6">Team</th>
          <th className="py-3 px-6">Goals</th>
          <th className="py-3 px-6">Assists</th>
          <th className="py-3 px-6">Penalty Goals</th>
        </tr>
      </thead>
      
      <tbody>
      {topScorers.map((scorer, index) => {
          // Normalize team names for comparison
          const normalizedTeamName = scorer.team_key;
          const logoUrl = teamLogos[normalizedTeamName];
          
          return (
            <tr
              key={scorer.player_key}
              className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <td className="py-4 px-6">{index + 1}</td>
              <td className="py-4 px-6 ">
                {scorer.player_name}
              </td>
              <td className="py-4 px-6 flex items-center">
                {logoUrl && (
                    <Image
                      src={logoUrl}
                      alt={scorer.team_name}
                      className="w-6 h-6 mr-2"
                      width={20}
                      height={20}
                    />
                  )}
                {scorer.team_name}</td>
              <td className="py-4 px-6">{scorer.goals}</td>
              <td className="py-4 px-6">{scorer.assists ?? 0}</td>
              <td className="py-4 px-6">{scorer.penalty_goals}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

interface StandingsPropsI {
  leagueId: number;
}

const Standings: React.FC<StandingsPropsI> = ({ leagueId }) => {
  const [activeTab, setActiveTab] = useState<'standings' | 'topScorers'>('standings');
  const [standingsData, setStandingsData] = useState<Standing[]>();
  const [topScorersData, setTopScorersData] = useState<TopScorer[]>();
  const [teamLogos, setTeamLogos] = useState<{ [teamName: string]: string }>({});

  useEffect(() => {
    if (leagueId) {
      const fetchStandings = async () => {
        try {
          const standingsData = await getEplTable(leagueId);
          const logosMap: { [teamName: string]: string } = {};
          standingsData.result.total.forEach((team: Standing) => {
            logosMap[team.team_key] = team.team_logo;
          });
          setTeamLogos(logosMap);
         
          setStandingsData(standingsData.result.total);
          
        } catch (error) {
          console.error('Error fetching standings:', error);
        }
      };

      const fetchTopScorers = async () => {
        try {
          const data = await getTopScorers(leagueId);
          if (data && data.result) {
            const sortedScorers = [...data.result].sort((a: TopScorer, b: TopScorer) => b.goals - a.goals);
            
            setTopScorersData(sortedScorers);
           
          }
          
        } catch (error) {
          console.error('Error fetching top scorers:', error);
        }
      };

      fetchStandings();
      fetchTopScorers();
    }
  }, [leagueId]);

  const pathname = usePathname();
  const isSpecialLeague = pathname === '/africans-cup' || pathname === '/nations-league';

  return (
    <div>
      <div className="flex justify-center space-x-4 py-4">
        <button
          onClick={() => setActiveTab('standings')}
          className={`px-4 py-2 ${activeTab === 'standings' ? 'bg-blue-500 text-white' : 'bg-green-800'}`}
        >
          Standings
        </button>
        <button
          onClick={() => setActiveTab('topScorers')}
          className={`px-4 py-2 ${activeTab === 'topScorers' ? 'bg-blue-500 text-white' : 'bg-green-800'}`}
        >
          Top Scorers
        </button>
      </div>

      {/* Conditional rendering based on activeTab and pathname */}
      {activeTab === 'standings' && standingsData && (
        isSpecialLeague ? (
          <GroupedTable standings={standingsData} />
        ) : (
          <Table standings={standingsData} />
        )
      )}

      {activeTab === 'topScorers' && topScorersData && (
        <TopScorersTable topScorers={topScorersData} teamLogos={teamLogos} />
      )}

      {/* Fallback for missing data */}
      {activeTab === 'standings' && !standingsData && <p className='text-center justify-center'>No standings data available.</p>}
      {activeTab === 'topScorers' && !topScorersData && <p className='mt-6 text-center justify-center'>No top scorers data available.</p>}
    </div>
  );
};


export default Standings;
