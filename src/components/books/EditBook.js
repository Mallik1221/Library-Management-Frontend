import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { fetchBookById, updateBookById } from '../../features/books/bookSlice';

const EditBook = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBook: book, loading, error } = useSelector((state) => state.books);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    category: '',
    availableCopies: '',
    totalCopies: '',
    bookImage: null,
  });

  useEffect(() => {
    dispatch(fetchBookById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        description: book.description || '',
        category: book.category || '',
        availableCopies: book.availableCopies || '',
        totalCopies: book.totalCopies || '',
        bookImage: null,
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      bookImage: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateBookById(id, formData));
      navigate(`/books/${id}`);
    } catch (error) {
      console.error('Error updating book:', error);
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
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Edit Book
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="ISBN"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Total Copies"
              name="totalCopies"
              type="number"
              value={formData.totalCopies}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Available Copies"
              name="availableCopies"
              type="number"
              value={formData.availableCopies}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Box sx={{ mt: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="book-image"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="book-image">
                <Button variant="outlined" component="span">
                  Upload New Book Image
                </Button>
              </label>
              {formData.bookImage && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {formData.bookImage.name}
                </Typography>
              )}
              {book?.bookImage && !formData.bookImage && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Current image: {book.bookImage}
                </Typography>
              )}
            </Box>
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Book'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => navigate(`/books/${id}`)}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default EditBook; 