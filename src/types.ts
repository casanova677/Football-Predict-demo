export type apiOptions = {
  next: any,
  headers:{
      'X-Auth-Token': string | any,
      'Content-Type': string | any
  }
}


export type GroupedStandings  = {
  [key: string]: Standing[];
}

export type ActiveTabType = 'standings' | 'topScorers'; // Define the allowed values



export type Team = {
  league: string;
  points: number;
  team_key: number;
  team_name: string;
  team_logo: string;
  players: any;
  
};

export type League =  {
  name: string;
  teams: Team[];
}




export type Game ={
  played: number,
  win: number,
  draw: number,
  loss: number,
  goals:{
      for: number,
      against: number
  }

}

// Fixtures

export type FixtureInfo = {
  id: number,
  referee: string,
  timezone: string,
  date: string,
  timestamp: number,
  periods: {
      fisrt: number,
      second: number
  },
  venue: {
      id: number,
      name: string,
      city: string
  },
  status: {
      long: string,
      short: string,
      elapsed: number
  }
}

export type LeagueFixtures = {
  id: number,
  name: string,
  country: string,
  logo: string,
  flag: string,
  season: number,
  round: string
}

export type Teams = {
  home: {
      id: number,
      name: string,
      logo: string,
      winner: boolean
  },
  away: {
      id: number,
      name: string,
      logo: string,
      winner: boolean
  }
}

export type Goals = {
  home: number,
  away: number
}
export type Score = {
  halftime: Goals,
  fulltime: Goals,
  extratime: Goals,
  penalty: Goals
}

export type Fixture = {
  fixture: FixtureInfo,
  league: LeagueFixtures,
  teams: Teams,
  goals: Goals,
  score: Score
}

export type AllFixtures = {
  name: string,
  fixtures: Fixture[]
}





export type matchesHomeTeam = {
  id?: number,
  name: string,
  crest: string
}
export type matchesAwayTeam = {
  id?: number,
  name: string,
  crest: string
}
export type scores = {
  fullTime: {
      home: number,
      away: number,
  },
  halfTime?: {
    home: number,
    away: number,
  }
}

export type matchesType = {
  area: matchesArea,
  competition: matchesCompetition,
  id: number,
  utcDate: string,
  status: string,
  matchday?: number,
  homeTeam?: matchesHomeTeam,
  awayTeam?: matchesAwayTeam,
  score?:scores
}

export type newsType = {
  title: string,
  url: string,
  urlToImage: string,
}

export type matchesArea = {
  id?: number;
  name: string;
  code?: string;
  flag?: string;
};

export type StandingResult = {
  total: LeagueStanding[];
  home: LeagueStanding[];
  away: LeagueStanding[];
}


export type StandingResponse = {
  success: number;
  result: StandingResult;
}

export type LeagueStanding = {
  standing_place?: number;
  standing_place_type: string;
  standing_team: string;
  standing_P: number;
  standing_W: number;
  standing_D: number;
  standing_L: number;
  standing_F: number;
  standing_A: number;
  standing_GD: number;
  standing_PTS: number;
  team_key: number;
  league_key: number;
  league_season: string;
  league_round: string;
  standing_updated: string;
  fk_stage_key: number;
  stage_name: string;
  team_logo: string;
  standing_LP: number;
  standing_WP: number;
};

export type matchesCompetition = {
  id?: number;
  name: string;
  code: string;
  type?: string;
  emblem?: string;
};

export type matchesTeam = {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
};

export type standingsEntry = {
  position: number;
  team: matchesTeam;
  playedany: number;
  form: string;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
};

export type standingsType = {
  area: matchesArea;
  competition: matchesCompetition;
  season: {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number;
    winner?: any;
    stages: string[];
  };
  standings: {
    stage: string;
    type: string;
    table: standingsEntry[];
  }[];
};



export type matchType = {
  utcDate: string;
  status: string;
  homeTeam: {
    name: string;
    crest: string;
  };
  awayTeam: {
    name: string;
    crest: string;
  };
  score: {
    fullTime: {
      home: number;
      away: number;
    };
  };
  predictedScoreHome?: string; // Optional for upcoming matches without predictions
  predictedScoreAway?: string; // Optional for upcoming matches without predictions
};


export type FixtureType = {
  filter(arg0: (match: any) => boolean): unknown;
  event_key: number;
  event_date: string;
  event_time: string;
  event_home_team: string;
  home_team_key: number;
  event_away_team: string;
  away_team_key: number;
  event_halftime_result: string;
  event_final_result: string;
  event_ft_result: string;
  event_penalty_result: string;
  event_status: string;
  country_name: string;
  league_name: string;
  league_key: number;
  league_round: string;
  league_season: string;
  event_live: string;
  event_stadium: string;
  event_referee: string;
  home_team_logo: string;
  away_team_logo: string;
  event_country_key: number;
  league_logo: string;
  country_logo: string | null;
  event_home_formation: string;
  event_away_formation: string;
  fk_stage_key: number;
  stage_name: string;
  league_group: string | null;
  area: string;
  competition:string;
  id:number;
  utcDate:string; 
  status:string
};

export type H2HMatch = {
  event_key: number;
  event_date: string;
  event_time: string;
  event_home_team: string;
  home_team_key: string;
  event_away_team: string;
  away_team_key: string;
  event_halftime_result: string;
  event_final_result: string;
  event_status: string;
  country_name: string;
  league_name: string;
  league_key: string;
  league_round: string;
  league_season: string;
  event_live: string;
  event_country_key: string;
};

export type H2HData = {
  H2H: H2HMatch[];
  firstTeamResults: H2HMatch[];
  secondTeamResults: H2HMatch[];
};


export type MatchPrediction = {
  prediction?: string;
  outcome1?: string;
  outcome2?: string;
  matchId:number;
  id:number;
};

// src/types.ts

export type Player = {
  time: string;
  away_scorer: any;
  player: string;
  player_key: string;
  player_name: string;
  player_number: string;
  player_country: string | null;
  player_type: string;
  player_age: string;
  player_match_played: string;
  player_goals: string;
  player_yellow_cards: string;
  player_red_cards: string;
  player_image: string;
  home_scorer:any;
};


export type LivescoreProps = {
  leagueId: number;
};

export type LiveMatch = {
  event_key: number;
  event_home_team: string;
  event_away_team: string;
  event_halftime_result: string;
  event_final_result: string;
  event_status: string;
  event_time: string;
  event_date: string;
  event_home_formation?: string;
  event_away_formation?: string;
  league_name: string;
  league_logo: string;
  home_team_key: string;
  away_team_key: string;
  event_live: string;
  
};

export type LiveMatchProps = {
  event_key: string;
};

export type GoalScorer = {
  time: string;
  home_scorer: string;
  score: string;
  away_scorer: string;
  home_assist:string;
  away_assist:string;
  
};

export type Card = {
  time: string;
  home_fault: string;
  card: string;
  away_fault: string;
};


export type Statistics = {
  type: string;
  home: string;
  away: string;
};

export type LiveMatchData = {
  event_home_team: string;
  event_away_team: string;
  event_halftime_result: string;
  event_final_result: string;
  event_status: string;
  event_time: string;
  event_date: string;
  league_name: string;
  league_logo: string;
  event_stadium: string;
  goalscorers: GoalScorer[];
  cards: Card[];
  event_key:number;
  lineups: {
    home_team: { starting_lineups: Player[] };
    away_team: { starting_lineups: Player[] };
  };
  statistics: Statistics[];
  event_home_formation:string;
  event_away_formation:string;
  home_team_logo:string;
  away_team_logo:string;
  substitutes:Player[];
  in:Player[];
  out:Player[];
};

export type Standing = {
  standing_place?: number;
  standing_place_type: string;
  standing_team: string;
  standing_P: number;
  standing_W: number;
  standing_D: number;
  standing_L: number;
  standing_F: number;
  standing_A: number;
  standing_GD: number;
  standing_PTS: number;
  team_key: number;
  league_key: number;
  league_season: string;
  league_round: string;
  standing_updated: string;
  fk_stage_key: number;
  stage_name: string;
  team_logo: string;
  standing_LP: number;
  standing_WP: number;
}

export type TopScorer = {
  player_place: number;
  player_name: string;
  player_key: number;
  team_name: string;
  team_key: number;
  goals: number;
  assists: number;
  penalty_goals: number;
}


// Define types for player substitutions
type PlayerSubstitution = {
  in: any;         // Name of the player coming in
  out: any;        // Name of the player being replaced
  in_id: number;      // ID of the player coming in (0 if not available)
  out_id: number;     // ID of the player being replaced (0 if not available)
};

// Define the main Substitution type
type Substitution = {
  time: string;                 // Time of the substitution (e.g., "46")
  home_scorer: PlayerSubstitution | []; // Substitution info for the home team or empty array if none
  home_assist: string;          // Assist for the home team (seems to be always empty in the given data)
  score: string;                // Should be "substitution" based on the data provided
  away_scorer: PlayerSubstitution | []; // Substitution info for the away team or empty array if none
  away_assist: string;          // Assist for the away team (seems to be always empty in the given data)
  info: string;                 // Additional information (seems to be empty in the given data)
  info_time: string;            // Period of the match, e.g., "2nd Half"
};











