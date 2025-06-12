// src/app/results/page.tsx
"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import LoadingComponent from "@/app/components/LoadingComponent";

interface Match {
  id: number;
  eventKey: number;
  eventDate: string;
  homeTeam: string;
  awayTeam: string;
  leagueName: string;
  eventTime: string;
  status: string;
  finalResult: string;
}

const ResultsPage = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get("/matches");
        setMatches(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching matches:", error);
        setIsLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (isLoading) {
    return <LoadingComponent color="green" />;
  }

  return (
    <div className="p-4 space-y-4 dark:bg-gray-700">
      <h1 className="text-2xl font-bold text-teal-400">Match Results</h1>
      {matches.length === 0 ? (
        <p className="text-sm text-gray-500">No matches available</p>
      ) : (
        matches.map((match) => (
          <div
            key={match.id}
            className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800"
          >
            <div className="text-center">
              <p className="text-sm font-medium">
                {match.homeTeam} vs {match.awayTeam}
              </p>
              <p className="text-xs text-gray-500">{match.leagueName}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">
                {match.finalResult || "Pending"}
              </p>
              <p className="text-xs text-gray-500">{match.eventTime}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">
                {new Date(match.eventDate).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500">{match.status}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ResultsPage;
