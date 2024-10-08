import React, { useState } from 'react';
import './Signup.css';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL, GITHUB_AUTH_URL } from '../../constants';
import { signup } from '../../util/APIUtils';
import fbLogo from '../../img/fb-logo.png';
import googleLogo from '../../img/google-logo.png';
import githubLogo from '../../img/github-logo.png';
import Alert from 'react-s-alert';

const Signup = ({ authenticated }) => {
    if (authenticated) {
        return <Navigate to="/" />;
    }

    return (
        <div className="signup-container">
            <div className="signup-content">
                <h1 className="signup-title">Signup with SpringSocial</h1>
                <SocialSignup />
                <div className="or-separator">
                    <span className="or-text">OR</span>
                </div>
                <SignupForm />
                <span className="login-link">Already have an account? <Link to="/login">Login!</Link></span>
            </div>
        </div>
    );
};

const SocialSignup = () => {
    return (
        <div className="social-signup">
            <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>
                <img src={googleLogo} alt="Google" /> Sign up with Google
            </a>
            <a className="btn btn-block social-btn facebook" href={FACEBOOK_AUTH_URL}>
                <img src={fbLogo} alt="Facebook" /> Sign up with Facebook
            </a>
            <a className="btn btn-block social-btn github" href={GITHUB_AUTH_URL}>
                <img src={githubLogo} alt="Github" /> Sign up with Github
            </a>
        </div>
    );
};

const SignupForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        if (inputName === 'name') {
            setName(inputValue);
        } else if (inputName === 'email') {
            setEmail(inputValue);
        } else if (inputName === 'password') {
            setPassword(inputValue);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const signUpRequest = { name, email, password };

        signup(signUpRequest)
            .then(response => {
                Alert.success("You're successfully registered. Please login to continue!");
                navigate('/login');
            }).catch(error => {
                Alert.error((error && error.message) || 'Oops! Something went wrong. Please try again!');
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-item">
                <input type="text" name="name"
                    className="form-control" placeholder="Name"
                    value={name} onChange={handleInputChange} required />
            </div>
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
                <button type="submit" className="btn btn-block btn-primary">Sign Up</button>
            </div>
        </form>
    );
};

export default Signup;