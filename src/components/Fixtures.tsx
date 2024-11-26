// components/Matches.tsx
"use client";
import Image from "next/image";
import { FixtureType } from "@/types";
import { useEffect, useState } from "react";
import { getFixturesById } from "@/api";
import { usePathname } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "react-toastify";

const Fixtures = ({ data, leagueId }: { data: any; leagueId: number }) => {
  const [fixtures, setFixtures] = useState<FixtureType[]>([]);
  const pathname = usePathname();
  const [prediction, setPrediction] = useState<string | null>(null);
  const [outcome1, setOutcome1] = useState<string | null>(null);
  const [outcome2, setOutcome2] = useState<string | null>(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await getFixturesById(leagueId);
        setFixtures(response.result);
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      }
    };

    const fetchPrediction = async () => {
      try {
        const response = await api.get(`/predictions/${data.id}`);
        const fetchedPrediction = response.data;

        if (fetchedPrediction) {
          setPrediction(
            `${fetchedPrediction.predictedScoreHome}:${fetchedPrediction.predictedScoreAway}`
          );
          setOutcome1(fetchedPrediction.outcome1 || "");
          setOutcome2(fetchedPrediction.outcome2 || "");
        } else {
          setPrediction("0:0");
          setOutcome1("");
          setOutcome2("");
        }
      } catch (error) {
        console.error("Error fetching prediction:", error);
        setPrediction("0:0");
        setOutcome1("");
        setOutcome2("");
      }
    };

    // Fetch both fixtures and predictions
    fetchFixtures();
    fetchPrediction();
  }, [data.id, leagueId]);

  const handleChange = (newValue: string) => {
    setPrediction(newValue);
    newValue === "" ? console.log({ newValue }) : console.log("no new value");
  };

  const handleOutcome1Change = (newValue: string) => {
    setOutcome1(newValue);
  };

  const handleOutcome2Change = (newValue: string) => {
    setOutcome2(newValue);
  };

  const getDate = new Date(data?.utcDate).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleUpdate = async () => {
    const predictedScoreHome = prediction?.split(":")[0];
    const predictedScoreAway = prediction?.split(":")[1];

    try {
      const response = await api.patch(`/predictions/${data.id}`, {
        predictedScoreHome,
        predictedScoreAway,
        outcome1,
        outcome2,
      });

      if (response.data.isSuccessfull) {
        toast.success("Prediction updated!");
      }
    } catch (error) {
      console.error("Error updating prediction:", error);
      toast.error("Failed to update prediction");
    }
  };

  return (
    <div className="p-4 space-y-4">
      {fixtures.map((fixture) => (
        <div
          key={fixture.event_key}
          className="grid grid-cols-4 items-center gap-2 p-4 bg-white rounded-lg shadow-md"
        >
          {/* Home Team */}
          <div className="flex items-center">
            <Image
              src={fixture.home_team_logo}
              alt={fixture.event_home_team}
              width={24}
              height={24}
              className="mr-2"
            />
            <span className="text-sm font-medium">
              {fixture.event_home_team}
            </span>
          </div>

          {/* Match Info */}
          <div className="text-center space-y-1">
            <p className="text-xs text-gray-500">{fixture.league_name}</p>
            {fixture.event_status === "FINISHED" ? (
              <p className="text-sm font-semibold">
                {fixture.event_final_result}
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
            <Image
              src={fixture.away_team_logo}
              alt={fixture.event_away_team}
              width={24}
              height={24}
            />
          </div>

          {/* Venue */}
          <div className="text-xs text-right text-gray-400">
            <p>{fixture.event_stadium}</p>
          </div>

          <div className="flex flex-col items-end space-y-2">
            {pathname === "/admin" ? (
              <>
                <input
                  onChange={(e) => handleChange(e.target.value)}
                  value={prediction || ""}
                  placeholder="Enter Prediction"
                  type="text"
                  className="py-1 px-2 text-blue-800 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 w-20 text-center"
                />
                <input
                  onChange={(e) => handleOutcome1Change(e.target.value)}
                  value={outcome1 || ""}
                  placeholder="Outcome 1"
                  type="text"
                  className="py-1 px-2 text-blue-800 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 w-20 text-center"
                />
                <input
                  onChange={(e) => handleOutcome2Change(e.target.value)}
                  value={outcome2 || ""}
                  placeholder="Outcome 2"
                  type="text"
                  className="py-1 px-2 text-blue-800 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 w-20 text-center"
                />
                <button
                  onClick={handleUpdate}
                  className="py-1 px-4 text-white bg-teal-500 hover:bg-teal-600 rounded-md"
                >
                  Update
                </button>
              </>
            ) : (
              <div className="text-center">
                {outcome1 && (
                  <p className="text-xs align-text-top hover:text-green-500">
                    {outcome1}
                  </p>
                )}
                {outcome2 && (
                  <p className="text-xs align-text-bottom hover:text-green-500">
                    {outcome2}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Fixtures;
