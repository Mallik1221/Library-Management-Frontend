import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchUserHistory } from '../../features/books/bookSlice';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const MemberDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userHistory = [], loading, error } = useSelector((state) => state.books);
  const { user } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(fetchUserHistory());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter currently borrowed books
  const currentlyBorrowed = userHistory.filter(
    (record) => !record.returnedAt
  );

  // Filter returned books for history
  const borrowHistory = userHistory.filter(
    (record) => record.returnedAt
  );

  // Calculate fines and due dates
  const calculateFine = (dueDate) => {
    if (!dueDate) return 0;
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * 5 : 0; // ₹5 per day
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
          {error.message || 'An error occurred while fetching your history'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" gutterBottom>
              Welcome, {user?.name || 'Member'}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Member Dashboard
            </Typography>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Currently Borrowed
              </Typography>
              <Typography variant="h3">
                {currentlyBorrowed.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Books Borrowed
              </Typography>
              <Typography variant="h3">
                {userHistory.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Fines
              </Typography>
              <Typography variant="h3">
                ₹{userHistory.reduce((total, record) => total + (record.fine || 0), 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabs Section */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Currently Borrowed" />
              <Tab label="Borrowing History" />
            </Tabs>

            {/* Currently Borrowed Books */}
            <TabPanel value={tabValue} index={0}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Book Title</TableCell>
                      <TableCell>Borrowed Date</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Fine (if overdue)</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentlyBorrowed.map((record) => (
                      <TableRow key={record._id}>
                        <TableCell>{record.title}</TableCell>
                        <TableCell>
                          {new Date(record.borrowedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(record.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          ₹{calculateFine(record.dueDate)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(`/books/${record.bookId._id}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {currentlyBorrowed.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No books currently borrowed
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* Borrowing History */}
            <TabPanel value={tabValue} index={1}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Book Title</TableCell>
                      <TableCell>Borrowed Date</TableCell>
                      <TableCell>Return Date</TableCell>
                      <TableCell>Fine Paid</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {borrowHistory.map((record) => (
                      <TableRow key={record._id}>
                        <TableCell>{record.title}</TableCell>
                        <TableCell>
                          {new Date(record.borrowedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(record.returnedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>₹{record.fine || 0}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(`/books/${record.bookId._id}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {borrowHistory.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No borrowing history available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MemberDashboard; 