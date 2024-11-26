import { apiOptions, FixtureType, matchesType } from "@/types";
import api from "@/lib/axios"; 
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Fetch head-to-head (H2H) data for two teams.
 * @param homeTeamKey - The ID of the home team.
 * @param awayTeamKey - The ID of the away team.
 * @returns H2H data between the specified teams.
 */

const API_MAGIC = process.env.NEXT_PUBLIC_API_TOKEN_MAGIC;
const API_MAGIC2 = process.env.NEXT_PUBLIC_API_TOKEN_MAGIC2;
const API_MAGIC3 = process.env.NEXT_PUBLIC_API_TOKEN_MAGIC3;

export const fetchH2HData = async (homeTeamKey: number, awayTeamKey: number) => {
  try {
    // Construct the URL with dynamic team IDs
    const response = await api.get(`https://apiv2.allsportsapi.com/football/?met=H2H&APIkey=${API_MAGIC3}&firstTeamId=${homeTeamKey}&secondTeamId=${awayTeamKey}`);

    if (response.data) {
     
      return response.data.result; // Return result part
    } else {
      console.warn("No H2H data found for the given teams.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching H2H data:", error);
    throw error; // Rethrow to handle this error elsewhere if needed
  }
};

const options: apiOptions = {
  next: { revalidate: 30 },
  headers: {
    "X-Auth-Token": process.env.API_TOKEN,
    "Content-Type": "application/json",
  },
};
export const getMatchesfootball = async () => {
  const matchData = await fetch(
    "https://api.football-data.org/v4/matches",
    options
  );

  // const data = await matchData.json();

  // Set CORS headers for the response
  // data.setHeader('Access-Control-Allow-Origin', '*');

  return matchData.json();
};

export const getStandingsFootball = async () => {
  try {
   

    const response = await fetch(
      `https://apiv2.allsportsapi.com/football/?&met=Standings&leagueId=207&APIkey=${API_MAGIC3}`,
      {
        // mode: 'no-cors',
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response}`);
    }

    const standingsData = await response.json();

    return standingsData;
  } catch (error) {
    console.error("Error fetching standings:", error);
    throw error;
  }
};


export const getTopScorers = async (leagueId: number) => {
  try {
    const response = await fetch(
      `https://apiv2.allsportsapi.com/football/?&met=Topscorers&leagueId=${leagueId}&APIkey=${API_MAGIC3}`,
      {}
    );
   

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const topScorersData = await response.json();

    return topScorersData;
  } catch (error) {
    console.error("Error fetching standings:", error);
    throw error;
  }
};




export const getFixturesById = async (leagueId: number) => {
  // Get today's date and tomorrow's date in the required format
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]; // Adds 24 hours in milliseconds

  try {
    const response = await fetch(
      `https://apiv2.allsportsapi.com/football/?met=Fixtures&APIkey=${API_MAGIC3}&from=${today}&to=${tomorrow}&leagueId=${leagueId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const fixturesByIdData = await response.json();
    return fixturesByIdData;
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    throw error;
  }
};


export const getEplTable = async (leagueId: number) => {
  try {
    const response = await fetch(
    `https://apiv2.allsportsapi.com/football/?&met=Standings&leagueId=${leagueId}&APIkey=${API_MAGIC3}`
    ,{ next: { revalidate: 20 } }
  );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const standingsData = await response.json();

    return standingsData;
  } catch (error) {
    console.error("Error fetching standings:", error);
    throw error;
  }
};

export const getAllFixtures = async (): Promise<FixtureType []> => {
  try {
      // Get today's date and tomorrow's date in the required format
      const today = new Date().toISOString().split("T")[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]; // Adds 24 hours in milliseconds

    const response = await axios.get(`https://apiv2.allsportsapi.com/football/?met=Fixtures&APIkey=${API_MAGIC3}&from=${today}&to=${today}`, ); // Replace with actual endpoint
   
    return response.data.result; // Adjust according to the API response structure
   
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    return [];
  }
};

export const getStandings = async () => {
  try {
    const standingsdata = await fetch(
      "https://api.football-data.org/v4/PL/competitions",
      options
    );

    return standingsdata.json();
  } catch (error) {
    console.log({ error });
  }
};

const todayDate = new Date();
const getDateMonth = new Date(todayDate.getTime());
getDateMonth.setDate(todayDate.getDate() - 1);
const year = getDateMonth.getFullYear();
const month = String(getDateMonth.getMonth() + 1).padStart(2, "0");
const day = String(getDateMonth.getDate()).padStart(2, "0");

const yesterday = [year, month, day].join("-");

export const getMatchesfootballFinished = async () => {
  const matchData = await fetch(
    `https://api.football-data.org/v4/matches?date=${yesterday}`,
    options
  );
  return matchData.json();
};

export const getNewsInfo = async () => {
  const newsData = await fetch(
    `https://newsapi.org/v2/everything?apiKey=${process.env.API_TOKEN_NEWS}&q=soccer&pageSize=5`,
    { next: { revalidate: 20 } }
  );
  return newsData.json();
};

export const filterLeague = async (filterData: string) => {
  const getEnglishLeague = await getMatchesfootball();
  const filterPremierLeague: matchesType[] = getEnglishLeague?.matches;
  const getData = filterPremierLeague.filter(
    (item) => item.competition.name === filterData
  );

  return getData;
};

// Helper function to fetch data for all unique team IDs
export const fetchAllTeamData = async (teamIds: number[]) => {
  const teamDataMap: Record<number, any> = {}; // Map to store team data by ID

  // Fetch data for each team ID
  await Promise.all(
    teamIds.map(async (teamId) => {
      try {
        const response = await axios.get(`https://apiv2.allsportsapi.com/football/?met=Teams&teamId=${teamId}&APIkey=${API_MAGIC3}`);
        
        if (response.data && response.data.success === 1) {
          teamDataMap[teamId] = response.data.result[0]; // Store team data by ID
        }
        console.log(response);
      } catch (error) {
        console.error(`Error fetching data for teamId ${teamId}:`, error);
      }
    })
  );

  return teamDataMap;
};

// Function to fetch individual team data
export const fetchTeamData = async (teamId: number) => {
  try {
    const response = await axios.get(`https://apiv2.allsportsapi.com/football/?met=Teams&APIkey=${API_MAGIC3}&teamId=${teamId}`);
    
    if (response.data && response.data.result) {
     
      return response.data.result[0]; // Return first item in the result array
      
    } else {
      console.warn("No team data found for the given team ID.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching team data:", error);
    throw error;
  }
};

export const getLivescores = async (leagueId:number) => {
  try {
    const response = await fetch(
      `https://apiv2.allsportsapi.com/football/?met=Livescore&leagueId=${leagueId}&APIkey=${API_MAGIC3}`,
      { next: { revalidate: 20 } }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const liveScoresData = await response.json();
  
      return liveScoresData;
    } catch (error) {
      console.error("Error fetching standings:", error);
      throw error;
    }
 
}

export const getAllTeams= async() => {
  try {
    const response = await fetch(
      `https://apiv2.allsportsapi.com/football/?met=Teams&APIkey=${API_MAGIC3}`,
      { next: { revalidate: 20 } }
      );
      console.log(response)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const allTeamsData = await response.json();
  
      return allTeamsData;
    } catch (error) {
      console.error("Error fetching standings:", error);
      throw error;
    }
}