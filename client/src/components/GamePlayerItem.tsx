import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CharRoundLogo from 'components/CharRoundLogo';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';
import VolumeIcon from 'components/VolumeIcon';
import MicIcon from 'components/MicIcon';
import { styledTheme } from 'styles/theme';

const GamePlayerItem = ({ name, char }: { name: string; char: string }) => {
  const { volMuteInfo, micMuteInfo, playerId } = useSelector(
    (state: RootState) => ({ ...state.chat, ...state.user })
  );

  return (
    <ListItem key={name} disablePadding sx={{ display: 'flex', gap: '10px' }}>
      <ListItemButton onClick={(e) => e.preventDefault()} sx={{ gap: '5px' }}>
        <ListItemIcon>
          <CharRoundLogo charName={char} isSpecial={playerId === name} />
        </ListItemIcon>
        <ListItemText
          primary={name}
          primaryTypographyProps={{
            fontFamily: 'Firenze',
          }}
        />
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
