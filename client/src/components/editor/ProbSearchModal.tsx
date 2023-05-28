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
import {
  buttonTheme,
  filterButtonStyle,
  tooltipStyle,
} from 'pages/editor/editorStyle';
import { ThemeProvider } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

const APPLICATION_EDITOR_URL =
  process.env.REACT_APP_EDITOR_URL || 'http://localhost:3001';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  textAlign: 'center',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: '#272822',
  // border: '2px solid #33313B',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
  color: '#272822',
};

export default function SearchModal(props: any) {
  const { setBojProbFullData, setBojProblemId } = props;
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
      const response = await axios.post(`${APPLICATION_EDITOR_URL}/probdata`, {
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

  const handlePageChange = async (pageNumber: number) => {
    page = pageNumber;
    await fetchFilteredData(filter, page);
  };

  // useEffect(() => {
  //   return setBojProbFullData(null);
  // }, []);

  return (
    <div>
      <ThemeProvider theme={buttonTheme}>
        <Tooltip title="필터로 검색하기" arrow slotProps={tooltipStyle}>
          <Button
            onClick={handleOpen}
            color="primary"
            variant="outlined"
            sx={filterButtonStyle}
          >
            FILTER🔍
          </Button>
        </Tooltip>
      </ThemeProvider>

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
                  py: 0.5,
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
                  // setAlgoSelect(0); // 추후에 리트코드 추가할 수도 있어서 남겨둔 변수
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
                    fontSize: 20,
                    fontWeight: 'medium',
                    fontFamily: 'Cascadia Code, Pretendard-Regular',
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
