import { ProbSummary } from '../../pages/editor/editorStyle';
import RenderSvg from 'components/Svg';

//@ts-ignore
function ProbTitle(props) {
  const { bojProblemId, bojProbFullData } = props;

  return (
    <>
      {bojProbFullData?.solvedAC?.titleKo ? (
        <ProbSummary>
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
        </ProbSummary>
      ) : (
        <span></span>
      )}
    </>
  );
}

export default ProbTitle;
