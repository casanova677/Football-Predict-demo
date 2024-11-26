'use client';
import { getLivescores } from "@/api";
import { LiveMatchData, LivescoreProps } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';

export default function LiveMatch() {
  const params = useParams();
  const { leagueId, event_key } = params;
  const [matchData, setMatchData] = useState<LiveMatchData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const liveScoresData = await getLivescores(Number(leagueId));
        const match = liveScoresData.result.find(
          (match: LiveMatchData) => match.event_key === Number(event_key)
        );
        console.log(match)
        setMatchData(match);
      } catch (error) {
        console.error("Error fetching match data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatchData();
  }, [leagueId, event_key]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading match details...</div>;
  }

  if (!matchData) {
    return <div className="text-center text-gray-500">Match data not available.</div>;
  }

  const {
    event_home_team,
    event_away_team,
    event_home_formation,
    event_away_formation,
    league_name,
    league_logo,
    event_date,
    event_time,
    event_stadium,
    event_status,
    event_final_result,
    home_team_logo,
    away_team_logo,
    goalscorers,
    substitutes,
    lineups,
    statistics,
  } = matchData;

  return (
    <div className="p-4 max-w-5xl mx-auto text-white">
      <h2 className="text-3xl font-bold text-center mb-5">{league_name}</h2>
      {league_logo && (
        <div className="flex justify-center items-center mb-6">
          <img src={league_logo} alt={league_name} className="w-10 h-10" />
        </div>
      )}

      {/* Match Header */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-gray-800 p-6 rounded-lg mb-6 shadow-md">
        <div className="flex flex-col items-center">
          <img src={home_team_logo} alt={event_home_team} className="w-16 h-16 mb-2" />
          <h3 className="text-2xl font-semibold">{event_home_team}</h3>
          <p className="text-md">Formation: {event_home_formation}</p>
          <p className="text-lg font-bold">{event_final_result.split(" - ")[0]}</p>
        </div>
        <div className="text-center text-gray-300">
          <p className="text-4xl font-bold mb-2">{event_final_result || "0 - 0"}</p>
          <p className={`text-lg font-semibold ${event_status === "FT" ? "text-green-500" : "text-red-500"}`}>
            {event_status === "FT" ? "Final Time" : "Live"}
          </p>
          <p>{event_time}, {event_date}</p>
          <p>{event_stadium || "Stadium Not Available"}</p>
        </div>
        <div className="flex flex-col items-center">
          <img src={away_team_logo} alt={event_away_team} className="w-16 h-16 mb-2" />
          <h3 className="text-2xl font-semibold">{event_away_team}</h3>
          <p className="text-md">Formation: {event_away_formation}</p>
          <p className="text-lg font-bold">{event_final_result.split(" - ")[1]}</p>
        </div>
      </div>

      {/* Goalscorers */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Goalscorers</h3>
        {goalscorers.length > 0 ? goalscorers.map((goal, index) => (
          <div key={index} className="flex justify-between p-2 bg-gray-700 rounded-md mb-2">
            <span>{goal.time}'</span>
            <span>{goal.home_scorer || "—"} {goal.home_assist && `(${goal.home_assist})`}</span>
            <span className="font-bold">{goal.score}</span>
            <span>{goal.away_scorer || "—"} {goal.away_assist && `(${goal.away_assist})`}</span>
          </div>
        )) : <p>No goals scored yet.</p>}
      </section>

      {/* Substitutions */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Substitutions</h3>
        {substitutes.length > 0 ? substitutes.map((sub, index) => (
          <div key={index} className="flex justify-between p-2 bg-gray-700 rounded-md mb-2">
            <span>{sub.time}'</span>
            <span>{sub.home_scorer?.in ? `In: ${sub.home_scorer.in}, Out: ${sub.home_scorer.out}` : "—"}</span>
            <span>{sub.away_scorer?.in ? `In: ${sub.away_scorer.in}, Out: ${sub.away_scorer.out}` : "—"}</span>
          </div>
        )) : <p>No substitutions yet.</p>}
      </section>

      {/* Lineups */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Lineups</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-lg font-semibold mb-2">{event_home_team} Starting Lineup</h4>
            {lineups.home_team?.starting_lineups.map((player, index) => (
              <div key={index} className="flex justify-between bg-gray-800 p-2 rounded-md mb-1">
                <span>{player.player_number}. {player.player}</span>
              </div>
            ))}
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">{event_away_team} Starting Lineup</h4>
            {lineups.away_team?.starting_lineups.map((player, index) => (
              <div key={index} className="flex justify-between bg-gray-800 p-2 rounded-md mb-1">
                <span>{player.player_number}. {player.player}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Match Statistics */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Match Statistics</h3>
        <div className="bg-gray-700 p-4 rounded-md">
          {statistics.map((stat, index) => (
            <div key={index} className="flex justify-between py-1">
              <span>{stat.type}</span>
              <span>{stat.home}</span>
              <span>{stat.away}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
