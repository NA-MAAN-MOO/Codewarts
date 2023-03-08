import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';
import RankingTableContent from './RankingTableContent';
import './RankingTable.css';

const colNames = [
  '순위',
  '닉네임',
  // '백준아이디',
  '티어',
  '최장스트릭',
  '맞힌문제',
];

interface InfoType {
  nickname: string;
  // bojId: string;
  tier: number;
  maxStreak: number;
  solved: number;
}

export default function RankingTable(props: any) {
  const { bojInfos } = props;
  const myNickname = useSelector((state: RootState) => state.user.playerId);

  return (
    <TableContainer
      component={Paper}
      sx={{ height: '76vh' }}
      className="table-container"
    >
      <Table
        sx={{ minWidth: '40%', height: 'max-content' }}
        aria-label="sticky table"
        stickyHeader
      >
        <TableHead>
          <TableRow sx={{ background: 'darkred' }}>
            {colNames.map((colName: string) => (
              <TableCell
                key={colName}
                align="center"
                variant="head"
                sx={{
                  background: 'darkred',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '1.2vw',
                  fontFamily: 'Pretendard-Regular',
                }}
              >
                {colName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {bojInfos.map((info: InfoType, index: number) => (
            <RankingTableContent
              index={index}
              info={info}
              key={info.nickname}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
