import React from 'react';
import { Button, Typography } from '@mui/material';

const QuickActionButton = ({ icon, label, onClick, color = 'primary' }) => (
  <Button
    fullWidth
    variant="outlined"
    onClick={onClick}
    sx={{
      height: '100%',
      py: 2,
      px: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1,
      borderColor: `${color}.main`,
      color: `${color}.main`,
      '&:hover': {
        borderColor: `${color}.dark`,
        backgroundColor: `${color}.lighter`,
      },
    }}
  >
    {React.cloneElement(icon, { sx: { fontSize: 32 } })}
    <Typography variant="body2" align="center">
      {label}
    </Typography>
  </Button>
);

export default QuickActionButton; 