import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface AlgoFilterOptions {
  source?: string;
  'solvedAC.level'?: string;
}

const algoFilterOptions: AlgoFilterOptions[] = [
  { 'solvedAC.level': '브론즈' },
  { 'solvedAC.level': '실버' },
  { 'solvedAC.level': '골드' },
  { 'solvedAC.level': '플래티넘' },
  { 'solvedAC.level': '다이아몬드' },
  { 'solvedAC.level': '루비' },
  { 'solvedAC.level': '난이도 없음' },
  { source: '한국정보올림피아드' },
];

export default function LimitTags(props: any) {
  const { setFilter } = props;

  return (
    <Autocomplete
      multiple
      limitTags={2}
      id="multiple-limit-tags"
      options={algoFilterOptions}
      getOptionLabel={(option: AlgoFilterOptions) =>
        Object.values(option)[0] || ''
      }
      renderInput={(params) => (
        <TextField {...params} placeholder="검색 필터 추가" />
      )}
      sx={{ width: '500px', fontFamily: 'Cascadia Code, Pretendard-Regular' }}
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
