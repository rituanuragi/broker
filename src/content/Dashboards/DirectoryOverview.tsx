import {
  Box,
  Grid,
  Typography,
  Avatar,
  Paper,
  Chip,
  Divider,
  Stack,
  Link
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Broker {
  _id: string;
  fullName: string;
  agencyName?: string;
  specialization?: string[];
  location?: {
    city?: string;
    state?: string;
    country?: string;
    address?: string;
    pincode?: string;
  };
  serviceProjectNames?: string[];
  rating?: number;
  isVerified?: boolean;
  avgRating?: number;
  website?: string;
  linkedinProfile?: string;
  whatsappNumber?: string;
  facebookProfile?: string;
  experienceYears?: number;
  email?: string;
  phone?: string;
}

const BrokerOverview = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:3001/broker-directory/get-brokers') // direct call to backend
      .then((res) => {
        console.log('Response from backend:', res); // full response
        console.log('Response data:', res.data); // only data part
        setBrokers(res.data);
      })
      .catch((err) => console.error('Error fetching brokers:', err));
  }, []);

  return (
    <Grid container spacing={4} padding={2}>
      {brokers.map((broker) => (
        <Grid item xs={12} sm={6} md={4} key={broker._id}>
          <Paper elevation={6} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            {/* Header */}
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                {broker.fullName?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6">{broker.fullName}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {broker.agencyName || 'Independent'}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Specializations */}
            {broker.specialization && broker.specialization.length > 0 && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Specialization:
                </Typography>
                <Stack direction="row" flexWrap="wrap" spacing={1} mb={2}>
                  {broker.specialization.map((spec, index) => (
                    <Chip
                      key={index}
                      label={spec}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </>
            )}

            {/* Projects */}
            {broker.serviceProjectNames &&
              broker.serviceProjectNames.length > 0 && (
                <>
                  <Typography variant="subtitle2">Projects:</Typography>
                  <Stack direction="row" flexWrap="wrap" spacing={1} mb={2}>
                    {broker.serviceProjectNames.map((proj, index) => (
                      <Chip
                        key={index}
                        label={proj}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </>
              )}

            {/* Contact Info */}
            <Box mb={1}>
              {broker.email && (
                <Typography variant="body2" gutterBottom>
                  <strong>Email:</strong> {broker.email}
                </Typography>
              )}
              {broker.phone && (
                <Typography variant="body2" gutterBottom>
                  <strong>Phone:</strong> {broker.phone}
                </Typography>
              )}
              {broker.experienceYears !== undefined && (
                <Typography variant="body2" gutterBottom>
                  <strong>Experience:</strong> {broker.experienceYears} years
                </Typography>
              )}
              {broker.rating !== undefined && (
                <Typography variant="body2" gutterBottom>
                  <strong>Rating:</strong> {broker.rating} ⭐ (
                  {broker.avgRating || broker.rating})
                </Typography>
              )}
              {broker.isVerified && (
                <Typography variant="body2" color="green">
                  Verified Broker ✅
                </Typography>
              )}
            </Box>

            {/* Links */}
            <Stack direction="row" spacing={1} mt={2}>
              {broker.website && (
                <Link href={broker.website} target="_blank" underline="hover">
                  Website
                </Link>
              )}
              {broker.linkedinProfile && (
                <Link
                  href={broker.linkedinProfile}
                  target="_blank"
                  underline="hover"
                >
                  LinkedIn
                </Link>
              )}
              {broker.facebookProfile && (
                <Link
                  href={broker.facebookProfile}
                  target="_blank"
                  underline="hover"
                >
                  Facebook
                </Link>
              )}
              {broker.whatsappNumber && (
                <Link
                  href={`https://wa.me/${broker.whatsappNumber}`}
                  target="_blank"
                  underline="hover"
                >
                  WhatsApp
                </Link>
              )}
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default BrokerOverview;
