import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

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
            backgroundColor: `${color}.main`,
            borderRadius: '50%',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8,
          }}
        >
          {React.cloneElement(icon, { sx: { color: 'white', fontSize: 32 } })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default StatCard; 