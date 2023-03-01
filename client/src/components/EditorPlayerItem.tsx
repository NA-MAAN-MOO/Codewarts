import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BadgeLogo from 'components/BadgeLogo';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'stores';
import VolumeIcon from 'components/VolumeIcon';
import MicIcon from 'components/MicIcon';
import { GameVoiceType } from 'types';
import VoiceItem from 'components/VoiceItem';
import styled from 'styled-components';
import svgs from 'assets/solvedac_badges/index';

const EditorPlayerItem = (
  props: GameVoiceType & { name: string; char: string }
) => {
  const { name, char, ...rest } = props;
  const { volMuteInfo, micMuteInfo, playerId, editorName } = useSelector(
    (state: RootState) => ({ ...state.chat, ...state.user, ...state.editor })
  );
  const rankInfos = useSelector((state: RootState) => state.rank.infos);

  const myTier = rankInfos?.find((d) => d.nickname === name)?.tier || '';
  const SvgComponent = myTier ? svgs[`Svg${myTier}`] : svgs.Svg0;

  return (
    <ListItem key={name} disablePadding sx={{ display: 'flex', gap: '10px' }}>
      <StyledItem>
        <ListItemIcon>
          <BadgeLogo
            charName={char}
            isSpecial={playerId === name}
            name={name}
          />
        </ListItemIcon>
        <SvgComponent width="15px" />
        <ListItemText
          primary={name}
          primaryTypographyProps={{
            fontFamily: 'Firenze',
          }}
        />
        <VoiceItem
          isSuperior={playerId === editorName}
          isMe={name === playerId}
          {...props}
        />
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
