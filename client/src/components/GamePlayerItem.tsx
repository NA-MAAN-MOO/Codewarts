import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CharRoundLogo from 'components/CharRoundLogo';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';
import VolumeIcon from 'components/VolumeIcon';
import MicIcon from 'components/MicIcon';
import { ReactComponent as MicOff } from 'assets/icons/mic_off.svg';
import { ReactComponent as VolOff } from 'assets/icons/volume_off.svg';

const GamePlayerItem = ({ name, char }: { name: string; char: string }) => {
  const { volMuteInfo, micMuteInfo } = useSelector(
    (state: RootState) => state.chat
  );
  return (
    <ListItem key={name} disablePadding sx={{ display: 'flex', gap: '10px' }}>
      <ListItemButton onClick={(e) => e.preventDefault()}>
        <ListItemIcon>
          <CharRoundLogo charName={char} />
        </ListItemIcon>
        <ListItemText
          primary={name}
          primaryTypographyProps={{
            fontFamily: 'Firenze',
          }}
        />
        {volMuteInfo?.[name] && <VolumeIcon color="gray" isMute={true} />}
        {micMuteInfo?.[name] && <MicIcon color="gray" isMute={true} />}
      </ListItemButton>
    </ListItem>
  );
};

export default GamePlayerItem;
