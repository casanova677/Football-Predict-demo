'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getEplTable, getTopScorers } from '@/api';
import { GroupedStandings, Standing, TopScorer } from '@/types';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface StandingsResponse {
  result: {
    total: Standing[];
  };
}

interface TopScorersResponse {
  result: TopScorer[];
}

const Table = React.memo(({ standings }: { standings: Standing[] }) => (
  <div className="overflow-x-auto py-3">
    <table className="table-auto w-full text-left text-sm text-gray-400">
      <thead className="text-xs uppercase bg-slate-700 text-gray-300">
        <tr>
          <th scope="col" className="py-3 px-6">Pos</th>
          <th scope="col" className="py-3 px-6">Team</th>
          <th scope="col" className="py-3 px-6">P</th>
          <th scope="col" className="py-3 px-6">W</th>
          <th scope="col" className="py-3 px-6">D</th>
          <th scope="col" className="py-3 px-6">L</th>
          <th scope="col" className="py-3 px-6">GF</th>
          <th scope="col" className="py-3 px-6">GA</th>
          <th scope="col" className="py-3 px-6">GD</th>
          <th scope="col" className="py-3 px-6">Pts</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((standing) => (
          <tr
            key={standing.team_key}
            className="bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <td className="py-4 px-6">{standing.standing_place}</td>
            <td className="py-4 px-6 flex items-center">
              <Image
                src={standing.team_logo || '/default-team-logo.png'}
                alt={standing.standing_team}
                width={24}
                height={24}
                className="mr-2 rounded-full"
              />
              <Link
                href={`/team/${standing.team_key}`}
                className="text-blue-400 hover:underline"
              >
                {standing.standing_team}
              </Link>
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
));

const GroupedTable = React.memo(({ standings }: { standings: Standing[] }) => {
  const groupedStandings: GroupedStandings = standings.reduce((acc, standing) => {
    const round = standing.league_round || 'Unknown';
    acc[round] = acc[round] || [];
    acc[round].push(standing);
    return acc;
  }, {} as GroupedStandings);

  return (
    <div className="overflow-x-auto py-3">
      {Object.entries(groupedStandings).map(([round, groupedData]) => (
        <div key={round} className="mb-8">
          <h2 className="text-lg font-semibold text-teal-200 mb-4">{`Round: ${round}`}</h2>
          <table className="table-auto w-full text-left text-sm text-gray-400">
            <thead className="text-xs uppercase bg-slate-700 text-gray-300">
              <tr>
                <th scope="col" className="py-3 px-6">Pos</th>
                <th scope="col" className="py-3 px-6">Team</th>
                <th scope="col" className="py-3 px-6">P</th>
                <th scope="col" className="py-3 px-6">W</th>
                <th scope="col" className="py-3 px-6">D</th>
                <th scope="col" className="py-3 px-6">L</th>
                <th scope="col" className="py-3 px-6">GF</th>
                <th scope="col" className="py-3 px-6">GA</th>
                <th scope="col" className="py-3 px-6">GD</th>
                <th scope="col" className="py-3 px-6">Pts</th>
              </tr>
            </thead>
            <tbody>
              {groupedData.map((standing) => (
                <tr
                  key={standing.team_key}
                  className="bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <td className="py-4 px-6">{standing.standing_place}</td>
                  <td className="py-4 px-6 flex items-center">
                    <Image
                      src={standing.team_logo || '/default-team-logo.png'}
                      alt={standing.standing_team}
                      width={24}
                      height={24}
                      className="mr-2 rounded-full"
                    />
                    <Link
                      href={`/team/${standing.team_key}`}
                      className="text-blue-400 hover:underline"
                    >
                      {standing.standing_team}
                    </Link>
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
});

const TopScorersTable = React.memo(
  ({ topScorers, teamLogos }: { topScorers: TopScorer[]; teamLogos: Record<string, string> }) => {
    let currentPosition = 1;
    let previousGoals = topScorers[0]?.goals ?? 0;

    return (
      <div className="overflow-x-auto py-3">
        <table className="table-auto w-full text-left text-sm text-gray-400">
          <thead className="text-xs uppercase bg-slate-700 text-gray-300">
            <tr>
              <th scope="col" className="py-3 px-6">Pos</th>
              <th scope="col" className="py-3 px-6">Player</th>
              <th scope="col" className="py-3 px-6">Team</th>
              <th scope="col" className="py-3 px-6">Goals</th>
              <th scope="col" className="py-3 px-6">Assists</th>
              <th scope="col" className="py-3 px-6">Penalties</th>
            </tr>
          </thead>
          <tbody>
            {topScorers.map((scorer, index) => {
              if (index > 0 && scorer.goals < previousGoals) {
                currentPosition = index + 1;
                previousGoals = scorer.goals;
              }
              const logoUrl = teamLogos[scorer.team_key];
              return (
                <tr
                  key={scorer.player_key}
                  className="bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <td className="py-4 px-6">{currentPosition}</td>
                  <td className="py-4 px-6">
                    <Link
                      href={`/player/${scorer.player_key}`}
                      className="text-blue-400 hover:underline"
                    >
                      {scorer.player_name}
                    </Link>
                  </td>
                  <td className="py-4 px-6 flex items-center">
                    {logoUrl && (
                      <Image
                        src={logoUrl}
                        alt={scorer.team_name}
                        width={24}
                        height={24}
                        className="mr-2 rounded-full"
                      />
                    )}
                    {scorer.team_name}
                  </td>
                  <td className="py-4 px-6">{scorer.goals}</td>
                  <td className="py-4 px-6">{scorer.assists ?? 0}</td>
                  <td className="py-4 px-6">{scorer.penalty_goals ?? 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
);

interface StandingsPropsI {
  leagueId: number;
}

const Standings: React.FC<StandingsPropsI> = ({ leagueId }) => {
  const [activeTab, setActiveTab] = useState<'standings' | 'topScorers'>('standings');
  const [standingsData, setStandingsData] = useState<Standing[]>([]);
  const [topScorersData, setTopScorersData] = useState<TopScorer[]>([]);
  const [teamLogos, setTeamLogos] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname();
  const isSpecialLeague = pathname === '/africans-cup' || pathname === '/nations-league';

  useEffect(() => {
    if (!leagueId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [standingsResponse, topScorersResponse] = await Promise.all([
          getEplTable(leagueId),
          getTopScorers(leagueId),
        ]);

        if (standingsResponse?.result?.total) {
          const logosMap: Record<string, string> = {};
          standingsResponse.result.total.forEach((team: Standing) => {
            logosMap[team.team_key] = team.team_logo;
          });
          setTeamLogos(logosMap);
          setStandingsData(standingsResponse.result.total);
        }

        if (topScorersResponse?.result) {
          const sortedScorers = [...topScorersResponse.result].sort(
            (a: TopScorer, b: TopScorer) => b.goals - a.goals
          );
          setTopScorersData(sortedScorers);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [leagueId]);

  const handleRetry = () => {
    setStandingsData([]);
    setTopScorersData([]);
    setError(null);
    setIsLoading(true);
    // Trigger useEffect by changing leagueId or manually calling fetch
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-teal-600 text-xl">
        <svg
          className="animate-spin h-8 w-8 mr-3"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
          />
        </svg>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
        <button
          onClick={handleRetry}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center space-x-4 py-4">
        <button
          onClick={() => setActiveTab('standings')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'standings'
              ? 'bg-teal-600 text-white'
              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
          }`}
        >
          Standings
        </button>
        <button
          onClick={() => setActiveTab('topScorers')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'topScorers'
              ? 'bg-teal-600 text-white'
              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
          }`}
        >
          Top Scorers
        </button>
      </div>

      {activeTab === 'standings' && standingsData.length > 0 && (
        isSpecialLeague ? (
          <GroupedTable standings={standingsData} />
        ) : (
          <Table standings={standingsData} />
        )
      )}
      {activeTab === 'standings' && standingsData.length === 0 && (
        <p className="text-center text-gray-500 py-6">No standings data available.</p>
      )}

      {activeTab === 'topScorers' && topScorersData.length > 0 && (
        <TopScorersTable topScorers={topScorersData} teamLogos={teamLogos} />
      )}
      {activeTab === 'topScorers' && topScorersData.length === 0 && (
        <p className="text-center text-gray-500 py-6">No top scorers data available.</p>
      )}
    </div>
  );
};

export default Standings;