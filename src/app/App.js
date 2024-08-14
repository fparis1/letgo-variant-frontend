// src/App.js
import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppHeader from '../common/AppHeader';
import Home from '../home/Home';
import CategoryItems from '../components/CategoryItems';
import SubcategoryItems from '../components/SubcategoryItems';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import OAuth2RedirectHandler from '../user/oauth2/OAuth2RedirectHandler';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN, USER_EMAIL } from '../constants';
import PrivateRoute from '../common/PrivateRoute';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import './App.css';
import PostItem from '../items/PostItem';
import ViewItemComponent from '../items/ViewItem';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentlyLoggedInUser = () => {
    getCurrentUser()
      .then(response => {
        setCurrentUser(response);
        setAuthenticated(true);
        setLoading(false);
      }).catch(error => {
        setLoading(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(USER_EMAIL);
    setAuthenticated(false);
    setCurrentUser(null);
    Alert.success("You're safely logged out!");
    window.location.reload();
  };

  useEffect(() => {
    loadCurrentlyLoggedInUser();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="app">
      <div className="app-top-box">
        <AppHeader authenticated={authenticated} onLogout={handleLogout} />
      </div>
      <div className="app-body">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items/:category" element={<CategoryItems />} />
          <Route path="/items/:category/:subcategory" element={<SubcategoryItems />} />
          <Route path="/profile" element={
            <PrivateRoute authenticated={authenticated}>
              <Profile currentUser={currentUser} />
            </PrivateRoute>
          } />
          <Route path="/post-item" element={
            <PrivateRoute authenticated={authenticated}>
              <PostItem />
            </PrivateRoute>
          } />
          <Route path="/login" element={<Login authenticated={authenticated} loadCurrentlyLoggedInUser={loadCurrentlyLoggedInUser} />} />
          <Route path="/signup" element={<Signup authenticated={authenticated} />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
          <Route path="/view-item/:id" element={<ViewItemComponent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Alert stack={{ limit: 3 }} 
        timeout={3000}
        position='top-right' effect='slide' offset={65} />
    </div>
  );
};

export default App;