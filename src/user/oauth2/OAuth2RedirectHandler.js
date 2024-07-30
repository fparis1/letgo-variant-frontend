import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, API_BASE_URL, USER_EMAIL } from '../../constants';

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
            // Fetch user data from the backend using the token
            fetch(API_BASE_URL + '/user/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                // Assuming the user's email is in the data object
                localStorage.setItem(USER_EMAIL, data.email);
                navigate('/');
                window.location.reload();
            })
            .catch(error => console.error('Error fetching user data:', error));
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