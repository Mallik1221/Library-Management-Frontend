import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  fetchBookById,
  deleteBookById,
  borrowBookById,
  returnBookById,
} from '../../features/books/bookSlice';
import { getImageUrl, LARGE_PLACEHOLDER_IMAGE } from '../../utils/imageUtils';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentBook: book, loading, error } = useSelector((state) => state.books);
  const { user } = useSelector((state) => state.auth);
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchBookById(id));
  }, [dispatch, id]);

  const isAdminOrLibrarian = user && (user.role === 'Admin' || user.role === 'Librarian');
  const isMember = user && user.role === 'Member';

  const handleDelete = async () => {
    try {
      await dispatch(deleteBookById(id));
      navigate('/books');
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleBorrow = async () => {
    try {
      await dispatch(borrowBookById(id));
      dispatch(fetchBookById(id));
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };

  const handleReturn = async () => {
    try {
      await dispatch(returnBookById(id));
      dispatch(fetchBookById(id));
    } catch (error) {
      console.error('Error returning book:', error);
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

  if (!book) {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 2 }}>
          Book not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <img
              src={getImageUrl(book.bookImage, LARGE_PLACEHOLDER_IMAGE)}
              alt={book.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '400px',
                objectFit: 'contain',
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = LARGE_PLACEHOLDER_IMAGE;
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {book.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              by {book.author}
            </Typography>
            
            <Box sx={{ my: 2 }}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
                {book.description || 'No description available'}
              </Typography>
            </Box>

            <Box sx={{ my: 2 }}>
              <Typography variant="body1" paragraph>
                <strong>Category:</strong> {book.category}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>ISBN:</strong> {book.isbn}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Status:</strong> {book.status}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Available Copies:</strong> {book.availableCopies} / {book.totalCopies}
              </Typography>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              {isAdminOrLibrarian && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/books/${id}/edit`)}
                  >
                    Edit Book
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setDeleteDialog(true)}
                  >
                    Delete Book
                  </Button>
                </>
              )}
              {isMember && (
                <>
                  {book.status === 'Available' && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleBorrow}
                    >
                      Borrow Book
                    </Button>
                  )}
                  {book.status === 'Borrowed' && book.borrower === user._id && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleReturn}
                    >
                      Return Book
                    </Button>
                  )}
                </>
              )}
              <Button
                variant="outlined"
                onClick={() => navigate('/books')}
              >
                Back to Books
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this book?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookDetail; 