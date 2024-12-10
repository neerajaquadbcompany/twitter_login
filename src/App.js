import React, { useState } from "react";
import { getAuth, signInWithPopup, TwitterAuthProvider } from "firebase/auth";
import app from "./firebase-config";

const auth = getAuth(app);

const App = () => {
    const [user, setUser] = useState(null);

    const loginWithTwitter = async () => {
        const provider = new TwitterAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const credential = TwitterAuthProvider.credentialFromResult(result);
            const user = result.user;

            
            setUser({
                displayName: user.displayName,
                email: user.email, 
                photoURL: user.photoURL,
            });
        } catch (error) {
            console.error("Error during Twitter login:", error);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            {!user ? (
                <button onClick={loginWithTwitter}>Login with Twitter</button>
            ) : (
                <div>
                    <h2>Welcome, {user.displayName}!</h2>
                    {user.email && <p>Email: {user.email}</p>}
                    <img
                        src={user.photoURL}
                        alt="Profile"
                        style={{ borderRadius: "50%", width: "100px", height: "100px" }}
                    />
                </div>
            )}
        </div>
    );
};

export default App;
