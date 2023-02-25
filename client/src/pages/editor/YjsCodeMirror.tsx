//@ts-nocheck
/* react */
import { useRef, useEffect, useState } from 'react';
import { RootState } from 'stores';
import * as random from 'lib0/random';
import { useSelector } from 'react-redux';
import axios from 'axios';

/* yjs */
import * as Y from 'yjs';
// @ts-ignore
import { yCollab } from 'y-codemirror.next';
import { WebsocketProvider } from 'y-websocket';
import * as awarenessProtocol from 'y-protocols/awareness.js';

/* codemirror */
import { basicSetup } from 'codemirror';
import { python } from '@codemirror/lang-python';
import { EditorState } from '@codemirror/state';
import { keymap, EditorView } from '@codemirror/view';
import {
  defaultKeymap,
  indentWithTab,
  standardKeymap,
} from '@codemirror/commands';
import { okaidia } from '@uiw/codemirror-theme-okaidia';

/* GraphQL queries */
import PROBLEMQUERY from '../../graphql/problemQuery';
import USERINFOQUERY from '../../graphql/userInfoQuery';

/* UI */
import './YjsCodeMirror.css';
import 'animate.css';
import {
  HeaderTab,
  AlgoInput,
  AlgoInputWrap,
  AlgoTextField,
  ProbSummary,
  ProfileInfo,
  Item,
  MiddleWrapper,
  EditorWrapper,
  AlgoInfoWrap,
  StyledTab,
  StyledTabs,
  AccordionSummary,
  Accordion,
  theme,
} from './editorStyle';
import 'styles/fonts.css'; /* FONT */
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import AccordionDetails from '@mui/material/AccordionDetails';
import InputIcon from '@mui/icons-material/Input';
import Chip from '@mui/material/Chip';

/* toast */
import { ToastContainer } from './toast';

/* components */
import RenderSvg from 'components/Svg';
import EditorThemeSwitch from 'components/editor/EditorThemeSwitch';
import RunButton from 'components/editor/RunButton';
import SubmitButton from 'components/editor/SubmitButton';
import EvaluateButton from 'components/editor/EvaluateButton';
import CompilerField from 'components/editor/CompilerField';

function YjsCodeMirror() {
  /* ref */
  const editor = useRef(null);
  const inputStdin = useRef();
  const leetUserNameRef = useRef(null);
  const leetProbDataRef = useRef(null);
  const bojUserNameRef = useRef(null);
  const bojProbDataRef = useRef(null);

  /* states */
  const { userName, roomId } = useSelector((state: RootState) => state.editor);
  let [compileOutput, setCompileOutput] = useState();
  let [cpuTime, setCpuTime] = useState();
  let [memory, setMemory] = useState();
  let [editorThemeMode, setEditorTheme] = useState(okaidia);
  let [leetUserData, setLeetUserData] = useState();
  let [leetProbData, setLeetProbData] = useState();
  let [bojUserData, setBojUserData] = useState();
  let [bojProbData, setBojProbData] = useState();
  let [bojProbFullData, setBojProbFullData] = useState();
  let [markingPercent, setMarkingPercent] = useState(0);
  const [algoSelect, setAlgoSelect] = useState(0); // 백준(0), 리트코드(1)

  /* roomName 스트링 값 수정하지 말 것(※ 수정할 거면 전부 수정해야 함) */
  const roomName = `ROOMNAME${roomId}`;

  const usercolors = [
    { color: '#30bced', light: '#30bced33' },
    { color: '#6eeb83', light: '#6eeb8333' },
    { color: '#ffbc42', light: '#ffbc4233' },
    { color: '#ecd444', light: '#ecd44433' },
    { color: '#ee6352', light: '#ee635233' },
    { color: '#9ac2c9', light: '#9ac2c933' },
    { color: '#8acb88', light: '#8acb8833' },
    { color: '#1be7ff', light: '#1be7ff33' },
  ];

  // select a random color for this user
  const userColor = usercolors[random.uint32() % usercolors.length];
  const ydoc = new Y.Doc();

  // Websocket Provider setting
  const provider = new WebsocketProvider(
    `ws://localhost:1234/`, // serverUrl
    roomName,
    ydoc
    // { params: { auth: roomId } } // Specify a query-string that will be url-encoded and attached to the `serverUrl`
  );

  provider.on('status', (event: any) => {
    console.log(event.status); // logs "connected" or "disconnected"
  });
  const ytext = ydoc.getText('codemirror');

  const undoManager = new Y.UndoManager(ytext);

  /* provider의 awareness setting */
  provider.awareness.setLocalStateField('user', {
    name: userName, // 커서에 표시되는 이름
    color: userColor.color, // should be a hex color
    colorLight: userColor.light,
    roomName: roomName,
    clientID: provider.awareness.clientID, // A unique identifier that identifies this client.
  });

  /* websocket provider의 정보 출력 */
  console.log(provider.awareness.getLocalState());

  useEffect(() => {
    /* editor theme 설정 */
    let basicThemeSet = EditorView.theme({
      '&': {
        height: '400px',
        // minHeight: '500px',
        borderRadius: '.5em', // '.cm-gutters'와 같이 조절할 것
      },
      '.cm-editor': {},
      '.cm-content, .cm-gutter': { minHeight: '30%' },
      '.cm-content': {
        fontFamily: 'Cascadia Code, Pretendard-Regular',
        fontSize: 'large',
      },
      '.cm-gutter': {
        // minHeight: '50%',
        fontFamily: 'Cascadia Code',
      },
      '.cm-gutters': {
        borderRadius: '.5em',
      },
    });

    /* editor instance 생성; state, view 생성 */
    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        python(),
        yCollab(ytext, provider.awareness, { undoManager }),
        keymap.of([indentWithTab]),
        keymap.of(standardKeymap),
        keymap.of(defaultKeymap),
        editorThemeMode,
        basicThemeSet,
      ],
    });

    if (!editor.current) return;

    const view = new EditorView({
      state: state,
      parent: editor.current || undefined,
    });

    /* view 중복 생성 방지 */
    return () => view?.destroy();
  }, [editorThemeMode]);

  const selectChange = (event, newValue: number) => {
    setAlgoSelect(newValue);
  };

  /* leetcode 문제 정보 가져오기 */
  const fetchLeetProbInfo = async () => {
    if (leetProbDataRef.current === null) return;

    const problemQueryVariable = {
      //@ts-ignore
      titleSlug: leetProbDataRef.current.value,
    };

    try {
      const response = await axios.post(
        'https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql',
        {
          query: PROBLEMQUERY,
          variables: problemQueryVariable,
        }
      );

      let probData = response.data;
      console.log(probData.data);
      setLeetProbData(probData.data);
    } catch (error) {
      console.error(error);
    }
  };

  /* 백준 문제 정보 가져오기 */
  const fetchBojProbInfo = async () => {
    if (bojProbDataRef.current === null) return;

    let probId = bojProbDataRef.current.value;
    console.log(probId);

    try {
      const response = await axios.get(
        `https://solved.ac/api/v3/problem/show?problemId=${probId}`
      );

      let probData = response.data;
      console.log(probData);
      setBojProbData(probData);
      fetchBojProbFullData(probId);
    } catch (error) {
      console.error(error);
    }
  };

  /* 서버로 몽고DB에 저장된 백준 문제 정보 요청 */
  async function fetchBojProbFullData(probId: string) {
    if (bojProbDataRef.current === null) return;

    try {
      const response = await axios.get(
        `http://localhost:3001/bojdata?probId=${probId}`
      );

      let probFullData = response.data[0];
      console.log(probFullData);
      setBojProbFullData(probFullData);
    } catch (error) {
      console.error(error);
    }
  }

  /* leetcode 유저 정보 가져오기 */
  const fetchLeetUserData = async () => {
    if (leetUserNameRef.current === null) return;

    //@ts-ignore
    let leetUserName = leetUserNameRef.current.value;
    console.log(leetUserName);

    const userQueryVariable = {
      //@ts-ignore
      username: leetUserName,
    };

    try {
      const response = await axios.post(
        'https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql',
        {
          query: USERINFOQUERY,
          variables: userQueryVariable,
        }
      );

      let userData = response.data;
      console.log(userData.data);
      setLeetUserData(userData.data);
    } catch (error) {
      console.error(error);
    }
  };

  /* 백준 유저 정보 가져오기 */
  const fetchBojUserData = async () => {
    if (bojUserNameRef.current === null) return;

    //@ts-ignore
    let bojUserName = bojUserNameRef.current.value;
    console.log(bojUserName);

    try {
      const response = await axios.get(
        `https://solved.ac/api/v3/search/user?query=${bojUserName}`
      );

      let userData = response.data;
      console.log(userData);
      setBojUserData(userData);
    } catch (error) {
      console.error(error);
    }
  };

  /* 문제 예제 인풋을 실행 인풋 창으로 복사 */
  const copyToInput = (key) => {
    if (inputStdin.current === undefined) return;
    inputStdin.current.value = bojProbFullData?.samples?.[key].input;
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (algoSelect === 0) {
        fetchBojProbInfo();
      } else {
        fetchLeetProbInfo();
      }
    }
  };

  return (
    <EditorWrapper>
      <ToastContainer />

      <AlgoInfoWrap>
        <Box
          sx={{
            bgcolor: '#272822',
            display: 'flex',
            // border: '1px solid orange',
            borderRadius: 1.4,
            boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          <HeaderTab>
            <StyledTabs
              value={algoSelect}
              onChange={selectChange}
              aria-label="algo-selector"
            >
              <StyledTab label="Baekjoon" />
              <StyledTab label="LeetCode" />
            </StyledTabs>

            {algoSelect === 0 && bojProbData?.level ? (
              <ProbSummary>
                <div>
                  <RenderSvg svgName={bojProbData.level} />
                  <span>
                    {bojProbData?.problemId}번 {bojProbData?.titleKo}
                  </span>
                </div>
              </ProbSummary>
            ) : leetProbData?.question.questionId ? (
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
            ) : null}

            <AlgoInputWrap>
              <div>
                <AlgoTextField
                  id="reddit-input"
                  label={
                    algoSelect === 0 ? '백준 문제 번호' : 'leetcode-title-slug'
                  }
                  variant="filled"
                  size="small"
                  inputRef={algoSelect === 0 ? bojProbDataRef : leetProbDataRef}
                  autoFocus={true}
                  type="text"
                  onKeyDown={handleKeyDown}
                />
              </div>
            </AlgoInputWrap>
          </HeaderTab>
        </Box>
      </AlgoInfoWrap>

      {bojProbData?.problemId || leetProbData?.question.titleSlug ? (
        <>
          <Accordion>
            <AccordionSummary
              // expandIcon={<ExpandMoreIcon />}
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
                                <InputIcon onClick={() => copyToInput(key)} />
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

      <MiddleWrapper>
        <ThemeProvider theme={theme}>
          <RunButton
            ytext={ytext}
            setCompileOutput={setCompileOutput}
            setMemory={setMemory}
            setCpuTime={setCpuTime}
            inputStdin={inputStdin.current}
          />
          <SubmitButton
            algoSelect={algoSelect}
            bojProbData={bojProbData}
            leetProbData={leetProbData}
          />
          <EvaluateButton
            ytext={ytext}
            bojProbData={bojProbData}
            markingPercent={markingPercent}
            setMarkingPercent={setMarkingPercent}
          />
          <span style={{ color: 'white' }}>채점진행 : {markingPercent}%</span>
          <EditorThemeSwitch
            editorThemeMode={editorThemeMode}
            setEditorTheme={setEditorTheme}
          />
        </ThemeProvider>
      </MiddleWrapper>

      <div
        className="codemirror-editor"
        ref={editor}
        style={{
          minHeight: '50%',
          // boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
          filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)',
          // marginTop: '10px',
          marginBottom: '10px',
        }}
      />

      <Divider />

      <Box
        sx={{
          flexGrow: 1,
          marginTop: '10px',
          filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
        }}
      >
        <CompilerField
          inputStdin={inputStdin}
          cpuTime={cpuTime}
          memory={memory}
          compileOutput={compileOutput}
        />
      </Box>
    </EditorWrapper>
  );
}

export default YjsCodeMirror;
