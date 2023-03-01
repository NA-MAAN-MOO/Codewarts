import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import LimitTags from './autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import RenderSvg from 'components/Svg';
import { styledTheme } from 'styles/theme';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  textAlign: 'center',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: '#161616',
  border: '2px solid #33313B',
  boxShadow: 24,
  p: 4,
  borderRadius: '30px',
  // display: 'flex',
};

export default function SearchModal(props: any) {
  const { setBojProbFullData, setBojProblemId, setAlgoSelect } = props;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [filter, setFilter] = useState('');
  const [pagedProbData, setPagedProbData] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  let page = 1;

  /* 서버로 몽고DB에 저장된 백준 문제 정보 요청 */
  async function fetchFilteredData(filter: any, page: number) {
    if (filter === null || filter === '') return;
    console.log(page, '페이지 자료 가져와줘');

    try {
      const response = await axios.post(`http://localhost:3001/probdata`, {
        data: filter,
        page: page,
      });

      console.log(response.data.message);
      setPagedProbData(response.data.payload.pagedDocs);
      setTotalPages(response.data.payload.totalPages);
      console.log(pagedProbData);
    } catch (error) {
      console.error(error);
    }
  }

  const handlePageChange = (pageNumber: number) => {
    page = pageNumber;
    fetchFilteredData(filter, page);
  };

  useEffect(() => {
    return setBojProbFullData(null);
  }, []);

  return (
    <div>
      <Button
        onClick={handleOpen}
        color="secondary"
        variant="contained"
        sx={{
          wordBreak: 'keep-all',
          wrap: 'no-wrap',
          padding: 0.5,
          margin: '5px',
          width: 100,
          fontFamily: 'Cascadia Code, Pretendard-Regular',
          fontWeight: 'bold',
        }}
      >
        필터 검색
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ display: 'flex' }}>
            <LimitTags setFilter={setFilter} />
            <ListItemButton
              key="search-probs"
              sx={{
                padding: 0,
                minHeight: 32,
                color: 'rgba(255,255,255,.8)',
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'inherit',
                  // border: '1px solid green',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SearchIcon
                  fontSize="large"
                  onClick={() => {
                    console.log(filter);
                    fetchFilteredData(filter, 1); // 필터를 만족하는 DB 자료들 fetch
                  }}
                />
              </ListItemIcon>
            </ListItemButton>
          </div>
          <div style={{ padding: '10px 0px 10px 0px' }}>
            {Object.entries(pagedProbData).map(([key, value]) => (
              <ListItemButton
                //@ts-ignore
                key={value?.probId}
                sx={{
                  py: 0,
                  minHeight: 32,
                  color: 'rgba(255,255,255,.8)',
                }}
                onClick={() => {
                  //@ts-ignore
                  // console.log(pagedProbData[key], value?.probId);
                  //@ts-ignore
                  setBojProblemId(value?.probId);
                  //@ts-ignore
                  setBojProbFullData(pagedProbData[key]);
                  setAlgoSelect(0);
                  // todo; 여기서 algoSelect 값을 0 혹은 1로 세팅도 해줄 것!
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  {
                    //@ts-ignore
                    value.solvedAC.level >= 0 ? (
                      //@ts-ignore
                      <RenderSvg svgName={value?.solvedAC?.level} />
                    ) : (
                      '🏆'
                    )
                  }
                </ListItemIcon>
                <ListItemText
                  //@ts-ignore
                  primary={`${value?.probId}번 ${value?.solvedAC?.titleKo}`}
                  primaryTypographyProps={{
                    fontSize: 18,
                    fontWeight: 'medium',
                  }}
                />
              </ListItemButton>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {pagedProbData ? (
              <Pagination
                count={totalPages}
                onChange={(event, page) => handlePageChange(page)}
              />
            ) : (
              <div></div>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
}
