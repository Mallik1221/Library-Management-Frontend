import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './app/store';
import Navbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import BookList from './components/books/BookList';
import BookDetail from './components/books/BookDetail';
import AddBook from './components/books/AddBook';
import EditBook from './components/books/EditBook';
import AdminDashboard from './components/dashboard/AdminDashboard';
import LibrarianDashboard from './components/dashboard/LibrarianDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import MemberDashboard from './components/dashboard/MemberDashboard';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<BookList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/books/:id" element={<BookDetail />} />

              {/* Protected Routes */}
              <Route
                path="/books/add"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Librarian']}>
                    <AddBook />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/books/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Librarian']}>
                    <EditBook />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/librarian"
                element={
                  <ProtectedRoute allowedRoles={['Librarian']}>
                    <LibrarianDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/member"
                element={
                  <ProtectedRoute allowedRoles={['Member']}>
                    <MemberDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
