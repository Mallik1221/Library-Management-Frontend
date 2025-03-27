import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { createBook, setLoading } from '../../features/books/bookSlice';

const AddBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.books);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    category: '',
    totalCopies: '',
    availableCopies: '',
    bookImage: null,
  });
  const [errorState, setError] = useState('');

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
    dispatch(setLoading(true));
    try {
      const submitData = new FormData();
      
      // Validate required fields
      const requiredFields = ['title', 'author', 'isbn', 'category', 'totalCopies'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'bookImage' && formData[key]) {
          submitData.append('bookImage', formData[key]);
        } else if (key !== 'bookImage') {
          submitData.append(key, formData[key]);
        }
      });

      // Log the form data being sent
      console.log('Submitting form data:', Object.fromEntries(submitData));

      await dispatch(createBook(submitData));
      navigate('/books');
    } catch (error) {
      console.error('Error adding book:', error);
      setError(error.message || 'Error adding book. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Add New Book
          </Typography>
          {errorState && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorState}
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
              placeholder="Enter a detailed description of the book..."
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
                  Upload Book Image
                </Button>
              </label>
              {formData.bookImage && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {formData.bookImage.name}
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
                {loading ? 'Adding...' : 'Add Book'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => navigate('/books')}
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

export default AddBook; 