import React, { useState, useEffect } from "react";
import { TwitterLoginButton } from "react-social-login-buttons";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  

  const handleLogin = async () => {
    console.log("Opening Twitter login");
    setLoading(true);

    const REDIRECT_URI = "http://localhost:3000/";
    const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=OW1oUUVNT0xCT3UzNHpKUXphMUY6MTpjaQ&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=tweet.read users.read&state=state123&code_challenge=challenge&code_challenge_method=plain`;

    
    window.location.href=authUrl;

    const handleMessage = (event) => {
      
      const { code } = event.data;
      if (code) {
        
        exchangeAuthorizationCodeForToken(code);
      }
    };

    window.addEventListener("message", handleMessage);

    
    
  };

  const exchangeAuthorizationCodeForToken = async (code, twitterWindow) => {
    const tokenUrl = "https://api.twitter.com/oauth2/token";

    const params = new URLSearchParams();
    params.append("client_id", "OW1oUUVNT0xCT3UzNHpKUXphMUY6MTpjaQ");
    params.append("client_secret", "AYCD_-mJ7FWpLV6uECY7C8LpQubfY0T7Bf3Rds0lkUqZEOGpOH");
    params.append("code", code);
    params.append("redirect_uri", "https://twitter-login-git-main-naru-neerajas-projects.vercel.app/"); 
    params.append("grant_type", "authorization_code");

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        body: params,
      });

      const data = await response.json();

      if (data.access_token) {
        console.log("Access Token:", data.access_token);
        localStorage.setItem("twitterToken", data.access_token);

        
        fetchUserDetails(data.access_token);

        
      }
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      setLoading(false);
    }
  };

  const fetchUserDetails = async (accessToken) => {
    const userUrl = "https://api.twitter.com/2/users/me"; 

    try {
      const response = await fetch(userUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userData = await response.json();
      console.log("User details:", userData);

      setUser({
        name: userData.data.name,
        username: userData.data.username,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p> // Show loading state
      ) : !user ? (
        <TwitterLoginButton onClick={handleLogin} />
      ) : (
        <div>
          <h2>Welcome, {user.name}</h2>
          <p>Your username: {user.username}</p>
        </div>
      )}
    </div>
  );
};

export default App;
