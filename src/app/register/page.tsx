import ProtectedRoute from "@/components/ProtectedRoute"
import Register from "@/components/Register"

const RegisterPage = () => {
    return(
        <ProtectedRoute>
            <div className="flex justify-center items-center w-full">
                <Register/>
            </div>
        </ProtectedRoute>
        
    )
}


export default RegisterPage