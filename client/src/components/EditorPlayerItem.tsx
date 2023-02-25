import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CharRoundLogo from 'components/CharRoundLogo';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'stores';
import VolumeIcon from 'components/VolumeIcon';
import MicIcon from 'components/MicIcon';
import { GameVoiceType } from 'types';
import VoiceItem from 'components/VoiceItem';
import styled from 'styled-components';

const EditorPlayerItem = (
  props: GameVoiceType & { name: string; char: string }
) => {
  const { name, char, ...rest } = props;
  const { volMuteInfo, micMuteInfo, playerId, roomId } = useSelector(
    (state: RootState) => ({ ...state.chat, ...state.user, ...state.editor })
  );
  const dispatch = useDispatch();

  return (
    <ListItem key={name} disablePadding sx={{ display: 'flex', gap: '10px' }}>
      <StyledItem>
        <ListItemIcon>
          <CharRoundLogo charName={char} isSpecial={playerId === name} />
        </ListItemIcon>
        <ListItemText
          primary={name}
          primaryTypographyProps={{
            fontFamily: 'Firenze',
          }}
        />
        <VoiceItem
          isSuperior={playerId === roomId}
          isMe={name === playerId}
          {...props}
        />
        {/* {volMuteInfo?.[name] && (
          <VolumeIcon color="gray" isMute={true} size="23px" />
        )}
        {micMuteInfo?.[name] && (
          <MicIcon color="gray" isMute={true} size="23px" />
        )} */}
      </StyledItem>
    </ListItem>
  );
};

export default EditorPlayerItem;

const StyledItem = styled.div`
  padding: 10px;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
