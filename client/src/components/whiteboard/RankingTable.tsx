import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
  index: number,
  nickname: string,
  bojId: string,
  tier: string,
  maxStreak: number,
  solved: number
) {
  return { index, nickname, bojId, tier, maxStreak, solved };
}

// const rows = [
//   createData(1, 'kristi8041', 'kristi8041', 'Gold3', 4, 1),
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];
const colNames = [
  '순위',
  '닉네임',
  '백준아이디',
  '티어',
  '최장스트릭',
  '맞힌문제',
];

export default function RankingTable(props: any) {
  const { bojInfos } = props;
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {colNames.map((colName: string) => (
              <TableCell align="center">{colName}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {bojInfos.map((info: any, index: number) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" align="center">
                {index + 1}
              </TableCell>
              <TableCell align="center">{info.nickname}</TableCell>
              <TableCell align="center">{info.bojId}</TableCell>
              <TableCell align="center">{info.tier}</TableCell>
              <TableCell align="center">{info.maxStreak}</TableCell>
              <TableCell align="center">{info.solved}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
