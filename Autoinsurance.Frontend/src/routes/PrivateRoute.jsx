import {Navigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'

export default function PrivateRoute({children, requiredRoles}){
    const {auth} = useAuth()

    if(!auth) return <Navigate to='/login' replace/>

    if(requiredRoles && !requiredRoles.some(r => auth.roles.includes(r)))
        return <Navigate to="/unauthorized" replace />

    return children
}