import {
  getAllFixtures,
  getMatchesfootball,
  getMatchesfootballFinished,
} from "@/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Status from "@/components/Status";
import { matchesType } from "@/types";

const AdminPage = async () => {
  const getDatas = await getAllFixtures();
  // const getDatas =  await getMatchesfootball()
  const getDatasFinished = await getAllFixtures();

  const matchesDatas = getDatas;
  const matchesDatasFinished = getDatasFinished;

  const nd = new Date();
  const dateConvert = nd.toDateString();
  return (
    <ProtectedRoute >
    <section className="px-2 md:px-4">
      <div className="flex justify-between items-center mb-4 md:mb-2">
        <h1 className="text-md md:text-xl font-bold">MATCHES</h1>
        <div className="px-4 py-0 md:py-1 bg-slate-600 rounded-md text-textPrimary text-sm">
          <p>{`${dateConvert}`}</p>
        </div>
      </div>
      <Status
        matchesList={matchesDatas}
        matchesListFinished={matchesDatasFinished}
      />
    </section>
    </ProtectedRoute>
  );
};

export default AdminPage;
