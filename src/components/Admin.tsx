import { matchesType } from "@/types";
import Competition from "./Competition";
import Matches from "./Matches";

interface LeagueTableProps {
  data: matchesType;
}


const Admin: React.FC<LeagueTableProps> = ({ data }) => (
  <div className="py-3 px-2 md:px-3 rounded-md flex flex-col bg-[rgb(40,46,58)] mb-2 w-full">
   
    <Matches  data={data} />
  </div>
);
export default Admin