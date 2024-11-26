// components/Matches.tsx
"use client";
import Image from "next/image";
import { FixtureType, MatchPrediction } from "@/types";
import { useCallback, useEffect, useState } from "react";
import {  getFixturesById } from "@/api";
import { usePathname } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import Competition from "./Competition";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/app/components/LoadingComponent";

interface Props {
  data: any;
  leagueId: number;
}



const LeagueMatches = ({ data, leagueId }: Props) => {
  const [fixtures, setFixtures] = useState<FixtureType[]>([]);
  const pathname = usePathname();
  const [matchPredictions, setMatchPredictions] = useState<
    Record<number, MatchPrediction>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchFixtures = useCallback(async () => {
    // Check if the route is the home page
    
      try {
        const response = await getFixturesById(leagueId);
        setFixtures(response);
        
      } catch (error) {
        console.error("Error fetching fixtures:", error);
        toast.error("Failed to fetch fixtures");
      }
    
  }, [leagueId]);

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

 
  if (isLoading) {
    return( 
     < LoadingComponent color={"green"} />
     );
  }

  return (
  
        data?.slice(0, 100).map((fixture: FixtureType) => (
          <div className="p-4 space-y-4 dark:bg-gray-700">
            <div
              className="flex flex-col"
              key={fixture.event_key}
              onClick={() =>
                handleFixtureClick(fixture.home_team_key, fixture.away_team_key)
              }
            >
            <Competition data={fixture}/>

              <div className="grid grid-cols-4 items-center gap-2 p-4 rounded-lg shadow-md">
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
                    <p className="text-xs text-gray-500">{fixture.event_time}</p>
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

                <div className="flex flex-col items-end space-y-2">
                
                    <div className="text-center">
                      {matchPredictions[fixture.event_key]?.outcome1 && (
                          <p className="text-xs align-text-top hover:text-green-500">
                            {matchPredictions[fixture.event_key].outcome1}
                          </p>
                        )}

                      {
                        matchPredictions[fixture.event_key]?.outcome2 && (
                          <p className="text-xs align-text-bottom hover:text-green-500">
                            {matchPredictions[fixture.event_key].outcome2}
                          </p>
                        )}

                      {
                        matchPredictions[fixture.event_key]?.prediction && (
                          <p className="text-xs align-text-bottom">
                            {matchPredictions[fixture.event_key].prediction}
                          </p>
                        )}
                    </div>
                  
                  {/* Prediction */}
                </div>
              </div>
            </div>
            </div>
        ))

    
  );
};

export default LeagueMatches;
