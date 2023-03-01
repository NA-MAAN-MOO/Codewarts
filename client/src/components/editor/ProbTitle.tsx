import { ProbSummary } from '../../pages/editor/editorStyle';
import RenderSvg from 'components/Svg';
import Chip from '@mui/material/Chip';

//@ts-ignore
function ProbTitle(props) {
  const {
    algoSelect,
    bojProbData,
    leetProbData,
    bojProblemId,
    bojProbFullData,
  } = props;

  return (
    <>
      {algoSelect === 0 &&
      (bojProbData?.titleKo || bojProbFullData?.solvedAC?.titleKo) ? (
        <ProbSummary>
          <RenderSvg
            svgName={
              bojProbFullData.solvedAC.level >= 0
                ? bojProbFullData.solvedAC.level
                : bojProbData.level
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
            {bojProblemId}번{' '}
            {bojProbFullData?.solvedAC?.titleKo
              ? bojProbFullData?.solvedAC?.titleKo
              : bojProbData?.titleKo}
          </div>
        </ProbSummary>
      ) : leetProbData?.question.title ? (
        <ProbSummary>
          <div>
            <span>
              <Chip
                label={leetProbData?.question.difficulty}
                color={
                  leetProbData?.question.difficulty === 'Easy'
                    ? 'success'
                    : leetProbData?.question.difficulty === 'Medium'
                    ? 'warning'
                    : 'error'
                }
              />{' '}
              {leetProbData?.question.questionId}번{' '}
              {leetProbData?.question.title}
            </span>
          </div>
        </ProbSummary>
      ) : (
        <span></span>
      )}
    </>
  );
}

export default ProbTitle;
