'use client';

import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Stack,
  Box,
  MenuItem
} from '@mui/material';
import axios from 'axios';

const splitCSV = (s: string) =>
  s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

export default function BrokerCreateForm({ onSuccess }: { onSuccess: () => void }) {
  const [saving, setSaving] = useState(false);

  // UI shows "Full Name", backend needs brokerName
  const [brokerName, setBrokerName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [country, setCountry] = useState('India');
  const [specialization, setSpecialization] = useState(''); // CSV
  const [projects, setProjects] = useState('');             // CSV
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [experienceYears, setExperienceYears] = useState<number | ''>('');
  const [website, setWebsite] = useState('');
  const [rating, setRating] = useState<number | ''>('');
  const [isVerified, setIsVerified] = useState<'yes' | 'no'>('no');

  const handleSubmit = async () => {
    if (!brokerName.trim()) {
      alert('Full name is required');
      return;
    }

    const payload = {
      brokerName: brokerName.trim(), // BE key
      agencyName: agencyName.trim() || undefined,
      specialization: splitCSV(specialization),
      serviceProjectNames: splitCSV(projects),
      location: {
        city: city.trim() || undefined,
        state: stateVal.trim() || undefined,
        country: country.trim() || undefined
      },
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      linkedinProfile: linkedin.trim() || undefined,
      whatsappNumber: whatsapp.trim() || undefined,
      experienceYears: experienceYears === '' ? undefined : Number(experienceYears),
      website: website.trim() || undefined,
      rating: rating === '' ? undefined : Number(rating),
      isVerified: isVerified === 'yes'
    };

    try {
      setSaving(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/broker-directory/create-broker`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      onSuccess();
    } catch (err: any) {
      console.error('Create broker failed:', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to create broker';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Create Broker
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Full Name *" value={brokerName} onChange={(e) => setBrokerName(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Agency" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} fullWidth />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="State" value={stateVal} onChange={(e) => setStateVal(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Country" value={country} onChange={(e) => setCountry(e.target.value)} fullWidth />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Specialization (comma-separated)"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              helperText="e.g. Residential, Commercial"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Projects/Services (comma-separated)"
              value={projects}
              onChange={(e) => setProjects(e.target.value)}
              helperText="e.g. DLF Crest, Leasing, Rentals"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="LinkedIn URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="WhatsApp Number" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} fullWidth />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Experience (years)"
              type="number"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value === '' ? '' : Number(e.target.value))}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Website" value={website} onChange={(e) => setWebsite(e.target.value)} fullWidth />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Rating"
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value === '' ? '' : Number(e.target.value))}
              inputProps={{ step: '0.1', min: 0, max: 5 }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Verified" value={isVerified} onChange={(e) => setIsVerified(e.target.value as any)} fullWidth>
              <MenuItem value="no">No</MenuItem>
              <MenuItem value="yes">Yes</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button variant="outlined" onClick={onSuccess} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving…' : 'Save Broker'}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
