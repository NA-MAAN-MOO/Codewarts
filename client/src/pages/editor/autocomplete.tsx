import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function LimitTags(props: any) {
  const { setFilter } = props;

  return (
    <Autocomplete
      multiple
      limitTags={2}
      id="multiple-limit-tags"
      options={algoFilter}
      getOptionLabel={(option) => option.tag}
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
      onChange={(event, value) => {
        setFilter(value);
      }}
    />
  );
}

const algoFilter = [
  { tag: '백준' },
  { tag: '리트코드' },
  { tag: '브론즈' },
  { tag: '실버' },
  { tag: '골드' },
  { tag: '플래티넘' },
  { tag: '다이아몬드' },
  { tag: '루비' },
  { tag: '난이도 없음' },
  { tag: 'easy' },
  { tag: 'medium' },
  { tag: 'difficult' },
  { tag: '채점가능' },
  { tag: '한국정보올림피아드' },
];
