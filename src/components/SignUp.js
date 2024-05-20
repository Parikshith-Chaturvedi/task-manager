import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Link,
  Grid,
} from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const SignUp = ({ onSignUp, switchToSignIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onSignUp();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Card sx={{ padding: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="small"
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained" color="primary">
              Sign Up
            </Button>
          </form>
          <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
            <Link component="button" variant="body2" onClick={switchToSignIn}>
              Already have an account? Sign In
            </Link>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SignUp;
