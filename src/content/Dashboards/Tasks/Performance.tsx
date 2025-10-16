import {
  Card,
  Box,
  CardContent,
  Typography,
  Avatar,
  useTheme,
  LinearProgress,
  styled,
} from '@mui/material';
import AssignmentTurnedInTwoToneIcon from '@mui/icons-material/AssignmentTurnedInTwoTone';
import CancelPresentationTwoToneIcon from '@mui/icons-material/CancelPresentationTwoTone';
import { useEffect, useState } from 'react';
import axios from 'axios';

// --- Styled Components ---
const RootWrapper = styled(Card)(
  ({ theme }) => `
    background: linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.success.main});
    color: ${theme.palette.common.white};
    border-radius: ${theme.shape.borderRadius}px;
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background-color: ${theme.palette.common.white};
    color: ${theme.palette.success.main};
    width: ${theme.spacing(8)};
    height: ${theme.spacing(8)};
    box-shadow: 0 4px 12px ${theme.palette.success.main}33;
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
    background-color: ${theme.palette.error.main};
    color: ${theme.palette.common.white};
    width: ${theme.spacing(8)};
    height: ${theme.spacing(8)};
    box-shadow: 0 4px 12px ${theme.palette.error.main}33;
`
);

const TypographySecondary = styled(Typography)(
  ({ theme }) => `
    color: ${theme.palette.common.white}99;
`
);

const LinearProgressWrapper = styled(LinearProgress)(
  ({ theme }) => `
    flex-grow: 1;
    margin-right: ${theme.spacing(1)};
    height: 12px;
    border-radius: ${theme.shape.borderRadius}px;

    .MuiLinearProgress-barColorPrimary {
      border-radius: ${theme.shape.borderRadius}px;
    }
`
);

// --- Performance Component ---
function Performance() {
  const theme = useTheme();

  const [bankerCount, setBankerCount] = useState(0);
  const [lenderCount, setLenderCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [lendersRes, bankersRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/lenders`),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/broker-directory`),
        ]);

        const lendersData = Array.isArray(lendersRes.data)
          ? lendersRes.data
          : lendersRes.data.data;

        const bankersData = Array.isArray(bankersRes.data)
          ? bankersRes.data
          : bankersRes.data.data;

        setLenderCount(lendersData?.length || 0);
        setBankerCount(bankersData?.length || 0);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  const total = bankerCount + lenderCount;
  const completionRate = total === 0 ? 0 : Math.round((lenderCount / total) * 100);

  return (
    <RootWrapper sx={{ p: 3 }}>
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: 600 }}
      >
        Performance Overview
      </Typography>
      <CardContent>
        {/* Bankers */}
        <Box display="flex" alignItems="center" mb={3}>
          <AvatarSuccess variant="rounded" sx={{ mr: 2 }}>
            <AssignmentTurnedInTwoToneIcon fontSize="large" />
          </AvatarSuccess>
          <Box>
            <Typography variant="h4">{bankerCount}</Typography>
            <TypographySecondary variant="subtitle2">
              Bankers Count
            </TypographySecondary>
          </Box>
        </Box>

        {/* Lenders */}
        <Box display="flex" alignItems="center" mb={3}>
          <AvatarError variant="rounded" sx={{ mr: 2 }}>
            <CancelPresentationTwoToneIcon fontSize="large" />
          </AvatarError>
          <Box>
            <Typography variant="h4">{lenderCount}</Typography>
            <TypographySecondary variant="subtitle2">
              Lenders Count
            </TypographySecondary>
          </Box>
        </Box>

        {/* Completion Rate Bar */}
        <Box display="flex" alignItems="center">
          <LinearProgressWrapper
            variant="determinate"
            value={completionRate}
            sx={{
              backgroundColor: theme.palette.grey[500_16],
              '& .MuiLinearProgress-barColorPrimary': {
                backgroundColor: completionRate > 50 ? theme.palette.success.main : theme.palette.error.main,
              },
            }}
          />
          <Typography variant="body2" sx={{ ml: 2, fontWeight: 600 }}>
            {completionRate}%
          </Typography>
        </Box>
      </CardContent>
    </RootWrapper>
  );
}

export default Performance;
