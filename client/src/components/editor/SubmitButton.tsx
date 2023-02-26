import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

//@ts-ignore
function SubmitButton(props) {
  const { algoSelect, bojProbData, leetProbData } = props;

  return (
    <>
      <Tooltip title="제출하러 가기" arrow>
        <Button
          color="primary"
          href={
            algoSelect === 0 && bojProbData?.problemId
              ? `https://acmicpc.net/problem/${bojProbData?.problemId}`
              : `https://leetcode.com/problems/${leetProbData?.question.titleSlug}`
          }
          target="_blank"
          rel="noreferrer"
          style={{
            fontFamily: 'Cascadia Code, Pretendard-Regular',
            fontSize: '17px',
          }}
        >
          SUBMIT
        </Button>
      </Tooltip>
    </>
  );
}

export default SubmitButton;
