import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { middleButtonStyle } from 'pages/editor/editorStyle';

//@ts-ignore
function SubmitButton(props) {
  const { bojProblemId } = props;

  return (
    <>
      <Tooltip title="제출하러 가기" arrow>
        <Button
          color="primary"
          variant="outlined"
          href={
            bojProblemId
              ? `https://acmicpc.net/submit/${bojProblemId}`
              : `https://acmicpc.net`
          }
          target="_blank"
          rel="noreferrer"
          style={middleButtonStyle}
        >
          SUBMIT
        </Button>
      </Tooltip>
    </>
  );
}

export default SubmitButton;
