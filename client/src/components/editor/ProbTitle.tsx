import { ProbTitleDiv, tooltipStyle } from '../../pages/editor/editorStyle';
import RenderSvg from 'components/Svg';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

//@ts-ignore
function ProbTitle(props) {
  const { bojProblemId, bojProbFullData } = props;

  return (
    <>
      {bojProbFullData?.solvedAC?.titleKo ? (
        <ProbTitleDiv>
          <RenderSvg
            svgName={
              bojProbFullData?.solvedAC?.level >= 0
                ? bojProbFullData.solvedAC.level
                : 0
            }
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              wordBreak: 'keep-all',
              flexWrap: 'wrap',
              minHeight: '100%',
            }}
          >
            {bojProblemId}번 {bojProbFullData?.solvedAC?.titleKo}
          </div>
          <Tooltip title="제출하러 가기" arrow slotProps={tooltipStyle}>
            <Button
              variant="text"
              href={
                bojProblemId
                  ? `https://acmicpc.net/submit/${bojProblemId}`
                  : `https://acmicpc.net`
              }
              target="_blank"
              rel="noreferrer"
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              <OpenInNewIcon />
            </Button>
          </Tooltip>
        </ProbTitleDiv>
      ) : // <span></span>
      null}
    </>
  );
}

export default ProbTitle;
