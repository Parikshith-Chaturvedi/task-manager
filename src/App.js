import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Container, CircularProgress } from "@mui/material";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import TaskPage from "./components/TaskPage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const switchToSignIn = () => setIsSignUp(false);
  const switchToSignUp = () => setIsSignUp(true);

  if (loading) {
    return (
      <Container sx={{ my: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (user) {
    return (
      <Router>
        <Routes>
          <Route
            path="/tasks"
            element={<TaskPage user={user} onLogout={handleLogout} />}
          />
          <Route path="*" element={<Navigate to="/tasks" />} />
        </Routes>
      </Router>
    );
  } else {
    return (
      <Container sx={{ my: 4 }}>
        {isSignUp ? (
          <SignUp switchToSignIn={switchToSignIn} />
        ) : (
          <SignIn switchToSignUp={switchToSignUp} />
        )}
      </Container>
    );
  }
};

export default App;
