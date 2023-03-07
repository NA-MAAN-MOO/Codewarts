import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BadgeLogo from 'components/BadgeLogo';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';
import VolumeIcon from 'components/VolumeIcon';
import MicIcon from 'components/MicIcon';
import { styledTheme } from 'styles/theme';
import svgs from 'assets/solvedac_badges/index';
import { APPLICATION_URL } from 'utils/Constants';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface DetailInfo {
  bojId: string;
  id: string;
  maxStreak: number;
  nickname: string;
  tier: number;
  solved: number;
}

const GamePlayerItem = ({ name, char }: { name: string; char: string }) => {
  const { volMuteInfo, micMuteInfo, playerId } = useSelector(
    (state: RootState) => ({ ...state.chat, ...state.user })
  );
  const { APPLICATION_DB_URL } = APPLICATION_URL;

  const [myTier, setMyTier] = useState(0);
  useEffect(() => {
    (async () => {
      try {
        const { data }: { data: DetailInfo[] } = await axios.get(
          `${APPLICATION_DB_URL}/user-rank`
        );
        const tier = data?.find((d) => d.nickname === name)?.tier || 0;
        setMyTier(tier);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // const rankInfos = useSelector((state: RootState) => state.rank.infos);

  // const myTier = rankInfos?.find((d) => d.nickname === name)?.tier || '';
  const SvgComponent = svgs[`Svg${myTier}`];

  return (
    <ListItem key={name} disablePadding sx={{ display: 'flex' }}>
      <ListItemButton
        onClick={(e) => e.preventDefault()}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <SvgComponent width="35px" style={{ minWidth: '35px' }} />

          <ListItemIcon style={{ minWidth: 0 }}>
            <BadgeLogo
              charName={char}
              isSpecial={playerId === name}
              name={name}
            />
          </ListItemIcon>

          <ListItemText
            primary={name}
            primaryTypographyProps={{
              fontFamily: 'Pretendard-Regular',
              fontSize: '1.2em',
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1%' }}>
          {volMuteInfo?.[name] && (
            <VolumeIcon
              color="gray"
              isMute={true}
              size={styledTheme.smallIconSize}
            />
          )}
          {micMuteInfo?.[name] && (
            <MicIcon
              color="gray"
              isMute={true}
              size={styledTheme.smallIconSize}
            />
          )}
        </div>
      </ListItemButton>
    </ListItem>
  );
};

export default GamePlayerItem;
