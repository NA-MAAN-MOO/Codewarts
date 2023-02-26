import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect } from 'react';

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

  //   const sortInfoByTier = () => {
  //     let newArray = [...bojInfos];
  //     newArray.sort((a, b) => b.tier - a.tier);
  //     setbojInfos(newArray);
  //   };

  //   const sortInfoByStreak = () => {
  //     let newArray = [...bojInfos];
  //     newArray.sort((a, b) => b.maxStreak - a.maxStreak);
  //     setbojInfos(newArray);
  //   };

  //   const sortInfoBySolved = () => {
  //     let newArray = [...bojInfos];
  //     newArray.sort((a, b) => b.solved - a.solved);
  //     setbojInfos(newArray);
  //   };

  //   useEffect(() => {
  //     tabValue === 0
  //       ? sortInfoByTier()
  //       : tabValue === 1
  //       ? sortInfoByStreak()
  //       : sortInfoBySolved();
  //   }, []);

  //   useEffect(() => sortbojInfos(), []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: '40%' }} aria-label="simple table">
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
