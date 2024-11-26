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

  // Remove duplicates from teamsData
  const uniqueTeams = Array.from(new Map(teamsData.map(team => [team.team_key, team])).values());

  // Filter teams based on search term
  const filteredTeams = uniqueTeams
    .filter((team) =>
      team.team_name.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
    );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setFocusedIndex(-1);
    setShowFilteredBox(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      let length = 0;
      if (filteredTeams.length > 10) {
        length = 10;
      } else {
        length = filteredTeams.length;
      }
      setFocusedIndex((prevIndex) =>
        prevIndex < length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (event.key === "Enter") {
      if (focusedIndex !== -1) {
        const teamId = filteredTeams[focusedIndex].team_key;
        router.push(`/team/${teamId}`);

        setSearchTerm("");
      }
    }
  };

  const handleTeamItemClick = () => {
    setSearchTerm("");
  };

  const teamListRef = useRef<HTMLDivElement>(null);
  const handleOutsideClick = (event: MouseEvent) => {
    if (
      teamListRef.current &&
      !teamListRef.current.contains(event.target as Node)
    ) {
      setShowFilteredBox(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="flex justify-center items-center w-full max-w-lg relative">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for a team"
        className="w-full bg-gradient-to-r from-neutral-100/60 to-black/25 bg-transparent p-2 outline-none border-neutral-100/60 border-[1px] rounded-xl hover:hover-blue-400 focus:border-blue-400 focus:from-blue-400/60 text-neutral-100 placeholder:text-neutral-100/70"
      />

      {searchTerm && filteredTeams.length > 0 && showFilteredBox ? (
        <div
          ref={teamListRef}
          className="absolute top-full left-2 w-full max-w-md bg-black/80 z-20 flex flex-col"
        >
          {filteredTeams.slice(0, 10).map((team, index) => (
            <Link
              href={`/team/${team.team_key}`}
              key={`${team.team_key}-${index}`} // Ensure the key is unique
              className={`p-2 text-neutral-100 ${index === focusedIndex ? "bg-neutral-100/40" : ""}`}
              onClick={() => handleTeamItemClick()}
            >
              <div className="flex items-center">
                <Image
                  src={team.team_logo}
                  alt={team.team_name}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <span>{team.team_name}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
