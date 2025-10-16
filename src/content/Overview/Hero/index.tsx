'use client';

import React from 'react';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import { styled, alpha } from '@mui/material/styles'; // ✅ sahi import
import { motion } from 'framer-motion';
import { PlayArrowRounded, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

import Navbar from '../Navbar';
import Pricing from '../Pricing';
import FAQSection from '../FAQ';
import ContactSection from '../Contact';
import Footer from '../Footer';


// ===== Theme =====
const DARK_TEAL = '#1a2f73';
const ACCENT_YELLOW = '#f59e0b';
const TEXT_ON_DARK = '#e6f1ef';

const Wrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  background: DARK_TEAL,
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  minHeight: '92vh',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(6),
    minHeight: '62vh'
  }
}));

const BgTile = styled(Box)(() => ({
  position: 'absolute',
  inset: 0,
  backgroundImage: `radial-gradient(${alpha(TEXT_ON_DARK, 0.04)} 2px, transparent 2px)`,
  backgroundSize: '60px 60px',
  pointerEvents: 'none'
}));

const Title = styled(Typography)(() => ({
  fontWeight: 900,
  color: TEXT_ON_DARK,
  lineHeight: 1.05,
  letterSpacing: -0.6,
  fontSize: 'clamp(38px, 6vw, 72px)'
}));

const Highlight = styled('span')(() => ({
  color: ACCENT_YELLOW
}));

const Sub = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: alpha(TEXT_ON_DARK, 0.9),
  maxWidth: 620,
  fontSize: 18
}));

const MatchBtn = styled(Button)(({ theme }) => ({
  padding: `${theme.spacing(1.6)} ${theme.spacing(3.4)}`,
  borderRadius: 999,
  fontWeight: 800,
  textTransform: 'none',
  background: ACCENT_YELLOW,
  color: '#0b1220',
  boxShadow: `0 10px 24px ${alpha(ACCENT_YELLOW, 0.28)}`,
  '&:hover': { background: '#dd8f08' }
}));

const HowItWorksBtn = styled(Button)(({ theme }) => ({
  padding: `${theme.spacing(1.6)} ${theme.spacing(2.4)}`,
  borderRadius: 999,
  textTransform: 'none',
  fontWeight: 700,
  color: TEXT_ON_DARK,
  background: alpha(TEXT_ON_DARK, 0.08),
  border: `1px solid ${alpha(TEXT_ON_DARK, 0.16)}`,
  gap: theme.spacing(1.2),
  '&:hover': { background: alpha(TEXT_ON_DARK, 0.14) }
}));

const PlayDot = styled(Box)(() => ({
  width: 36,
  height: 36,
  borderRadius: 999,
  display: 'grid',
  placeItems: 'center',
  background: alpha(TEXT_ON_DARK, 0.18)
}));

// Local public image (public/hero-broker.png)
const ILLUSTRATION_SRC = '/hero-broker.png';

const HeroBanner: React.FC = () => {
  return (
    <>
      <Navbar />
      <Wrapper>
        <BgTile />

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center" justifyContent={{ xs: 'center', md: 'space-between' }}>
            {/* LEFT */}
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <Title>
                  Get Matched
                  <br />
                  with <Highlight>Trusted</Highlight>
                  <br />
                  Online Brokers
                </Title>

                <Sub>
                  Discover the perfect brokerage platform to match your trading style and financial goals.
                </Sub>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ mt: 3.5 }}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                >
                  <MatchBtn endIcon={<ArrowForwardIcon />}>Match Me</MatchBtn>

                  <HowItWorksBtn>
                    <PlayDot>
                      <PlayArrowRounded />
                    </PlayDot>
                    How It Works
                  </HowItWorksBtn>
                </Stack>
              </motion.div>
            </Grid>

            {/* RIGHT */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.05 }}
                style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
              >
                {/* ✅ Direct <img> (no styled Box, no component="img") */}
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 700,
                    height: 420,
                    borderRadius: 2.25, // ~18px
                    overflow: 'hidden',
                    boxShadow: `0 18px 60px ${alpha('#000', 0.35)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'transparent',
                    // responsive
                    '@media (max-width:900px)': { maxWidth: 560, height: 360 }
                  }}
                >
                  <img
                    src={ILLUSTRATION_SRC}
                    alt="Broker matching illustration"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Wrapper>

      {/* Lower sections */}
     
      <Pricing />
      <FAQSection />
      <ContactSection />
      <Footer />
    </>
  );
};

export default HeroBanner;
