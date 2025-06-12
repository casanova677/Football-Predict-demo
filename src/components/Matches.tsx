"use client";
import Image from "next/image";
import { FixtureType, MatchPrediction } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { getAllFixtures } from "@/api";
import { usePathname } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  data: any;
}

const LEAGUES_TO_CHECK = [
  "uefa europa league - league stage",
  "uefa european championship",
  "uefa conference league - league stage",
];

const Matches = ({ data }: Props) => {
  const [fixtures, setFixtures] = useState<FixtureType[]>([]);
  const pathname = usePathname();
  const [matchPredictions, setMatchPredictions] = useState<
    Record<number, MatchPrediction>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchFixtures = useCallback(async () => {
    try {
      const response = await getAllFixtures();
      setFixtures(response);
    } catch (error) {
      console.error("Error fetching fixtures:", error);
      toast.error("Failed to fetch fixtures");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [predictionsResponse] = await Promise.all([
          api.get("/predictions"),
          fetchFixtures(),
        ]);

        const predictions = predictionsResponse.data.reduce(
          (acc: Record<number, MatchPrediction>, prediction: MatchPrediction) => {
            acc[prediction.id!] = prediction;
            return acc;
          },
          {}
        );
        setMatchPredictions(predictions);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch predictions or fixtures");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchFixtures]);

  const handleEmptyLogo = (league: string) => {
    const leagueName = league.split(" - ")[0];
    if (leagueName.toLowerCase() === "uefa europa league") {
      return "/img/europa.png";
    }
    if (leagueName.toLowerCase() === "uefa conference league") {
      return "/img/confrence.png";
    }
    return "/default-league-logo.png";
  };

  const groupedFixtures = (fixtures ?? []).reduce<
    Record<string, FixtureType[]>
  >((acc, fixture) => {
    if (!acc[fixture.league_name]) {
      acc[fixture.league_name] = [];
    }
    acc[fixture.league_name].push(fixture);
    return acc;
  }, {});

  const handleInputChange = (id: number, key: string, value: string | number) => {
    setMatchPredictions((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value,
      },
    }));
  };

  const handleUpdate = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent fixture click
    const prediction = matchPredictions[id] || {};
    const fixture = fixtures.find((f) => f.event_key === id);

    if (!fixture) {
      toast.error("Fixture not found for this prediction");
      return;
    }

    try {
      const response = await api.patch(`/predictions/${id}`, {
        predictedScoreHome: prediction.predictedScoreHome || null,
        predictedScoreAway: prediction.predictedScoreAway || null,
        tips: prediction.tips || null,
        odds: prediction.odds ? parseFloat(prediction.odds.toString()) : null,
        percentage: prediction.percentage
          ? parseInt(prediction.percentage.toString())
          : null,
        result: prediction.result || null,
        fixture: {
          event_key: fixture.event_key,
          event_date: fixture.event_date,
          event_time: fixture.event_time,
          event_home_team: fixture.event_home_team,
          event_away_team: fixture.event_away_team,
          league_name: fixture.league_name,
          event_status: fixture.event_status,
          event_final_result: fixture.event_final_result,
        },
      });

      if (response.data.isSuccessfull) {
        toast.success("Prediction updated!");
        setMatchPredictions((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            predictedScoreHome: prediction.predictedScoreHome,
            predictedScoreAway: prediction.predictedScoreAway,
            tips: prediction.tips,
            odds: prediction.odds,
            percentage: prediction.percentage,
            result: prediction.result,
          },
        }));
      }
    } catch (error: any) {
      console.error("Error updating prediction:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update prediction";
      toast.error(errorMessage);
    }
  };

  const handleFixtureClick = (homeTeamKey: number, awayTeamKey: number) => {
    if (pathname.includes("/admin")) {
      return;
    }
    router.push(
      `/head-to-head?homeTeamKey=${homeTeamKey}&awayTeamKey=${awayTeamKey}`
    );
  };

  if (isLoading) {
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

  return (
    <div className="p-4 space-y-4 dark:bg-gray-700">
      {Object.keys(groupedFixtures).length === 0 ? (
        <div className="flex flex-col items-center gap-2 p-4 rounded-lg shadow-md dark:bg-gray-700">
          <p className="text-sm font-medium text-gray-500">
            No matches scheduled today
          </p>
        </div>
      ) : (
        Object.entries(groupedFixtures).map(([leagueName, fixtures]) => (
          <div key={leagueName} className="space-y-4 items-center">
            <div className="mb-4 flex items-center justify-between px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-md">
              <div className="flex items-center space-x-2">
                {fixtures[0].league_logo && (
                  <Image
                    src={
                      LEAGUES_TO_CHECK.includes(leagueName.toLowerCase())
                        ? handleEmptyLogo(leagueName)
                        : fixtures[0].league_logo
                    }
                    alt={leagueName}
                    width={24}
                    height={24}
                    className="flex-shrink-0"
                  />
                )}
                <p className="text-base md:text-lg text-teal-400 truncate">
                  {leagueName}
                </p>
              </div>
            </div>

            {fixtures.map((fixture) => (
              <div
                className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 cursor-pointer"
                key={fixture.event_key}
                onClick={() =>
                  handleFixtureClick(fixture.home_team_key, fixture.away_team_key)
                }
              >
                <div className="flex items-center justify-between sm:justify-start">
                  {fixture.home_team_logo && (
                    <Image
                      src={fixture.home_team_logo}
                      alt={fixture.event_home_team}
                      width={24}
                      height={24}
                      className="mr-2 flex-shrink-0"
                    />
                  )}
                  <span className="text-sm font-medium truncate">
                    <Link
                      href={`/team/${fixture.home_team_key}`}
                      className="text-blue-400 hover:underline"
                      onClick={(e) => e.stopPropagation()} // Prevent H2H navigation
                    >
                      {fixture.event_home_team}
                    </Link>
                  </span>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-xs text-gray-500 truncate">
                    {fixture.league_name}
                  </p>
                  {fixture.event_status === "FINISHED" ? (
                    <p className="text-sm font-semibold">
                      {fixture.event_final_result || "0-0"}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">{fixture.event_time}</p>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end">
                  <span className="text-sm font-medium mr-2 truncate">
                    <Link
                      href={`/team/${fixture.away_team_key}`}
                      className="text-blue-400 hover:underline"
                      onClick={(e) => e.stopPropagation()} // Prevent H2H navigation
                    >
                      {fixture.event_away_team}
                    </Link>
                  </span>
                  {fixture.away_team_logo && (
                    <Image
                      src={fixture.away_team_logo}
                      alt={fixture.event_away_team}
                      width={24}
                      height={24}
                      className="ml-2 flex-shrink-0"
                    />
                  )}
                </div>

                <div className="flex flex-col items-end space-y-2">
                  {pathname === "/admin" ? (
                    <>
                      <div className="w-full sm:w-32">
                        <label
                          htmlFor={`tips-${fixture.event_key}`}
                          className="text-xs text-gray-600"
                        >
                          Tips
                        </label>
                        <input
                          id={`tips-${fixture.event_key}`}
                          onChange={(e) =>
                            handleInputChange(fixture.event_key, "tips", e.target.value)
                          }
                          value={matchPredictions[fixture.event_key]?.tips || ""}
                          placeholder="e.g., 1X2"
                          type="text"
                          className="py-1 px-2 text-sm rounded-md border text-gray-950 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full text-center"
                          onClick={(e) => e.stopPropagation()} // Prevent H2H navigation
                        />
                      </div>

                      <div className="w-full sm:w-32">
                        <label
                          htmlFor={`odds-${fixture.event_key}`}
                          className="text-xs text-gray-600"
                        >
                          Odds
                        </label>
                        <input
                          id={`odds-${fixture.event_key}`}
                          onChange={(e) =>
                            handleInputChange(fixture.event_key, "odds", e.target.value)
                          }
                          value={matchPredictions[fixture.event_key]?.odds || ""}
                          placeholder="e.g., 1.75"
                          type="number"
                          step="0.01"
                          min="1"
                          className="py-1 px-2 text-sm rounded-md border text-gray-950 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full text-center"
                          onClick={(e) => e.stopPropagation()} // Prevent H2H navigation
                        />
                      </div>

                      <div className="w-full sm:w-32">
                        <label
                          htmlFor={`percentage-${fixture.event_key}`}
                          className="text-xs text-gray-600"
                        >
                          Percentage
                        </label>
                        <input
                          id={`percentage-${fixture.event_key}`}
                          onChange={(e) =>
                            handleInputChange(fixture.event_key, "percentage", e.target.value)
                          }
                          value={matchPredictions[fixture.event_key]?.percentage || ""}
                          placeholder="e.g., 75"
                          type="number"
                          min="0"
                          max="100"
                          className="py-1 px-2 text-sm rounded-md border text-gray-950 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full text-center"
                          onClick={(e) => e.stopPropagation()} // Prevent H2H navigation
                        />
                      </div>

                      <div className="w-full sm:w-32">
                        <label
                          htmlFor={`result-${fixture.event_key}`}
                          className="text-xs text-gray-600"
                        >
                          Result
                        </label>
                        <input
                          id={`result-${fixture.event_key}`}
                          onChange={(e) =>
                            handleInputChange(fixture.event_key, "result", e.target.value)
                          }
                          value={matchPredictions[fixture.event_key]?.result || ""}
                          placeholder="e.g., Win"
                          type="text"
                          className="py-1 px-2 text-sm rounded-md border text-gray-950 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full text-center"
                          onClick={(e) => e.stopPropagation()} // Prevent H2H navigation
                        />
                      </div>

                      <div className="w-full sm:w-32 my-4">
                        <button
                          onClick={(e) => handleUpdate(fixture.event_key, e)}
                          className="py-1 px-4 text-sm text-white bg-teal-500 hover:bg-teal-600 rounded-md w-full sm:w-auto"
                        >
                          Update
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-1">
                      {matchPredictions[fixture.event_key]?.tips && (
                        <p className="text-sm font-semibold text-cyan-400 uppercase truncate">
                          {matchPredictions[fixture.event_key]?.tips}
                        </p>
                      )}
                      {matchPredictions[fixture.event_key]?.odds && (
                        <p className="text-xs text-gray-300 truncate">
                          Odds:{" "}
                          {matchPredictions[fixture.event_key]?.odds !== undefined
                            ? Number(matchPredictions[fixture.event_key]?.odds).toFixed(2)
                            : ""}
                        </p>
                      )}
                      {matchPredictions[fixture.event_key]?.percentage && (
                        <p className="text-xs text-gray-300 truncate">
                          Confidence: {matchPredictions[fixture.event_key]?.percentage}%
                        </p>
                      )}
                      {matchPredictions[fixture.event_key]?.result && (
                        <p className="text-xs text-gray-300 truncate">
                          Result: {matchPredictions[fixture.event_key]?.result}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Matches;