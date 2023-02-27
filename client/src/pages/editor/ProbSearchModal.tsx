import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import LimitTags from './autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  textAlign: 'center',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

/* 서버로 몽고DB에 저장된 백준 문제 정보 요청 */
async function fetchFilteredData(filter: any) {
  if (filter === null) return;

  try {
    const response = await axios.post(`http://localhost:3001/probdata`, {
      data: filter,
    });

    let filteredData = response.data;
    console.log(filteredData);
  } catch (error) {
    console.error(error);
  }
}

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filterRef = useRef(null);
  const [filter, setFilter] = useState('');

  return (
    <div>
      <Button onClick={handleOpen} color="error">
        문제검색
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            검색하기
          </Typography>
          <SearchIcon
            fontSize="medium"
            onClick={() => {
              console.log(filter);
              fetchFilteredData(filter); // 필터를 만족하는 DB 자료들 fetch
            }}
          />
          <LimitTags
            filterRef={filterRef}
            filter={filter}
            setFilter={setFilter}
          />
          <div>문제리스트</div>
          <Pagination count={10} />
        </Box>
      </Modal>
    </div>
  );
}
