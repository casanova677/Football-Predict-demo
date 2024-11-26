// components/Matches.tsx
"use client";
import Image from "next/image";
import { FixtureType, MatchPrediction } from "@/types";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { getAllFixtures, getFixturesById } from "@/api";
import { usePathname } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import Competition from "./Competition";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/app/components/LoadingComponent";

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
  const [prediction, setPrediction] = useState<string | null>(null);
  const [matchPredictions, setMatchPredictions] = useState<
    Record<number, MatchPrediction>
  >({});
  const [isLoading, setIsLoading] = useState(true);

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
    const fetchInitialPredictions = async () => {
      try {
        const response = await api.get("/predictions");
        const predictions = response.data.reduce(
          (acc: { [x: string]: any }, prediction: { id: number }) => {
            acc[prediction.id] = prediction;
            return acc;
          },
          {}
        );
        setMatchPredictions(predictions);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching predictions:", error);
        toast.error("Failed to fetch predictions");
        setIsLoading(false);
      }
    };

    fetchInitialPredictions();
    fetchFixtures();
  }, [fetchFixtures]);

  const handleEmptyLogo = (league: string) => {
    const leagueName = league.split(" - ")[0];
    const conferenceName = league.split(" - ")[0];
    if (leagueName.toLowerCase() === "uefa europa league") {
      return "/img/europa.png";
    }
    if (conferenceName.toLowerCase() === "uefa conference league") {
      return "/img/confrence.png";
    }
  };

  
  // Ensure fixtures is initialized as an empty array if undefined
    const groupedFixtures = (fixtures ?? []).reduce<
      Record<string, FixtureType[]>
    >((acc, fixture) => {
      
      if (!acc[fixture.league_name]) {
        acc[fixture.league_name] = [];
      }
      acc[fixture.league_name].push(fixture);

      return acc;
    }, {});

  const handleInputChange = (id: number, key: string, value: string) => {
    setMatchPredictions((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value,
      },
    }));
  };

  const handleUpdate = async (id: number) => {
    const { prediction, outcome1, outcome2 } = matchPredictions[id] || {};

    const pred = prediction || "null:null";

    const [predictedScoreHome, predictedScoreAway] = pred.split(":");

    try {
      const response = await api.patch(`/predictions/${id}`, {
        predictedScoreHome,
        predictedScoreAway,
        outcome1,
        outcome2,
      });
      

      if (response.data.isSuccessfull) {
        toast.success("Prediction updated!");
        // Optionally update the local state immediately after successful update
        setMatchPredictions((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            prediction: `${predictedScoreHome}:${predictedScoreAway}`,
            outcome1,
            outcome2,
          },
        }));
      }
    } catch (error) {
      console.error("Error updating prediction:", error);
      toast.error("Failed to update prediction");
    }
  };

  const router = useRouter();

  const handleFixtureClick = (homeTeamKey: number, awayTeamKey: number) => {
    // Check if the current path includes `/admin`
    if (pathname.includes("/admin")) {
      return; // Do nothing if the current route is `/admin`
    }

    router.push(
      `/head-to-head?homeTeamKey=${homeTeamKey}&awayTeamKey=${awayTeamKey}`
    );
  };

  // Group fixtures by league_name
  if (isLoading) {
    return( 
     < LoadingComponent color={"green"} />
     );
  }

  return (
    <div className="p-4 space-y-4 dark:bg-gray-700">
      {/* Check if there are fixtures to display */}
      {Object.keys(groupedFixtures).length === 0 ? (
        <div className="flex justify-between items-center gap-2 p-4 rounded-lg shadow-md dark:bg-gray-700">
          <div className="text-center col-span-4">
            <p className="text-sm font-medium text-gray-500">
              No matches scheduled today
            </p>
          </div>
        </div>
      ) : (
        // Iterate over each league and its fixtures
        Object.entries(groupedFixtures).map(([leagueName, fixtures]) => (
          <div key={leagueName} className="space-y-4">
            {/* League Header */}
            <div className="mb-4 flex justify-between items-center px-4 py-1 bg-slate-600 hover:bg-slate-700 rounded-md">
              <div className="flex space-x-4">
                {fixtures[0].league_logo && (
                  <Image
                    src={
                      LEAGUES_TO_CHECK.includes(leagueName.toLowerCase())
                        ? handleEmptyLogo(leagueName) ??
                          "/default-league-logo.png"
                        : fixtures[0].league_logo ?? "/default-league-logo.png"
                    }
                    alt={leagueName}
                    width={24}
                    height={24}
                  />
                )}
                <p className="text-lg text-teal-400">{leagueName}</p>
              </div>
            </div>

            {/* Fixtures for this league */}
            {fixtures.map((fixture) => (
              <div
                className="grid grid-cols-4 items-center gap-2 p-4 rounded-lg shadow-md"
                key={fixture.event_key}
                onClick={() =>
                  handleFixtureClick(
                    fixture.home_team_key,
                    fixture.away_team_key
                  )
                }
              >
                {/* Home Team */}
                <div className="flex items-center">
                  {fixture.home_team_logo ? (
                    <Image
                      src={fixture.home_team_logo}
                      alt={fixture.event_home_team}
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                  ) : null}
                  <span className="text-sm font-medium">
                    {fixture.event_home_team}
                  </span>
                </div>

                {/* Match Info */}
                <div className="text-center space-y-1">
                  <p className="text-xs text-gray-500">{fixture.league_name}</p>
                  {fixture.status === "FINISHED" ? (
                    <p className="text-sm font-semibold">
                      {fixture.event_ft_result || "0-0"}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      {fixture.event_time}
                    </p>
                  )}
                </div>

                {/* Away Team */}
                <div className="flex items-center justify-end">
                  <span className="text-sm font-medium mr-2">
                    {fixture.event_away_team}
                  </span>
                  {fixture.away_team_logo ? (
                    <Image
                      src={fixture.away_team_logo}
                      alt={fixture.event_away_team}
                      width={24}
                      height={24}
                      className="ml-2"
                    />
                  ) : null}
                </div>

                {/* Prediction Section */}
                <div className="flex flex-col items-end space-y-2">
                  {pathname === "/admin" ? (
                    <>
                      <input
                        onChange={(e) =>
                          handleInputChange(
                            fixture.event_key,
                            "prediction",
                            e.target.value
                          )
                        }
                        value={
                          matchPredictions[fixture.event_key]?.prediction || ""
                        }
                        placeholder="Enter Prediction"
                        type="text"
                        className="py-1 px-2 text-blue-800 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 w-20 text-center"
                      />

                      <input
                        onChange={(e) =>
                          handleInputChange(
                            fixture.event_key,
                            "outcome1",
                            e.target.value
                          )
                        }
                        value={
                          matchPredictions[fixture.event_key]?.outcome1 || ""
                        }
                        placeholder="Outcome 1"
                        type="text"
                        className="py-1 px-2 text-blue-800 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 w-20 text-center"
                      />

                      <input
                        onChange={(e) =>
                          handleInputChange(
                            fixture.event_key,
                            "outcome2",
                            e.target.value
                          )
                        }
                        value={
                          matchPredictions[fixture.event_key]?.outcome2 || ""
                        }
                        placeholder="Outcome 2"
                        type="text"
                        className="py-1 px-2 text-blue-800 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 w-20 text-center"
                      />

                      <button
                        onClick={() => handleUpdate(fixture.event_key)}
                        className="py-1 px-4 text-white bg-teal-500 hover:bg-teal-600 rounded-md"
                      >
                        Update
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      {matchPredictions[fixture.event_key]?.outcome1 && (
                        <p className="text-xs align-text-top hover:text-green-500 uppercase">
                          {matchPredictions[fixture.event_key]?.outcome1}
                        </p>
                      )}
                      {matchPredictions[fixture.event_key]?.outcome2 && (
                        <p className="text-xs align-text-bottom hover:text-green-500 uppercase">
                          {matchPredictions[fixture.event_key]?.outcome2}
                        </p>
                      )}
                      {matchPredictions[fixture.event_key]?.prediction && (
                        <p className="text-xs align-text-bottom">
                          {matchPredictions[fixture.event_key]?.prediction}
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
