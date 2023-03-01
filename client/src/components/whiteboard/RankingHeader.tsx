import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { CssBaseline } from '@mui/material';

/* Right side header */
export default function RankingHeader() {
  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `40%`,
          mr: `60%`,
          backgroundColor: 'transparent',
          boxShadow: 'none',
          marginTop: '20px',
        }}
      >
        <Toolbar
          sx={{
            /* FIXME: 가운데 정렬 */
            justifyContent: 'center',
            marginLeft: '20px',
          }}
        >
          <Typography
            noWrap
            component="div"
            align="center"
            sx={{
              textAlign: 'center',
              fontFamily: 'Firenze',
              fontSize: '2em',
              fontWeight: '800',
            }}
          >
            코드와트 코딩 랭킹 🔥
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
}
