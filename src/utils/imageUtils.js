const BACKEND_URL = 'https://library-management-backend-7i5z.onrender.com';

export const getImageUrl = (imagePath, defaultImage = 'https://via.placeholder.com/200x300?text=No+Image') => {
  if (!imagePath) return defaultImage;
  if (imagePath.startsWith('http')) return imagePath;
  return `${BACKEND_URL}${imagePath}`;
};

export const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/200x300?text=No+Image';
export const LARGE_PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x600?text=No+Image'; 