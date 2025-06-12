import ProtectedRoute from "@/components/ProtectedRoute"
import ResultsPage from "@/components/ResultPage"

const ResultPage = () => {
    return(
        <ProtectedRoute>
            <div className="flex justify-center items-center w-full">
                <ResultsPage/>
            </div>
        </ProtectedRoute>
        
    )
}


export default ResultPage