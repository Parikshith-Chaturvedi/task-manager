import React from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const CustomToolbar = ({ user, onLogout }) => {
  const handleLogout = async () => {
    await signOut(auth);
    onLogout();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Task Manager
        </Typography>
        <Avatar sx={{ marginRight: 2 }}>
          {user.email.charAt(0).toUpperCase()}
        </Avatar>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default CustomToolbar;
