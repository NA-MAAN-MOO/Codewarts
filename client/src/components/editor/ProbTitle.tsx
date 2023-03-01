import { ProbSummary } from '../../pages/editor/editorStyle';
import RenderSvg from 'components/Svg';

//@ts-ignore
function ProbTitle(props) {
  const { bojProblemId, bojProbFullData } = props;

  return (
    <>
      {bojProbFullData?.solvedAC?.titleKo ? (
        <ProbSummary>
          <div>
            <RenderSvg
              svgName={
                bojProbFullData?.solvedAC?.level >= 0
                  ? bojProbFullData.solvedAC.level
                  : 0
              }
            />
            <span>
              {bojProblemId}번 {bojProbFullData?.solvedAC?.titleKo}
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
