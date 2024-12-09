import React, { useState } from "react";
import { TwitterLoginButton } from "react-social-login-buttons";

const App = () => {
  const [user, setUser] = useState(null);
  
  const handleLogin = async () => {
    const twitterWindow = window.open(
      `https://api.twitter.com/oauth2/authorize?response_type=token&client_id=YOUR_CLIENT_ID&redirect_uri=${encodeURIComponent(
        window.location.origin
      )}&scope=tweet.read`,
      "_blank",
      "width=500,height=600"
    );

    window.addEventListener("message", (event) => {
      if (event.origin !== window.location.origin) return;

      const { token, user } = event.data;
      if (token) {
        localStorage.setItem("twitterToken", token);
        setUser(user);
      }
    });
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
