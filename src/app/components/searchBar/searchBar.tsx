
import getTeams from "@/app/util/getTeams";
import { useState, useEffect } from "react";
import SearchBarForm from "./searchBarFrom";
import { Team } from "@/types";
import { getAllTeams } from "@/api";



export default function SearchBar() {
  const [teamsData, setTeamsData] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await getTeams();
        console.log(data)
        setTeamsData(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center w-full p-3 bg-black/90">
      <div className="w-4/6 flex justify-center items-center">
        <SearchBarForm teamsData={teamsData} />
      </div>
      <div className="w-1/6"></div>
    </div>
  );
}