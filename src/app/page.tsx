
import { getAllFixtures, getMatchesfootballFinished, getStandingsFootball } from "@/api"
import Status from "@/components/Status"



export default async function Home() {

  const getDatas = await getAllFixtures()
  const getDatasFinished = await getMatchesfootballFinished()
  const matchesDatas = getDatas
  const matchesDatasFinished = getDatasFinished?.matches



  const nd = new Date()
  const dateConvert = nd.toDateString()

  return (
    <section className="px-2 md:px-4">
      <div className="flex justify-between items-c enter mb-4 md:mb-2">
        <h1 className="text-md md:text-xl font-bold">MATCHES</h1>
        <div className="px-4 py-0 md:py-1 bg-slate-600 rounded-md text-textPrimary text-sm">
          <p>{`${dateConvert}`}</p>
        </div>
      </div>
      <Status matchesList={matchesDatas} matchesListFinished={matchesDatasFinished} />

    </section>
  )
}
