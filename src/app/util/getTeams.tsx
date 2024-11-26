
import { League, Team } from '@/types';
import getStandings from './getStandings';

  

  export default async function getTeams(): Promise<Team[]> {
    const standingsResponse = await getStandings();
    const teams: Team[] = [];
    const leagues: League[] = [];
  
    standingsResponse.forEach((standingResponse) => {
      const totalStandings = standingResponse.result.total;
  
      totalStandings.forEach((standingTeam) => {
        const leagueName = standingTeam.standing_place_type;
        const teamName = standingTeam.standing_team;
        const points = standingTeam.standing_PTS;
        const teamKey = standingTeam.team_key; // Assuming team_key exists in API response
        const teamLogo = standingTeam.team_logo; // Add team logo logic (e.g., fetch from API or use placeholder)
        const playerStats = {}; // Add player stats logic (e.g., fetch from API or use placeholder)
  
        if (leagueName && teamName) {
          const existingLeague = leagues.find((league) => league.name === leagueName);
  
          if (existingLeague) {
            existingLeague.teams.push({ 
              team_key: teamKey, 
              team_name: teamName, 
              team_logo: teamLogo, 
              players: playerStats, 
              league: leagueName, 
              points 
            });
          } else {
            leagues.push({ 
              name: leagueName, 
              teams: [{ 
                team_key: teamKey, 
                team_name: teamName, 
                team_logo: teamLogo, 
                players: playerStats, 
                league: leagueName, 
                points 
              }] 
            });
          }
  
          teams.push({ 
            team_key: teamKey, 
            team_name: teamName, 
            team_logo: teamLogo, 
            players: playerStats, 
            league: leagueName, 
            points 
          });
        }
      });
    });
  
    return teams;
  }