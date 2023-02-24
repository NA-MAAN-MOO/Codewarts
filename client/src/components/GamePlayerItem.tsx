import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CharRoundLogo from 'components/CharRoundLogo';

const GamePlayerItem = ({ name, char }: { name: string; char: string }) => {
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
      </ListItemButton>
    </ListItem>
  );
};

export default GamePlayerItem;
