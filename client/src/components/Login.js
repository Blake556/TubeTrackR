import React, { useEffect, useState } from 'react';
import './../styles/Login.css';

function Login(props) {

  return (
     <div className="Login text-center">
      <div className="login-header">
        <h1 className="title text-center">
          Tube<span>TrackR</span>
        </h1>
      </div>  
      <div className="form-box d-flex flex-column align-items-center justify-content-center">
        <div className="login-description text-center mb-3">
          <p className="login-description text-center">
          Sign in to YouTube to manage all your playlist videos in one place, including finding, editing, creating, and deleting them.
          </p>
        </div>
        <form>
          <button
            onClick={() => props.handleSignInClick()}
            type="button"
            className="login-btn btn btn-danger"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;




/*

import "./../styles/Login.css";
import React from "react";

function Login(props) {

  const serverUrl ='http://localhost:3069'

  async function handleSignInClick() {
    try {
      const response = await fetch('http://localhost:3069/authUrl', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url; // Redirect the user to Google OAuth
      } else {
        console.error('Failed to initiate OAuth flow:', response.statusText);
      }
    } catch (error) {
      console.error('Error initiating OAuth flow:', error);
    }
  }
  


  return (
    <div className="Login text-center">
      <div className="login-header">
        <h1 className="title text-center">
          Tube<span>TrackR</span>
        </h1>
      </div>
      <div className="form-box d-flex flex-column align-items-center justify-content-center">
        <div className="login-description text-center mb-3">
          <p className="login-description text-center">
            Sign in to your YouTube account and find, edit, create, and delete
            all your YouTube playlist videos in one place.
          </p>
        </div>
        <form>
          <button
            onClick={handleSignInClick}
            type="button"
            className="login-btn btn btn-danger"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

*/
