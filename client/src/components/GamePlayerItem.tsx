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

const GamePlayerItem = ({ name, char }: { name: string; char: string }) => {
  const { volMuteInfo, micMuteInfo, playerId } = useSelector(
    (state: RootState) => ({ ...state.chat, ...state.user })
  );
  const rankInfos = useSelector((state: RootState) => state.rank.infos);

  const myTier = rankInfos?.find((d) => d.nickname === name)?.tier || '';
  const SvgComponent = myTier ? svgs[`Svg${myTier}`] : svgs.Svg0;

  return (
    <ListItem key={name} disablePadding sx={{ display: 'flex', gap: '10px' }}>
      <ListItemButton onClick={(e) => e.preventDefault()} sx={{ gap: '5px' }}>
        <ListItemIcon>
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
        <SvgComponent width="35px" />
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
      </ListItemButton>
    </ListItem>
  );
};

export default GamePlayerItem;
