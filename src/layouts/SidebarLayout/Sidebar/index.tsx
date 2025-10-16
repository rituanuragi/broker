'use client';

import { useContext } from 'react';
import Scrollbar from 'src/components/Scrollbar';
import { SidebarContext } from 'src/contexts/SidebarContext';

import { Box, Drawer, styled, Divider, useTheme, alpha } from '@mui/material';

import SidebarMenu from './SidebarMenu';

/** Brand blues (from your sample) */
const BRAND_BLUE = '#29469b';
const BRAND_BLUE_DARK = '#1a2f73';
const BORDER_ALPHA = 0.1;

const SidebarWrapper = styled(Box)(({ theme }) => ({
  width: theme.sidebar.width,
  minWidth: theme.sidebar.width,
  position: 'relative',
  zIndex: 7,
  height: '100%',

  background: `linear-gradient(180deg, ${BRAND_BLUE} 0%, ${BRAND_BLUE_DARK} 100%)`,
  color: alpha('#ffffff', 0.92),

  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    backgroundImage: `radial-gradient(${alpha(
      '#ffffff',
      0.05
    )} 1px, transparent 1px)`,
    backgroundSize: '18px 18px',
    pointerEvents: 'none'
  },

  borderRight: `1px solid ${alpha('#000', BORDER_ALPHA)}`,
  paddingBottom: 68,

  '& .MuiListItemButton-root': {
    borderRadius: 12,
    margin: '4px 12px',
    padding: '10px 12px',
    color: alpha('#ffffff', 0.92),
    transition: 'background .2s ease, color .2s ease'
  },
  '& .MuiListItemIcon-root': {
    minWidth: 34,
    color: alpha('#ffffff', 0.86)
  },
  '& .MuiListItemButton-root:hover': {
    background: alpha('#ffffff', 0.1)
  },
  '& .Mui-selected, & .Mui-selected:hover': {
    background: alpha('#ffffff', 0.18),
    color: '#ffffff'
  },
  '& .Mui-selected .MuiListItemIcon-root': {
    color: '#ffffff'
  }
}));

const LogoWrap = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(2.5)
}));

// Transparent logo container (no background, no border, no shadow)
const LogoBadge = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: 0,
  borderRadius: 0,
  background: 'transparent',
  border: 'none',
  boxShadow: 'none'
}));

function Sidebar() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();
  const theme = useTheme();

  return (
    <>
      {/* Desktop Sidebar */}
      <SidebarWrapper
        sx={{
          display: { xs: 'none', lg: 'inline-block' },
          position: 'fixed',
          left: 0,
          top: 0,
          boxShadow: '0 2px 10px rgba(0,0,0,0.10)'
        }}
      >
        <Scrollbar>
          {/* Logo */}
          <LogoWrap>
            <LogoBadge>
              <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src="/static/images/logo/f2realtor.png"
                  alt="F2Fin Logo"
                  style={{
                    width: 'clamp(56px, 6vw, 88px)', // ⬅️ bigger + responsive
                    height: 'clamp(62px, 6vw, 138px)', // ⬅️ bigger + responsive
                    objectFit: 'contain',
                    display: 'block',
                    border: 'none',
                    borderRadius: 0
                  }}
                />
              </a>
            </LogoBadge>
          </LogoWrap>

          {/* Divider */}
          <Divider sx={{ mt: 2, mx: 2, borderColor: alpha('#ffffff', 0.16) }} />

          {/* Menu */}
          <SidebarMenu />
        </Scrollbar>

        {/* Bottom thin divider */}
        <Divider sx={{ borderColor: alpha('#ffffff', 0.16) }} />
      </SidebarWrapper>

      {/* Mobile Sidebar Drawer */}
      <Drawer
        sx={{ boxShadow: theme.sidebar.boxShadow }}
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        open={sidebarToggle}
        onClose={closeSidebar}
        variant="temporary"
        elevation={12}
        PaperProps={{
          sx: {
            width: theme.sidebar.width,
            background: `linear-gradient(180deg, ${BRAND_BLUE} 0%, ${BRAND_BLUE_DARK} 100%)`,
            color: alpha('#ffffff', 0.92),
            borderRight: `1px solid ${alpha('#000', BORDER_ALPHA)}`
          }
        }}
      >
        <SidebarWrapper sx={{ boxShadow: 'none' }}>
          <Scrollbar>
            <Box mt={3} px={2} display="flex" justifyContent="center">
              <LogoBadge>
                <img
                  src="/static/images/logo/f2realtor.png"
                  alt="F2Fin Logo"
                  style={{
                    width: 40,
                    height: 80,
                    objectFit: 'contain',
                    display: 'block',
                    border: 'none',
                    borderRadius: 0
                  }}
                />
              </LogoBadge>
            </Box>

            <Divider
              sx={{ mt: 3, mx: 2, borderColor: alpha('#ffffff', 0.16) }}
            />

            <SidebarMenu />
          </Scrollbar>
        </SidebarWrapper>
      </Drawer>
    </>
  );
}

export default Sidebar;
