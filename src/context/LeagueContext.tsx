'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LeagueContextType {
  leagueId: number | null;
  setLeagueId: (id: number) => void;
}

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export const LeagueProvider = ({ children }: { children: ReactNode }) => {
  const [leagueId, setLeagueId] = useState<number | null>(null);

  return (
    <LeagueContext.Provider value={{ leagueId, setLeagueId }}>
      {children}
    </LeagueContext.Provider>
  );
};

export const useLeague = () => {
  const context = useContext(LeagueContext);
  if (!context) throw new Error("useLeague must be used within a LeagueProvider");
  return context;
};
