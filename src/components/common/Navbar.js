import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LIBRARY
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <Button
              component={Link}
              to="/books"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Books
            </Button>

            {user && user.role === 'Admin' && (
              <Button
                component={Link}
                to="/dashboard/admin"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Admin Dashboard
              </Button>
            )}

            {user && user.role === 'Librarian' && (
              <Button
                component={Link}
                to="/dashboard/librarian"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Librarian Dashboard
              </Button>
            )}

            {user && user.role === 'Member' && (
              <Button
                component={Link}
                to="/dashboard/member"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                My Dashboard
              </Button>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Typography variant="body1" component="span" sx={{ mr: 2 }}>
                  Welcome, {user.name}
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 