import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  CardActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchBooks, deleteBookById } from '../../features/books/bookSlice';
import { useNavigate } from 'react-router-dom';

const BookList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { books = [], loading, error } = useSelector((state) => state.books);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadBooks = async () => {
      try {
        await dispatch(fetchBooks());
      } catch (error) {
        console.error('Error loading books:', error);
      }
    };
    loadBooks();
  }, [dispatch]);

  // Ensure books is an array before filtering
  const filteredBooks = Array.isArray(books) ? books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleAddBook = () => {
    navigate('/books/add');
  };

  const handleEditBook = (e, bookId) => {
    e.stopPropagation();
    navigate(`/books/${bookId}/edit`);
  };

  const handleDeleteBook = async (e, bookId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await dispatch(deleteBookById(bookId));
        dispatch(fetchBooks());
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const isAdminOrLibrarian = user && (user.role === 'Admin' || user.role === 'Librarian');

  const getImageUrl = (bookImage) => {
    if (!bookImage) return 'https://via.placeholder.com/200x300?text=No+Image';
    if (bookImage.startsWith('http')) return bookImage;
    // Ensure the path starts with /uploads/
    if (!bookImage.startsWith('/uploads/')) {
      return `http://localhost:5000/uploads/${bookImage}`;
    }
    return `http://localhost:5000${bookImage}`;
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
          {error.message || 'Error loading books. Please try again later.'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Library Books
        </Typography>
        {isAdminOrLibrarian && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddBook}
          >
            Add New Book
          </Button>
        )}
      </Box>

      <TextField
        fullWidth
        label="Search books"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
      />

      <Grid 
        container 
        spacing={3} 
        justifyContent="flex"
        sx={{
          margin: '0 auto',
          width: '100%',
          maxWidth: 'calc(280px * 5 + 24px * 3)', // 4 cards + 3 gaps
        }}
      >
        {filteredBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={book._id} sx={{ maxWidth: 280 }}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 320,
                width: '100%',
                position: 'relative',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 2,
                },
              }}
              onClick={() => navigate(`/books/${book._id}`)}
            >
              <Box sx={{ position: 'relative', height: 160, bgcolor: 'grey.50' }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={getImageUrl(book.bookImage)}
                  alt={book.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/200x300?text=No+Image';
                  }}
                  sx={{
                    objectFit: 'contain',
                    p: 1,
                    height: '100%',
                  }}
                />
              </Box>
              <CardContent 
                sx={{ 
                  flex: 1,
                  p: 1.5,
                  '&:last-child': { pb: isAdminOrLibrarian ? 5 : 1.5 }
                }}
              >
                <Typography 
                  variant="subtitle1"
                  sx={{
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.2,
                  }}
                >
                  {book.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.8125rem',
                    mb: 0.5,
                    lineHeight: 1.2 
                  }}
                >
                  Author: {book.author}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.8125rem',
                    lineHeight: 1.2 
                  }}
                >
                  Category: {book.category}
                </Typography>
              </CardContent>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: isAdminOrLibrarian ? 40 : 8,
                  left: 12,
                  right: 12,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8125rem',
                    color: 'text.secondary',
                  }}
                >
                  <span>Status: {book.status}</span>
                  <span>{book.availableCopies} / {book.totalCopies}</span>
                </Typography>
              </Box>
              {isAdminOrLibrarian && (
                <CardActions 
                  sx={{ 
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    height: 36,
                    p: 0.5,
                    bgcolor: 'background.paper',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={(e) => handleEditBook(e, book._id)}
                  >
                    <EditIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => handleDeleteBook(e, book._id)}
                  >
                    <DeleteIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BookList; 