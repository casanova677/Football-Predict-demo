"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchH2HData, fetchTeamData, getLeague } from "@/api/index";
import Image from "next/image";
import Link from "next/link";
import { H2HData } from "@/types";

const H2HPageContent = () => {
  const searchParams = useSearchParams();
  const homeTeamKeyParam = searchParams.get("homeTeamKey");
  const awayTeamKeyParam = searchParams.get("awayTeamKey");

  const [h2hData, setH2hData] = useState<H2HData | null>(null);
  const [loading, setLoading] = useState(true);
  const [homeTeamData, setHomeTeamData] = useState<any>(null);
  const [awayTeamData, setAwayTeamData] = useState<any>(null);
  const [leagueLogo, setLeagueLogo] = useState<string | null>(null);
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (homeTeamKeyParam && awayTeamKeyParam) {
        try {
          const h2hResponse = await fetchH2HData(
            Number(homeTeamKeyParam),
            Number(awayTeamKeyParam)
          );
          setH2hData(h2hResponse);

          const homeTeam = await fetchTeamData(Number(homeTeamKeyParam));
          const awayTeam = await fetchTeamData(Number(awayTeamKeyParam));

          const leagueData = await getLeague(
            Number(h2hResponse.H2H[0].event_country_key)
          );
          if (leagueData?.result?.length > 0) {
            const targetLeagueKey = h2hResponse.H2H[0].league_key;
            const matchingLeague = leagueData.result.find(
              (league: { league_key: any }) =>
                league.league_key === targetLeagueKey
            );
            setLeagueLogo(
              matchingLeague?.league_logo || "/default-league-logo.png"
            );
          } else {
            console.warn("No league data available");
            setLeagueLogo("/default-league-logo.png");
          }

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

  const getMatchResult = (match: any, teamKey: string) => {
    const [homeScore, awayScore] = match.event_final_result
      .split(" - ")
      .map((score: string) => parseInt(score));
    if (match.home_team_key === teamKey) {
      if (homeScore > awayScore) return "win";
      if (homeScore < awayScore) return "loss";
      return "draw";
    } else {
      if (awayScore > homeScore) return "win";
      if (awayScore < homeScore) return "loss";
      return "draw";
    }
  };

  const getOpponent = (match: any, teamKey: string) => {
    return {
      name:
        match.home_team_key === teamKey
          ? match.event_away_team
          : match.event_home_team,
      key:
        match.home_team_key === teamKey
          ? match.away_team_key
          : match.home_team_key,
    };
  };

  const calculateGoals = (teamResults: any[], teamKey: string) => {
    return teamResults.slice(0, 5).reduce(
      (acc, match) => {
        const [homeScore, awayScore] = match.event_final_result
          .split(" - ")
          .map((score: string) => parseInt(score));
        if (match.home_team_key === teamKey) {
          acc.scored += homeScore;
          acc.conceded += awayScore;
        } else {
          acc.scored += awayScore;
          acc.conceded += homeScore;
        }
        return acc;
      },
      { scored: 0, conceded: 0 }
    );
  };

  const renderRecentForm = (teamResults: any[], teamKey: string) => {
    // Filter out self-matches and take the first 5 valid matches
    const validMatches = teamResults
      .filter((match) => match.home_team_key !== match.away_team_key)
      .slice(0, 5);

    return validMatches.map((match: any, index: number) => {
      const result = getMatchResult(match, teamKey);
      const opponent = getOpponent(match, teamKey);
      const colorClass =
        result === "win"
          ? "bg-green-500"
          : result === "loss"
          ? "bg-red-500"
          : "bg-gray-500";
      return (
        <li
          key={`${match.event_key}-${index}`}
          className="flex items-center space-x-4 py-2 border-b border-gray-700 last:border-b-0"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm ${colorClass}`}
            title={`${match.event_final_result} vs ${
              opponent.name
            } (${result.toUpperCase()})`}
          >
            {match.event_final_result}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-300">
              vs{" "}
              <Link
                href={`/team/${opponent.key}`}
                className="text-blue-400 hover:underline"
              >
                {opponent.name}
              </Link>
            </p>
            <p className="text-xs text-gray-500">
              {result.charAt(0).toUpperCase() + result.slice(1)}
            </p>
            <p className="text-xs text-gray-500">
              {match.league_name}, {match.event_date}
            </p>
          </div>
        </li>
      );
    });
  };

  const toggleMatchDetails = (matchKey: string) => {
    setExpandedMatch(expandedMatch === matchKey ? null : matchKey);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700 text-xl">
        <svg
          className="animate-spin h-8 w-8 mr-3 text-teal-600"
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
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
          ></path>
        </svg>
        Loading...
      </div>
    );
  }

  if (!h2hData || !h2hData.H2H) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl">
        No Head-to-Head data found
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-teal-200 mb-8">
        Head-to-Head Comparison
      </h1>

      {/* Teams Overview */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 shadow-md">
        <div className="text-center mb-6 md:mb-0">
          {homeTeamData && (
            <Image
              src={homeTeamData.team_logo || "/default-team-logo.png"}
              alt={homeTeamData.team_name}
              width={100}
              height={100}
              className="mx-auto rounded-full"
              priority
            />
          )}
          <p className="text-xl font-semibold text-white mt-2">
            <Link
              href={`/team/${homeTeamKeyParam}`}
              className="text-blue-400 hover:underline"
            >
              {h2hData.H2H[0].event_home_team}
            </Link>
          </p>
        </div>
        <div className="text-center">
          {leagueLogo && (
            <Image
              src={leagueLogo}
              alt={h2hData.H2H[0].league_name}
              width={60}
              height={60}
              className="mx-auto mb-2 rounded-full"
              priority
            />
          )}
          <p className="text-2xl font-bold text-white mb-2">
            {h2hData.H2H[0].league_name}
          </p>
          <p className="text-sm text-gray-300">{h2hData.H2H[0].event_date}</p>
          <p className="text-sm text-gray-300">{h2hData.H2H[0].event_time}</p>
        </div>
        <div className="text-center mt-6 md:mt-0">
          {awayTeamData && (
            <Image
              src={awayTeamData.team_logo || "/default-team-logo.png"}
              alt={awayTeamData.team_name}
              width={100}
              height={100}
              className="mx-auto rounded-full"
              priority
            />
          )}
          <p className="text-xl font-semibold text-white mt-2">
            <Link
              href={`/team/${awayTeamKeyParam}`}
              className="text-blue-400 hover:underline"
            >
              {h2hData.H2H[0].event_away_team}
            </Link>
          </p>
        </div>
      </div>

      {/* Team Stats */}
      <h2 className="text-2xl font-semibold mb-6 text-center text-teal-200">
        Team Statistics
      </h2>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-white mb-4">
            <Link
              href={`/team/${homeTeamKeyParam}`}
              className="text-blue-400 hover:underline"
            >
              {h2hData.H2H[0].event_home_team}
            </Link>{" "}
            Recent Form
          </h3>
           <div className="flex flex-col space-y-4">
            {h2hData.secondTeamResults &&
            h2hData.secondTeamResults.length > 0 ? (
              <>
                <ul className="space-y-2">
                  {renderRecentForm(
                    h2hData.secondTeamResults,
                    awayTeamKeyParam!
                  )}
                </ul>
                <div className="text-sm text-gray-300">
                  <p>
                    <span className="font-semibold">Goals Scored:</span>{" "}
                    {
                      calculateGoals(
                        h2hData.secondTeamResults,
                        awayTeamKeyParam!
                      ).scored
                    }
                  </p>
                  <p>
                    <span className="font-semibold">Goals Conceded:</span>{" "}
                    {
                      calculateGoals(
                        h2hData.secondTeamResults,
                        awayTeamKeyParam!
                      ).conceded
                    }
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">No recent matches found</p>
            )}
          </div>

         
        </div>
        <div className="bg-slate-800 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-white mb-4">
            <Link
              href={`/team/${awayTeamKeyParam}`}
              className="text-blue-400 hover:underline"
            >
              {h2hData.H2H[0].event_away_team}
            </Link>{" "}
            Recent Form
          </h3>
             <div className="flex flex-col space-y-4">
            {h2hData.firstTeamResults && h2hData.firstTeamResults.length > 0 ? (
              <>
                <ul className="space-y-2">
                  {renderRecentForm(
                    h2hData.firstTeamResults,
                    homeTeamKeyParam!
                  )}
                </ul>
                <div className="text-sm text-gray-300">
                  <p>
                    <span className="font-semibold">Goals Scored:</span>{" "}
                    {
                      calculateGoals(
                        h2hData.firstTeamResults,
                        homeTeamKeyParam!
                      ).scored
                    }
                  </p>
                  <p>
                    <span className="font-semibold">Goals Conceded:</span>{" "}
                    {
                      calculateGoals(
                        h2hData.firstTeamResults,
                        homeTeamKeyParam!
                      ).conceded
                    }
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">No recent matches found</p>
            )}
          </div>
        </div>
      </div>

      {/* Head-to-Head Matches */}
      <h2 className="text-2xl font-semibold mb-6 text-center text-teal-200">
        Previous Encounters
      </h2>
      <div className="space-y-4">
        {h2hData.H2H.map((match, index) => (
          <div key={index} className="match-card rounded-lg shadow-sm">
            <div
              className="flex flex-col md:flex-row items-center justify-between bg-slate-600 hover:bg-slate-700 rounded-lg p-4 transition-colors duration-200 cursor-pointer"
              onClick={() => toggleMatchDetails(String(match.event_key))}
            >
              <div className="text-center md:text-left mb-2 md:mb-0">
                <p className="text-sm font-medium text-gray-200">
                  {match.country_name} - {match.league_name}
                </p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-200">
                  {match.event_date} - {match.event_time}
                </p>
              </div>
              <div className="text-center flex items-center justify-center space-x-3">
                {homeTeamData && (
                  <Image
                    src={homeTeamData.team_logo || "/default-team-logo.png"}
                    alt={homeTeamData.team_name}
                    width={24}
                    height={24}
                    className="inline-block rounded-full"
                  />
                )}
                <span className="text-sm font-semibold text-white">
                  <Link
                    href={`/team/${match.home_team_key}`}
                    className="text-blue-400 hover:underline"
                  >
                    {match.event_home_team}
                  </Link>
                </span>
                <span className="text-base font-bold text-teal-300 px-2">
                  {match.event_final_result}
                </span>
                <span className="text-sm font-semibold text-white">
                  <Link
                    href={`/team/${match.away_team_key}`}
                    className="text-blue-400 hover:underline"
                  >
                    {match.event_away_team}
                  </Link>
                </span>
                {awayTeamData && (
                  <Image
                    src={awayTeamData.team_logo || "/default-team-logo.png"}
                    alt={awayTeamData.team_name}
                    width={24}
                    height={24}
                    className="inline-block rounded-full"
                  />
                )}
              </div>
            </div>
            {expandedMatch === String(match.event_key) && (
              <div className="bg-slate-800 p-4 rounded-b-lg">
                <p className="text-sm text-gray-200">
                  <span className="font-semibold">Halftime Result:</span>{" "}
                  {match.event_halftime_result}
                </p>
                <p className="text-sm text-gray-200">
                  <span className="font-semibold">Status:</span>{" "}
                  {match.event_status}
                </p>
                <p className="text-sm text-gray-200">
                  <span className="font-semibold">Round:</span>{" "}
                  {match.league_round}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function H2HPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex justify-center items-center text-xl text-gray-700">
          Loading...
        </div>
      }
    >
      <H2HPageContent />
    </Suspense>
  );
}
