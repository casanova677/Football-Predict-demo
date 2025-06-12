import moment from "moment";
import next from "next";
import { revalidatePath } from "next/cache";
import { json } from "stream/consumers";
import { USE_SAMPLE } from "../sampleData/useSample";
import getStandingsSample from "../sampleData/getStandingsSample";
import { Standing, StandingResponse } from "@/types";

export default async function getStandings(): Promise<StandingResponse[]> {
  
  const currentTime = moment();
  const month = currentTime.month();
  let year;

  if (month <= 6) {
    year = currentTime.year() - 1;
  } else {
    year = currentTime.year();
  }

 const API_MAGIC3 = process.env.NEXT_PUBLIC_API_TOKEN_MAGIC3;


  const standings: StandingResponse[] = [];

  const leagues = [
    {
      id: 152,
      name: "Premier League",
      href: "premier-league",
      emblem: "/img/leagues/premier_league.webp",
    },
    {
      id: 302,
      name: "La Liga",
      href: "la-liga",
      emblem: "/img/leagues/laliga.svg",
    },
    {
      id: 175,
      name: "Bundesliga",
      href: "bundesliga",
      emblem: "/img/leagues/bundesliga.webp",
    },
    {
      id: 207,
      name: "Serie A",
      href: "serie-a",
      emblem: "/img/leagues/serie_a.webp",
    },
    {
      id: 168,
      name: "Ligue 1",
      href: "ligue-1",
      emblem: "/img/leagues/ligue_1.webp",
    },
    {
      id: 6,
      name: "Championship",
      href: "championship",
      emblem: "/img/leagues/championship.webp",
    },
    {
      id: 266,
      name: "Primeira Liga",
      href: "primeira-liga",
      emblem: "/img/leagues/liga_portugal.webp",
    },
    {
      id: 99,
      name: "Series A",
      href: "brazilian-series-a",
      emblem: "/img/leagues/brazilian_serie_a.webp",
    },
    {
      id: 3,
      name: "Champions League",
      href: "copa-libertadores",
      emblem: "/img/leagues/copa_libertadores.webp",
    },
  ];

 

  const cache = new Map();

  for (const league of leagues) {
    const leagueId = league.id;
    const url = `https://apiv2.allsportsapi.com/football/?&met=Standings&leagueId=${leagueId}&APIkey=${API_MAGIC3}`;
    const TTL = 60 * 60 * 1000; // 1 hour

    if (cache.has(leagueId)) {
      const cachedResponse = cache.get(leagueId);
      const now = Date.now();
      const cachedAt = cachedResponse.timestamp;

      if (now - cachedAt < TTL) {
        // Use cached response
        standings.push(cachedResponse.data);
      } else {
        // Cache has expired, make a new request
        try {
          const response = await fetch(url);
          const data: StandingResponse = await response.json();
          
          const standing = data;

          if (standing) {
            // Cache the new response
            cache.set(leagueId, { data: standing, timestamp: moment() });
            standings.push(standing);
          }
        } catch (err) {
          console.error(`Error fetching ${league.name} standings: ${err}`);
        }
      }
    } else {
      try {
        const response = await fetch(url);
        const data: StandingResponse = await response.json();
        
        const standing = data;
       

        if (standing) {
          // Cache the response
          cache.set(leagueId, { data: standing, timestamp: moment() });
          standings.push(standing);
         
          
        }
      } catch (err) {
        console.error(`Error fetching ${league.name} standings: ${err}`);
      }
    }
  }

  return standings;
}
