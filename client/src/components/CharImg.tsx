import characters from 'assets/characters';

const CharImg = ({ charName }: { charName: string }) => {
  const charUrl = characters[charName];
  return <img src={charUrl} />;
};

export default CharImg;
