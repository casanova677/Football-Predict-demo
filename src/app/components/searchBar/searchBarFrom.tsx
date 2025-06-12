// components/SearchBarForm.tsx
"use client";
import { Team } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function SearchBarForm({ teamsData }: { teamsData: Team[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showFilteredBox, setShowFilteredBox] = useState(false);

  const router = useRouter();
  const teamListRef = useRef<HTMLDivElement>(null);

  // Remove duplicates
  const uniqueTeams = Array.from(new Map(teamsData.map((team) => [team.team_key, team])).values());

  // Filter teams
  const filteredTeams = uniqueTeams.filter((team) =>
    team.team_name.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setFocusedIndex(-1);
    setShowFilteredBox(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredTeams.length === 0) return;

    if (event.key === "ArrowDown") {
      setFocusedIndex((prevIndex) =>
        prevIndex < Math.min(filteredTeams.length, 10) - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    } else if (event.key === "Enter" && focusedIndex !== -1) {
      const teamId = filteredTeams[focusedIndex].team_key;
      router.push(`/team/${teamId}`);
      setSearchTerm("");
      setShowFilteredBox(false);
    } else if (event.key === "Escape") {
      setSearchTerm("");
      setShowFilteredBox(false);
    }
  };

  const handleTeamClick = () => {
    setSearchTerm("");
    setShowFilteredBox(false);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (teamListRef.current && !teamListRef.current.contains(event.target as Node)) {
      setShowFilteredBox(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for a team"
        aria-label="Search for a football team"
        className="w-full bg-gradient-to-r from-neutral-100/60 to-black/25 p-2 outline-none border-neutral-100/60 border-[1px] rounded-xl text-neutral-100 placeholder:text-neutral-100/70 hover:border-blue-400 focus:border-blue-400 focus:from-blue-400/60 transition-colors duration-200"
      />
      {searchTerm && showFilteredBox && (
        <div
          ref={teamListRef}
          className="absolute top-12 left-0 w-full max-w-md bg-black/80 rounded-lg shadow-lg z-20 mt-1 overflow-hidden"
        >
          {filteredTeams.length > 0 ? (
            filteredTeams.slice(0, 10).map((team, index) => (
              <Link
                href={`/team/${team.team_key}`}
                key={team.team_key}
                className={`flex items-center p-3 text-white hover:bg-neutral-100/20 ${
                  index === focusedIndex ? "bg-blue-400/30" : ""
                } transition-colors duration-200`}
                onClick={handleTeamClick}
              >
                <Image
                  src={team.team_logo || "/default-team-logo.png"}
                  alt={`${team.team_name} logo`}
                  width={24}
                  height={24}
                  className="mr-3 rounded"
                />
                <span className="text-sm">{team.team_name}</span>
              </Link>
            ))
          ) : (
            <p className="p-3 text-neutral-400 text-sm">No teams found</p>
          )}
        </div>
      )}
    </div>
  );
}