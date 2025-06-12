'use client';
import { FC, useState, useEffect } from 'react';
import LinkSide from './LinkSide';
import { useLeague } from '@/context/LeagueContext';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { usePathname } from 'next/navigation';

const Leagues = [
  { id: 152, name: "Premier League", href: "premier-league", emblem: "/img/leagues/premier_league.webp" },
  { id: 302, name: "La Liga", href: "la-liga", emblem: "/img/leagues/laliga.svg" },
  { id: 175, name: "Bundesliga", href: "bundesliga", emblem: "/img/leagues/bundesliga.webp" },
  { id: 207, name: "Serie A", href: "serie-a", emblem: "/img/leagues/serie_a.webp" },
  { id: 168, name: "Ligue 1", href: "ligue-1", emblem: "/img/leagues/ligue_1.webp" },
  { id: 244, name: "Eredivisie", href: "eredivisie", emblem: "https://apiv2.allsportsapi.com/logo/logo_leagues/244_eredivisie.png" },
  { id: 266, name: "Primeira Liga", href: "primeira-liga", emblem: "/img/leagues/liga_portugal.webp" },
  { id: 99, name: "Series A", href: "brazilian-series-a", emblem: "/img/leagues/brazilian_serie_a.webp" },
  { id: 3, name: "Champions League", href: "copa-libertadores", emblem: "/img/leagues/copa_libertadores.webp" },
  { id: 633, name: "UEFA Nations League", href: "nations-league", emblem: "/img/leagues/copa_libertadores.webp" },
  { id: 7098, name: "Africa Cup of Nations", href: "africans-cup", emblem: "/img/africa-cup.png" },
];

const Sidebar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setLeagueId } = useLeague();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={toggleMenu}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`fixed top-0 right-0 z-40 w-[85%] max-w-[300px] h-full bg-[rgb(40,46,58)] text-teal-400 rounded-l-md shadow-lg transition-transform duration-500 ease-in-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Leagues</h1>
          <button className="text-teal-400 focus:outline-none" onClick={toggleMenu}>
            <AiOutlineClose size={24} />
          </button>
        </div>

        <ul
          className="overflow-y-auto h-[calc(100%-60px)] px-4 py-2 space-y-2 scrollbar-hide"
        >
          {Leagues.map((league) => (
            <li
              key={league.id}
              className="flex items-center p-2 rounded-md hover:bg-teal-500 hover:text-white transition-all duration-300 cursor-pointer"
              onClick={() => {
                setLeagueId(league.id);
                toggleMenu();
              }}
            >
              <LinkSide
                href={league.href}
                name={league.name}
                src={league.emblem}
                id={league.id}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Menu Button */}
      <button
        className="fixed top-0 right-0 z-40 p-2 bg-teal-500 text-white rounded-full shadow-md focus:outline-none md:relative md:right-0 md:top-0 md:rounded-md"        
          onClick={toggleMenu}
      >
        <AiOutlineMenu size={14} />
      </button>
    </>
  );
};

export default Sidebar;