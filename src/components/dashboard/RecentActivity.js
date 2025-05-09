import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import { bookService } from '../../services/bookService';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const data = await bookService.getRecentBorrowings();
        setActivities(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecentActivities();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!activities.length) {
    return (
      <Box p={3}>
        <Typography>No recent activities</Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Book</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity._id}>
              <TableCell>{activity.book?.title || 'Unknown Book'}</TableCell>
              <TableCell>{activity.user?.name || 'Unknown User'}</TableCell>
              <TableCell>Borrowed</TableCell>
              <TableCell>
                {activity.borrowedAt ? format(new Date(activity.borrowedAt), 'MMM dd, yyyy') : 'N/A'}
              </TableCell>
              <TableCell>
                <Chip
                  label={
                    activity.returnedAt 
                      ? 'Returned' 
                      : activity.dueDate && new Date(activity.dueDate) < new Date() 
                      ? 'Overdue' 
                      : 'Borrowed'
                  }
                  color={
                    activity.returnedAt
                      ? 'success'
                      : activity.dueDate && new Date(activity.dueDate) < new Date()
                      ? 'error'
                      : 'warning'
                  }
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecentActivity; 