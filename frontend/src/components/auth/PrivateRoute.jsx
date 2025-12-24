import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

const PrivateRoute = ({ children }) => {
    const { token, loading } = useContext(UserContext);
    console.log('PrivateRoute token:', token, 'loading:', loading);

    if (loading) return <p>Loading user...</p>;
    
    return token ? children: <Navigate to="/login" replace />;
};

export default PrivateRoute;