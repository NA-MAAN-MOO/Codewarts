import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function LimitTags(props: any) {
  const { filterRef, filter, setFilter } = props;

  return (
    <Autocomplete
      multiple
      limitTags={2}
      id="multiple-limit-tags"
      options={algoFilter}
      getOptionLabel={(option) => option.filter}
      //   defaultValue={[algoFilter[0], algoFilter[2]]}
      renderInput={(params) => (
        <TextField
          {...params}
          label="문제 검색하기"
          placeholder="검색 필터 추가"
        />
      )}
      sx={{ width: '500px' }}
      autoSelect={true}
      filterSelectedOptions={true}
      loadingText="Loading..."
      noOptionsText="no options"
      //   value={filter}
      //   ref={filterRef}
      onChange={(event, value) => {
        setFilter(value);
      }}
    />
  );
}

const algoFilter = [
  { filter: '백준' },
  { filter: '리트코드' },
  { filter: '브론즈' },
  { filter: '실버' },
  { filter: '골드' },
  { filter: '플래티넘' },
  { filter: '다이아몬드' },
  { filter: '난이도 없음' },
  { filter: 'easy' },
  { filter: 'medium' },
  { filter: 'difficult' },
  { filter: '채점가능' },
  { filter: '한국정보올림피아드' },
];
