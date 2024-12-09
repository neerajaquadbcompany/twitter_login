import React, { useState, useEffect } from "react";
import { TwitterLoginButton } from "react-social-login-buttons";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if we have an authorization code in the URL after redirection
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      // If there is a code in the URL, exchange it for an access token
      exchangeAuthorizationCodeForToken(code);
    }
  }, []);

  // Function to handle the login button click
  const handleLogin = async () => {
    const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=OW1oUUVNT0xCT3UzNHpKUXphMUY6MTpjaQ&redirect_uri=${encodeURIComponent(
      window.location.origin
    )}&scope=tweet.read users.read&state=state123&code_challenge=challenge&code_challenge_method=plain`;

    // Open Twitter authentication in the main window
    window.location.href = authUrl;  // This will redirect the user to Twitter for authentication
  };

  // Function to exchange the authorization code for an access token
  const exchangeAuthorizationCodeForToken = async (code) => {
    const tokenUrl = "https://api.twitter.com/oauth2/token";

    const params = new URLSearchParams();
    params.append("client_id", "OW1oUUVNT0xCT3UzNHpKUXphMUY6MTpjaQ");
    params.append("client_secret", "Mot-YuB2BVPX_oLfTEgyBQ4iSBfX2v1iFrieX3gMzQHrmAvv5N"); // Keep this safe!
    params.append("code", code);
    params.append("redirect_uri", window.location.origin);  // Same redirect URI as before
    params.append("grant_type", "authorization_code");

    try {
      // Fetch the token using the authorization code
      const response = await fetch(tokenUrl, {
        method: "POST",
        body: params,
      });

      const data = await response.json();

      if (data.access_token) {
        console.log("Access Token:", data.access_token);
        localStorage.setItem("twitterToken", data.access_token);

        // Fetch user details with the access token
        fetchUserDetails(data.access_token);
      }
    } catch (error) {
      console.error("Error exchanging code for token:", error);
    }
  };

  // Function to fetch user details from Twitter using the access token
  const fetchUserDetails = async (accessToken) => {
    const userUrl = "https://api.twitter.com/2/users/me";  // Twitter API endpoint for user details

    try {
      const response = await fetch(userUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userData = await response.json();
      console.log("User details:", userData);

      // Assuming the response has the user's name and email (if granted)
      setUser({
        name: userData.data.name,
        username: userData.data.username,
        email: userData.data.email, // This requires user.email scope permission
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <div>
      {!user ? (
        <TwitterLoginButton onClick={handleLogin} />
      ) : (
        <div>
          <h2>Welcome, {user.name}</h2>
          <p>Your username: {user.username}</p>
          <p>Your email: {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default App;
