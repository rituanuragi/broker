import {

  Tooltip,
  Badge,
  TooltipProps,
  tooltipClasses,
  styled,
  useTheme
} from '@mui/material';
import Link from 'src/components/Link';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        display: flex;
        text-decoration: none;
        width: 53px;
        margin: 0 auto;
        font-weight: ${theme.typography.fontWeightBold};
`
);

const LogoImage = styled('img')(
  () => `
        max-width: 100%;
        height: auto;
        object-fit: contain;
        border-radius: 8px;
`
);

const TooltipWrapper = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.colors.alpha.trueWhite[100],
    color: theme.palette.getContrastText(theme.colors.alpha.trueWhite[100]),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 'bold',
    borderRadius: theme.general.borderRadiusSm,
    boxShadow:
      '0 .2rem .8rem rgba(7,9,25,.18), 0 .08rem .15rem rgba(7,9,25,.15)'
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.colors.alpha.trueWhite[100]
  }
}));

function Logo() {
  const theme = useTheme();

  return (
    <TooltipWrapper
      title=""
      arrow
    >
      <LogoWrapper href="/">
        <Badge
          sx={{
            '.MuiBadge-badge': {
              fontSize: theme.typography.pxToRem(11),
              right: -2,
              top: 8
            }
          }}
          overlap="circular"
          color="success"
          badgeContent="1.0"
        >
          <LogoImage
            src="static/images/logo/f2realtor.png"
            alt="Logo"
          />
        </Badge>
      </LogoWrapper>
    </TooltipWrapper>
  );
}

export default Logo;