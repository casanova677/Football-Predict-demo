"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchH2HData, fetchTeamData } from "@/api/index";
import Image from "next/image";
import { H2HData } from "@/types";

const H2HPage = () => {
  const searchParams = useSearchParams();
  const homeTeamKeyParam = searchParams.get("homeTeamKey");
  const awayTeamKeyParam = searchParams.get("awayTeamKey");

  const [h2hData, setH2hData] = useState<H2HData | null>(null);
  const [loading, setLoading] = useState(true);
  const [homeTeamData, setHomeTeamData] = useState<any>(null);
  const [awayTeamData, setAwayTeamData] = useState<any>(null);
  

  useEffect(() => {
    const fetchData = async () => {
      if (homeTeamKeyParam && awayTeamKeyParam) {
        try {
          // Fetch H2H data
          const h2hResponse = await fetchH2HData(
            Number(homeTeamKeyParam),
            Number(awayTeamKeyParam)
          );
          setH2hData(h2hResponse);

          // Fetch team data using the team keys from H2H data
          const homeTeam = await fetchTeamData(Number(homeTeamKeyParam));
          const awayTeam = await fetchTeamData(Number(awayTeamKeyParam));

          setHomeTeamData(homeTeam);
          setAwayTeamData(awayTeam);
        } catch (error) {
          console.error("Error fetching H2H or team data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [homeTeamKeyParam, awayTeamKeyParam]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        Loading...
      </div>
    );
  }

  if (!h2hData || !h2hData.H2H) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        No H2H data found
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full py-10 px-4">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-teal-700 mb-4">
          Head-to-Head Comparison
        </h1>
  
        {/* Teams Overview */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center px-4 py-4 bg-slate-600 hover:bg-slate-700 rounded-md">
          <div className="text-center mb-4 md:mb-0">
            {homeTeamData && (
              <Image
                src={homeTeamData.team_logo}
                alt={homeTeamData.team_name}
                width={80}
                height={80}
                className="mx-auto"
              />
            )}
            <p className="text-lg font-semibold text-white">{h2hData.H2H[0].event_home_team}</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold text-white mb-2">{h2hData.H2H[0].league_name}</p>
            <p className="text-xs font-semibold text-gray-200">{h2hData.H2H[0].event_date}</p>
            <p className="text-xs font-semibold text-gray-200">{h2hData.H2H[0].event_time}</p>
          </div>
          <div className="text-center">
            {awayTeamData && (
              <Image
                src={awayTeamData.team_logo}
                alt={awayTeamData.team_name}
                width={80}
                height={80}
                className="mx-auto"
              />
            )}
            <p className="text-lg font-semibold text-white">{h2hData.H2H[0].event_away_team}</p>
          </div>
        </div>
  
        {/* Head-to-Head Matches */}
        <h2 className="text-xl font-semibold mb-4 text-center text-teal-700">Head-to-Head Matches</h2>
        <div className="space-y-4">
          {h2hData.H2H.map((match, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center md:justify-between px-4 py-3 bg-slate-600 hover:bg-slate-700 rounded-md space-y-2 md:space-y-0"
            >
              <p className="text-center md:text-left text-sm text-gray-200">
                {match.country_name} - {match.league_name}
              </p>
              <p className="text-center md:text-left text-sm text-gray-200">
                {match.event_date} - {match.event_time}
              </p>
              <p className="text-center text-white font-semibold flex items-center justify-center space-x-2">
                {homeTeamData && (
                  <Image
                    src={homeTeamData.team_logo}
                    alt={homeTeamData.team_name}
                    width={30}
                    height={30}
                    className="inline-block"
                  />
                )}
                <span>{match.event_home_team}</span>
                <span>{match.event_final_result}</span>
                <span>{match.event_away_team}</span>
                {awayTeamData && (
                  <Image
                    src={awayTeamData.team_logo}
                    alt={awayTeamData.team_name}
                    width={30}
                    height={30}
                    className="inline-block"
                  />
                )}
              </p>
            </div>
          ))}
        </div>
  
        {/* Recent Matches for Home Team */}
        <h2 className="text-xl font-semibold mt-6 mb-4 text-center text-teal-700">
          Recent Matches - {h2hData.H2H[0].event_home_team}
        </h2>
        <div className="space-y-4">
          {h2hData.firstTeamResults.map((match, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row justify-between items-center px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-md text-sm text-gray-200 space-y-2 md:space-y-0"
            >
              <p>{match.event_date} - {match.event_time}</p>
              <p className="text-center text-white font-semibold flex items-center justify-center space-x-2">
                {homeTeamData && (
                  <Image
                    src={homeTeamData.team_logo}
                    alt={homeTeamData.team_name}
                    width={30}
                    height={30}
                    className="inline-block"
                  />
                )}
                <span>{match.event_home_team}</span>
                <span>{match.event_final_result}</span>
                <span>{match.event_away_team}</span>
                {awayTeamData && (
                  <Image
                    src={awayTeamData.team_logo}
                    alt={awayTeamData.team_name}
                    width={30}
                    height={30}
                    className="inline-block"
                  />
                )}
              </p>
            </div>
          ))}
        </div>
  
        {/* Recent Matches for Away Team */}
        <h2 className="text-xl font-semibold mt-6 mb-4 text-center text-teal-700">
          Recent Matches - {h2hData.H2H[0].event_away_team}
        </h2>
        <div className="space-y-4">
          {h2hData.secondTeamResults.map((match, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row justify-between items-center px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-md text-sm text-gray-200 space-y-2 md:space-y-0"
            >
              <p>{match.event_date} - {match.event_time}</p>
              <p className="text-center text-white font-semibold flex items-center justify-center space-x-2">
                {homeTeamData && (
                  <Image
                    src={homeTeamData.team_logo}
                    alt={homeTeamData.team_name}
                    width={30}
                    height={30}
                    className="inline-block"
                  />
                )}
                <span>{match.event_home_team}</span>
                <span>{match.event_final_result}</span>
                <span>{match.event_away_team}</span>
                {awayTeamData && (
                  <Image
                    src={awayTeamData.team_logo}
                    alt={awayTeamData.team_name}
                    width={30}
                    height={30}
                    className="inline-block"
                  />
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
};

export default H2HPage;
