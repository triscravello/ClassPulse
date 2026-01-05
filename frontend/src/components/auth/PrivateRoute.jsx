import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import LoadingSpinner from '../common/LoadingSpinner';

const PrivateRoute = ({ children }) => {
    const { token, loading } = useContext(UserContext);
    console.log('PrivateRoute token:', token, 'loading:', loading);

    if (loading) return <LoadingSpinner />; // Show a loading spinner while checking auth
    if (!token) return <Navigate to="/login" replace />;
    
    return children; // user is authenticated, render the child components
};

export default PrivateRoute;