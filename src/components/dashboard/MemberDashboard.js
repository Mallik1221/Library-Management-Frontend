import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
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
  Tabs,
  Tab,
  Button,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Book as BookIcon,
  LibraryBooks as LibraryBooksIcon,
  History as HistoryIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { fetchUserHistory } from '../../features/books/bookSlice';

const StatCard = ({ title, value, icon, color, trend }) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          {trend && (
            <Box display="flex" alignItems="center" mt={1}>
              <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5 }} />
              <Typography variant="body2" color="success.main">
                {trend}
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}15`,
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

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
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" gutterBottom>
                  Welcome, {user?.name || 'Member'}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Member Dashboard
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
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <StatCard
            title="Currently Borrowed"
            value={currentlyBorrowed.length}
            icon={<BookIcon sx={{ color: 'primary.main', fontSize: 40 }} />}
            color="primary"
            trend="+2 this month"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Books Read"
            value={borrowHistory.length}
            icon={<LibraryBooksIcon sx={{ color: 'success.main', fontSize: 40 }} />}
            color="success"
            trend="+5 this month"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Fines"
            value={`₹${userHistory.reduce((total, record) => total + (record.fine || 0), 0)}`}
            icon={<WarningIcon sx={{ color: 'error.main', fontSize: 40 }} />}
            color="error"
            trend="₹0 this month"
          />
        </Grid>

        {/* Tabs Section */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Currently Borrowed" />
              <Tab label="Borrowing History" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Book Title</TableCell>
                      <TableCell>Borrowed Date</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Fine</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentlyBorrowed.length > 0 ? (
                      currentlyBorrowed.map((record) => (
                        <TableRow key={record._id}>
                          <TableCell>{record.title}</TableCell>
                          <TableCell>
                            {new Date(record.borrowedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(record.dueDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={record.returnedAt ? 'Returned' : 'Borrowed'}
                              color={record.returnedAt ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            ₹{calculateFine(record.dueDate)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No books currently borrowed
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Book Title</TableCell>
                      <TableCell>Borrowed Date</TableCell>
                      <TableCell>Returned Date</TableCell>
                      <TableCell>Fine Paid</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {borrowHistory.length > 0 ? (
                      borrowHistory.map((record) => (
                        <TableRow key={record._id}>
                          <TableCell>{record.title}</TableCell>
                          <TableCell>
                            {new Date(record.borrowedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(record.returnedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            ₹{record.fine || 0}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No borrowing history available
                          </Typography>
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