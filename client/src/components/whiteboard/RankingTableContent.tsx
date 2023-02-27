import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import RenderTier from './RenderTier';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';

export default function RankingTableContent(props: any) {
  const { index, info } = props;
  const myNickname = useSelector((state: RootState) => state.user.playerId);
  const bgColor = '#ffe8e8';
  const fontColor = '#ba3232';
  const fontWeight = 700;

  return (
    <TableRow
      key={index}
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
        background: myNickname === info.nickname ? bgColor : 'none',
        fontWeight: myNickname === info.nickname ? fontWeight : 'normal',
      }}
    >
      <TableCell
        component="th"
        scope="row"
        align="center"
        sx={{
          color: myNickname === info.nickname ? fontColor : 'black',
          fontWeight: myNickname === info.nickname ? fontWeight : 'normal',
        }}
      >
        {index + 1}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          color: myNickname === info.nickname ? fontColor : 'black',
          fontWeight: myNickname === info.nickname ? fontWeight : 'normal',
        }}
      >
        {info.nickname}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          color: myNickname === info.nickname ? fontColor : 'black',
          fontWeight: myNickname === info.nickname ? fontWeight : 'normal',
        }}
      >
        {info.bojId}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          color: myNickname === info.nickname ? fontColor : 'black',
          fontWeight: myNickname === info.nickname ? fontWeight : 'normal',
        }}
      >
        <RenderTier svgName={info.tier} />
      </TableCell>
      <TableCell
        align="center"
        sx={{
          color: myNickname === info.nickname ? fontColor : 'black',
          fontWeight: myNickname === info.nickname ? fontWeight : 'normal',
        }}
      >
        {info.maxStreak}일
      </TableCell>
      <TableCell
        align="center"
        sx={{
          color: myNickname === info.nickname ? fontColor : 'black',
          fontWeight: myNickname === info.nickname ? fontWeight : 'normal',
        }}
      >
        {info.solved}개
      </TableCell>
    </TableRow>
  );
}
