import React, { useState, useEffect } from 'react';
import './Login.css';
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL, GITHUB_AUTH_URL, ACCESS_TOKEN, USER_EMAIL } from '../../constants';
import { login } from '../../util/APIUtils';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import fbLogo from '../../img/fb-logo.png';
import googleLogo from '../../img/google-logo.png';
import githubLogo from '../../img/github-logo.png';
import Alert from 'react-s-alert';

const Login = ({ authenticated, loadCurrentlyLoggedInUser }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const state = location.state;

        if (state && state.error) {
            setTimeout(() => {
                Alert.error(state.error, {
                    timeout: 5000
                });
                navigate(location.pathname, { replace: true, state: {} });
            }, 100);
        }
    }, [location, navigate]);

    if (authenticated) {
        return <Navigate to={{ pathname: "/", state: { from: location } }} />;
    }

    return (
        <div className="login-container">
            <div className="login-content">
                <h1 className="login-title">Login to SpringSocial</h1>
                <SocialLogin />
                <div className="or-separator">
                    <span className="or-text">OR</span>
                </div>
                <LoginForm loadCurrentlyLoggedInUser={loadCurrentlyLoggedInUser} />
                <span className="signup-link">New user? <Link to="/signup">Sign up!</Link></span>
            </div>
        </div>
    );
};

const SocialLogin = () => {
    return (
        <div className="social-login">
            <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>
                <img src={googleLogo} alt="Google" /> Log in with Google
            </a>
            <a className="btn btn-block social-btn facebook" href={FACEBOOK_AUTH_URL}>
                <img src={fbLogo} alt="Facebook" /> Log in with Facebook
            </a>
            <a className="btn btn-block social-btn github" href={GITHUB_AUTH_URL}>
                <img src={githubLogo} alt="Github" /> Log in with Github
            </a>
        </div>
    );
};

const LoginForm = ({ loadCurrentlyLoggedInUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const loginRequest = { email, password };

        login(loginRequest)
            .then(response => {
                localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                localStorage.setItem(USER_EMAIL, email);
                Alert.success("You're successfully logged in!");
                loadCurrentlyLoggedInUser();
                //window.location.reload();
            }).catch(error => {
                Alert.error((error && error.message) || 'Oops! Something went wrong. Please try again!');
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-item">
                <input type="email" name="email"
                    className="form-control" placeholder="Email"
                    value={email} onChange={handleInputChange} required />
            </div>
            <div className="form-item">
                <input type="password" name="password"
                    className="form-control" placeholder="Password"
                    value={password} onChange={handleInputChange} required />
            </div>
            <div className="form-item">
                <button type="submit" className="btn btn-block btn-primary">Login</button>
            </div>
        </form>
    );
};

export default Login;