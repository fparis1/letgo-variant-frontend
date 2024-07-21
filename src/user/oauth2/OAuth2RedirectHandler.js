import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../../constants';

function OAuth2RedirectHandler() {
    const location = useLocation();
    const navigate = useNavigate();

    const getUrlParameter = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const token = getUrlParameter('token');
    const error = getUrlParameter('error');

    useEffect(() => {
        if (token) {
            localStorage.setItem(ACCESS_TOKEN, token);
            navigate('/');
            window.location.reload();
        }
    }, [token, navigate]);

    if (token) {
        // The page will reload due to the useEffect above, so we might not need to return anything here.
        // Alternatively, you could return a loading indicator or a blank page.
        return null;
    } else if (error) {
        return <Navigate to={{
            pathname: "/login",
            state: {
                from: location,
                error: error
            }
        }} replace={true} />;
    } else {
        // Handle unexpected scenario or show a default message/page
        return <div>Unexpected error occurred. Please try again.</div>;
    }
}

export default OAuth2RedirectHandler;