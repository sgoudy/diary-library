import { AuthContextProvider } from "../../context/AuthContext";
import Cookies from 'universal-cookie'
import { Redirect } from 'react-router-dom'

const cookies = new Cookies()
export default function AuthorizedContainer({ children }) {
    const isAuthenticated = cookies.get('diary-user') !== undefined
    
    if (!isAuthenticated) {
        return <Redirect to="/" />
    }

    return (
        <AuthContextProvider>{children}</AuthContextProvider>
    )
}