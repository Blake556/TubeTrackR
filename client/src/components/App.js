import "./../styles/App.css";
import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Header from "./Header";

function App() {
  // Will store access token after oAuth complete for later actions
  const [accessToken, setAccessToken] = useState(null);
  //console.log( typeof accessToken, accessToken)


  useEffect(() => {
    // This function will extract access token from URL. This is how the access token is sent to front end
    const extractAccessToken = () => {
      //Param is equal to the access_token inside the url
      const params = new URLSearchParams(window.location.search);
      // Token is the value of access_token as string
      const token = params.get("accessToken");
      // checks if token exist if so sets the state if not return empty array
      if (token) {
        setAccessToken(token);
      }
    };
    //calls the function so it can be executed
    extractAccessToken();
  }, []);

  // handleSignInClick will trigger the oAuth proccess and and will recieve liked video data automatilly
  const handleSignInClick = async () => {
    try {
      const response = await fetch(`http://localhost:3050/authUrl/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        //Pulls the liked video data from the url
        window.location.href = data.url ;
        console.log(data);

      } else {
        console.error('Failed to initiate OAuth flow:', response.statusText);
      }
    } catch (error) {
      console.error('Error initiating OAuth flow:', error);
    }
  };


  
  return (
    <div className="App">
  
   
      {!accessToken ? (
        <Login handleSignInClick={handleSignInClick}/> 
        ):( 
        <Home  accessToken={accessToken}/>
        )}
    </div>
  );
}

export default App;
