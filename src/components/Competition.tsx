import { FixtureType, matchesType } from "@/types";
import moment from "moment";
import Image from "next/image";

const LEAGUES_TO_CHECK = [
  "uefa europa league - league stage",
  "uefa european championship",
  "uefa conference league - league stage",
];

const Competition = ({ data }: { data: any }) => {
  const firstItem = data; // Access the first fixture
 

  const handleEmptyLogo = (league: string) => {
    const leagueName = league.split(" - ")[0];
    const conferenceName = league.split(" - ")[0];
    if (leagueName.toLowerCase() === "uefa europa league") {
      return "/img/europa.png";
    }
    if (conferenceName.toLowerCase() === "uefa conference league") {
      return "/img/confrence.png";
    }
  };
   // Handle cases where the array is empty
  const nd = new Date(firstItem.event_date);
  const dateConvert = nd.toDateString();
  const currentDate = moment().format('MMMM Do YYYY, h:mm:ss a');
  if (firstItem) return <p className="text-center">{currentDate}</p>;
  return (
    <div className="mb-4 flex justify-between items-center px-4 py-1 bg-slate-600 hover:bg-slate-700 rounded-md">
      <div className="flex space-x-4">
        {firstItem.league_logo && (
          <Image
            src={
              LEAGUES_TO_CHECK.includes(firstItem.league_name.toLowerCase())
                ? handleEmptyLogo(firstItem.league_name) ??
                  "/default-league-logo.png"
                : firstItem.league_logo ?? "/default-league-logo.png"
            }
            alt={firstItem.league_name}
            width={24}
            height={24}
          />
        )}
        <p className="text-lg text-teal-400">{firstItem.league_name}</p>
      
      </div>
      <p className="text-xs md:text-sm">{dateConvert}</p>
    </div>
  );
};

export default Competition;
