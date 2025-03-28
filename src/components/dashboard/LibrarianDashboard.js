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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  Book as BookIcon,
  LibraryBooks as LibraryBooksIcon,
  People as PeopleIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { fetchBooks } from '../../features/books/bookSlice';
import { bookService } from '../../services/bookService';
import StatCard from './StatCard';
import QuickActionButton from './QuickActionButton';

const LibrarianDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { books, loading, error } = useSelector((state) => state.books);
  const { user } = useSelector((state) => state.auth);
  const [recentBorrowings, setRecentBorrowings] = useState([]);
  const [borrowingsLoading, setBorrowingsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    overdueBooks: 0
  });

  useEffect(() => {
    dispatch(fetchBooks());
    fetchRecentBorrowings();
    const fetchStats = async () => {
      try {
        const response = await bookService.getDashboardStats();
        setStats(response);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err.message);
      }
    };
    fetchStats();
  }, [dispatch]);

  const fetchRecentBorrowings = async () => {
    try {
      setBorrowingsLoading(true);
      const response = await bookService.getRecentBorrowings();
      setRecentBorrowings(response);
    } catch (error) {
      console.error('Error fetching recent borrowings:', error);
    } finally {
      setBorrowingsLoading(false);
    }
  };

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
            Librarian Dashboard
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
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Books"
            value={stats.totalBooks}
            icon={<LibraryBooksIcon />}
            color="primary"
            trend="+12% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Available Books"
            value={stats.availableBooks}
            icon={<BookIcon />}
            color="success"
            trend="+5% this week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Borrowed Books"
            value={stats.borrowedBooks}
            icon={<PeopleIcon />}
            color="warning"
            trend="+8% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overdue Books"
            value={stats.overdueBooks}
            icon={<WarningIcon />}
            color="error"
            trend="+3% this week"
          />
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <QuickActionButton
                  icon={<AddIcon />}
                  label="Add New Book"
                  onClick={() => navigate('/books/add')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <QuickActionButton
                  icon={<LibraryBooksIcon />}
                  label="Manage Books"
                  onClick={() => navigate('/books')}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <QuickActionButton
                  icon={<CheckCircleIcon />}
                  label="Process Returns"
                  onClick={() => navigate('/books/returns')}
                  color="warning"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Borrowings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Borrowings
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Book Title</TableCell>
                    <TableCell>Borrower</TableCell>
                    <TableCell>Borrowed Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {borrowingsLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : recentBorrowings.length > 0 ? (
                    recentBorrowings.map((borrow) => (
                      <TableRow key={borrow._id}>
                        <TableCell>{borrow.book.title}</TableCell>
                        <TableCell>{borrow.user.name}</TableCell>
                        <TableCell>
                          {new Date(borrow.borrowedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(borrow.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={borrow.returnedAt ? 'Returned' : borrow.dueDate < new Date().toISOString() ? 'Overdue' : 'Borrowed'}
                            color={
                              borrow.returnedAt
                                ? 'success'
                                : borrow.dueDate < new Date().toISOString()
                                ? 'error'
                                : 'warning'
                            }
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No recent borrowings to display
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LibrarianDashboard; 