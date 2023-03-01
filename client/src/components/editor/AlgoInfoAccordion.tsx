import Grid from '@mui/material/Unstable_Grid2';
import {
  Item,
  AccordionSummary,
  Accordion,
} from '../../../src/pages/editor/editorStyle';
import AccordionDetails from '@mui/material/AccordionDetails';
import Tooltip from '@mui/material/Tooltip';
import InputIcon from '@mui/icons-material/Input';

//@ts-ignore
function AlgoInfoAccordion(props) {
  const {
    inputStdin,
    bojProbData,
    leetProbData,
    algoSelect,
    bojProbFullData,
    bojProblemId,
    setBojProblemId,
  } = props;

  /* 문제 예제 인풋을 실행 인풋 창으로 복사 */
  const copyToInput = (key: number) => {
    if (inputStdin.current === undefined) return;
    inputStdin.current.value = bojProbFullData?.samples?.[key].input;
  };

  return (
    <>
      {bojProblemId || leetProbData?.question.titleSlug ? (
        <>
          <Accordion>
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              문제 정보
            </AccordionSummary>
            <AccordionDetails>
              <div
                dangerouslySetInnerHTML={
                  algoSelect === 0 && bojProbFullData?.prob_desc
                    ? {
                        __html: bojProbFullData?.prob_desc.replace(
                          /\n/g,
                          '<br>'
                        ),
                      }
                    : {
                        __html: leetProbData?.question.content,
                      }
                }
              />
            </AccordionDetails>
          </Accordion>

          {algoSelect === 0 && bojProbFullData?.prob_input ? (
            <Accordion>
              <AccordionSummary
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                입력 & 출력
              </AccordionSummary>
              <AccordionDetails>
                입력
                <div
                  dangerouslySetInnerHTML={{
                    __html: bojProbFullData?.prob_input.replace(/\n/g, '<br>'),
                  }}
                />
                <br />
                출력
                <div
                  dangerouslySetInnerHTML={{
                    __html: bojProbFullData?.prob_output.replace(/\n/g, '<br>'),
                  }}
                />
              </AccordionDetails>
            </Accordion>
          ) : (
            <Accordion>
              <AccordionSummary
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                코드 스니펫
              </AccordionSummary>
              <AccordionDetails>
                <div
                  dangerouslySetInnerHTML={{
                    __html: leetProbData?.question.codeSnippets[3].code.replace(
                      /\n/g,
                      '<br>'
                    ),
                  }}
                ></div>
              </AccordionDetails>
            </Accordion>
          )}

          {leetProbData?.question.exampleTestcases ||
          bojProbFullData?.samples ? (
            <Accordion>
              <AccordionSummary
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                예제
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {algoSelect === 1 &&
                  leetProbData?.question.exampleTestcases ? (
                    <Grid xs>
                      <Item
                        sx={{
                          color: 'papayawhip',
                          fontFamily: 'Cascadia Code, Pretendard-Regular',
                          textAlign: 'left',
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              leetProbData?.question.exampleTestcases.replace(
                                /\n/g,
                                '<br>'
                              ),
                          }}
                        />
                      </Item>
                    </Grid>
                  ) : bojProbFullData?.samples ? (
                    Object.entries(bojProbFullData?.samples).map(
                      ([key, value]) => {
                        return (
                          <Grid xs key={key}>
                            <Item
                              sx={{
                                color: 'papayawhip',
                                fontFamily: 'Cascadia Code, Pretendard-Regular',
                                textAlign: 'left',
                              }}
                            >
                              <span className="samples-title">
                                예제{key} INPUT
                              </span>
                              <Tooltip title="INPUT 칸으로 복사하기" arrow>
                                <InputIcon
                                  //@ts-ignore
                                  onClick={() => copyToInput(key)}
                                />
                              </Tooltip>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: bojProbFullData?.samples?.[
                                    key
                                  ].input.replace(/\n/g, '<br>'),
                                }}
                              />
                              <span className="samples-title">
                                예제{key} OUTPUT
                              </span>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: bojProbFullData?.samples?.[
                                    key
                                  ].output.replace(/\n/g, '<br>'),
                                }}
                              />
                            </Item>
                          </Grid>
                        );
                      }
                    )
                  ) : null}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ) : null}
        </>
      ) : null}
    </>
  );
}

export default AlgoInfoAccordion;
