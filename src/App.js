import React, { useState, useEffect } from "react";
import { TwitterLoginButton } from "react-social-login-buttons";

const App = () => {
  const [user, setUser] = useState(null);

  // This useEffect will handle the message event when the popup sends data back
  useEffect(() => {
    const messageHandler = (event) => {
      if (event.origin !== window.location.origin) return;  // Check origin for security

      const { token, user } = event.data;
      if (token && user) {
        localStorage.setItem("twitterToken", token); // Save token to localStorage
        setUser(user); // Set the user data to display in the original window

        // Close the popup after successful login
        if (event.source) {
          event.source.close();
        }
      }
    };

    // Listen for the message event from the popup window
    window.addEventListener("message", messageHandler);

    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, []);

  const handleLogin = async () => {
    const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=OW1oUUVNT0xCT3UzNHpKUXphMUY6MTpjaQ&redirect_uri=${encodeURIComponent(
      window.location.origin
    )}&scope=tweet.read users.read&state=state123&code_challenge=challenge&code_challenge_method=plain`;

    // Open Twitter login in a new window
    const twitterWindow = window.open(authUrl, "_blank", "width=500,height=600");

    // Listen for the message from the popup
    window.addEventListener("message", (event) => {
      if (event.origin !== window.location.origin) return; // Verify the origin of the message

      const { token, user } = event.data;
      if (token) {
        localStorage.setItem("twitterToken", token);
        setUser(user);  // Update state with user data

        // Close the popup window after successful login
        if (twitterWindow) {
          twitterWindow.close();
        }
      }
    });
  };

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

        // Send the access token and user data to the original window
        window.opener.postMessage({ token: data.access_token, user: { name: "User", username: "user123" } }, window.location.origin); // Replace with actual user data
      }
    } catch (error) {
      console.error("Error exchanging code for token:", error);
    }
  };

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

      // Assuming the response has the user's name and username
      setUser({
        name: userData.data.name,
        username: userData.data.username,
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
        </div>
      )}
    </div>
  );
};

export default App;
