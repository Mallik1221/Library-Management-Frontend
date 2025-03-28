import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Book as BookIcon,
  LibraryBooks as LibraryBooksIcon,
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  Notifications as NotificationsIcon,
  MenuBook,
} from '@mui/icons-material';
import { fetchBooks } from '../../features/books/bookSlice';
import { bookService } from '../../services/bookService';
import StatCard from './StatCard';
import QuickActionButton from './QuickActionButton';
import RecentActivity from './RecentActivity';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.books);
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    totalUsers: 0
  });

  useEffect(() => {
    dispatch(fetchBooks());
    const fetchStats = async () => {
      try {
        const response = await bookService.getDashboardStats();
        setStats(response);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome back, {user?.name}
          </Typography>
        </Box>
        <Box>
          <Tooltip title="Notifications">
            <IconButton>
              <NotificationsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Books"
            value={stats.totalBooks}
            icon={<BookIcon />}
            color="primary"
            trend="+12% this month"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Available Books"
            value={stats.availableBooks}
            icon={<LibraryBooksIcon />}
            color="success"
            trend="+5% this week"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Borrowed Books"
            value={stats.borrowedBooks}
            icon={<MenuBook />}
            color="warning"
            trend="+8% this month"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<GroupIcon />}
            color="info"
            trend="+15% this month"
          />
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <QuickActionButton
                  icon={<BookIcon />}
                  label="Add New Book"
                  onClick={() => navigate('/books/add')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <QuickActionButton
                  icon={<PersonAddIcon />}
                  label="Add New User"
                  onClick={() => navigate('/users/add')}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <QuickActionButton
                  icon={<LibraryBooksIcon />}
                  label="Manage Books"
                  onClick={() => navigate('/books')}
                  color="warning"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <QuickActionButton
                  icon={<GroupIcon />}
                  label="Manage Users"
                  onClick={() => navigate('/users')}
                  color="info"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <RecentActivity />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 