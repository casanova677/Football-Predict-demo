'use client'
import { getLivescores } from "@/api";
import { LiveMatch, LivescoreProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Competition from "./Competition";
import LoadingComponent from "@/app/components/LoadingComponent";

export default function Livescore({ leagueId }: LivescoreProps) {
  const [liveScores, setLiveScores] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLivescores(leagueId);
        setLiveScores(data.result);
      } catch (error) {
        console.error("Error fetching live scores:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [leagueId]);

  if (loading) {
    return (< LoadingComponent color={"green"} />)
    
  }

  if (!liveScores || liveScores.length === 0) {
    return <div className="text-center text-gray-500 py-8 dark:bg-gray-700">No live matches available.</div>;
  }

  return (
    <div className="p-4 max-w-4xl  dark:bg-gray-700 ">
      <h2 className="text-2xl font-bold text-center mb-6 text-teal-500">Live Scores</h2>
      
      <div className="space-y-4">
        {liveScores.map((match) => (
          <Link key={match.event_key} href={`/live-match/${leagueId}/${match.event_key.toString()}`}>
            <div className="bg-gray-800 p-5 rounded-lg shadow-lg flex flex-col space-y-4 hover:bg-gray-700 transition-colors cursor-pointer">
              {/* League Info */}
             <Competition data={match}/>

              {/* Match Info */}
              <div className="flex items-center justify-between">
                {/* Home Team */}
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-bold text-white">{match.event_home_team}</h3>
                  <p className="text-2xl font-semibold text-teal-400">
                    {match.event_final_result.split(" - ")[0] || "0"}
                  </p>
                </div>

                {/* Time */}
                <div className="text-center">
                  <div className="text-gray-400 text-sm">{match.event_time}</div>
                  <div className={`mt-2 px-2 py-1 rounded-full text-xs font-semibold ${
                    match.event_status === "FT" ? "bg-red-600 text-white" : "bg-green-600 text-white"
                  }`}>
                    {match.event_status === "FT" ? "Final Time" : "Live"}
                  </div>
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-bold text-white">{match.event_away_team}</h3>
                  <p className="text-2xl font-semibold text-teal-400">
                    {match.event_final_result.split(" - ")[1] || "0"}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
