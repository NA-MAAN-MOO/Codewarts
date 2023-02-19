//@ts-nocheck
/* react */
import { useRef, useEffect, useState } from 'react';
import './YjsCodeMirror.css';

/* lib */
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
import { noctisLilac } from '@uiw/codemirror-theme-noctis-lilac';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { RootState } from 'stores';

/* UI */
import { Button, Radio } from 'antd';
import { DownCircleOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import styledc from 'styled-components';
import 'styles/fonts.css'; /* FONT */

/* solvedAC badge svg */
import RenderSvg from 'components/Svg';

/* 다크/라이트 토글 스위치 테마 */
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff'
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

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

  /* for UI */
  // const { TextArea } = Input;

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

  /* provider의 정보 출력 */
  console.log(provider.awareness.getLocalState());
  // console.log('클라이언트ID ' + provider.awareness.clientID);
  // console.log(provider.awareness.states.values().next().value['name']); // 모든 client의 state
  // console.log(provider.awareness.getStates().get(2127960527).user.name); // get(clientID)
  // provider.awareness.getStates().forEach((key, value) => {
  //   console.log(key, value);
  // });

  useEffect(() => {
    /* editor theme 설정 */
    let basicThemeSet = EditorView.theme({
      '&': {
        // fontFamily: 'Cascadia Code',
        height: '500px',
        // minHeight: '500px',
      },
      '.cm-content, .cm-gutter': { minHeight: '30%' },
      '.cm-content': {
        fontFamily: 'Cascadia Code',
        fontSize: 'large',
      },
      '.cm-gutter': {
        // minHeight: '50%',
        fontFamily: 'Cascadia Code',
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

  /* 유저가 작성한 코드를 컴파일하기 위해 서버로 보냄 */
  const runCode = async () => {
    if (!inputStdin.current) return;
    console.log(inputStdin.current.value);

    try {
      const { data } = await axios.post(`http://localhost:3001/run-code`, {
        codeToRun: ytext.toString(),
        //@ts-ignore
        stdin: inputStdin.current.value,
      });

      console.log(data); // 전체 reponse body (output, statusCode, memory, cpuTime)
      setCompileOutput(data.output.replace(/\n/g, '<br>'));
      setMemory(data.memory);
      setCpuTime(data.cpuTime);
    } catch (error) {
      console.error(error);
      alert('코드 서버로 보내기 실패');
    }
  };

  /* 다크/라이트 모드 테마 토글 */
  function switchTheme(checked: boolean) {
    if (editorThemeMode === okaidia) {
      setEditorTheme(noctisLilac);
    } else {
      setEditorTheme(okaidia);
    }
  }

  /* leetcode 문제 정보 가져오기 */
  const fetchLeetProbInfo = async () => {
    if (leetProbDataRef.current === null) return;

    // 문제 정보 쿼리
    const problemQuery = `
    query ($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
          questionId
          questionFrontendId
          title
          titleSlug
          content
          difficulty
          likes
          dislikes
          exampleTestcases
          topicTags {
              name
              slug
              translatedName
          }
          codeSnippets {
              lang
              langSlug
              code
          }
          stats
          metaData
          enableRunCode
          enableTestMode
          enableDebugger
        }
      }
    `;

    const problemQueryVariable = {
      //@ts-ignore
      titleSlug: leetProbDataRef.current.value,
    };

    try {
      const response = await axios.post(
        'https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql',
        {
          query: problemQuery,
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

    const userInfoQuery = `
    query ($username: String!) {
      matchedUser(username: $username) {
          username
          socialAccounts
          githubUrl
          profile {
              realName
  
              ranking
          }
          submitStats {
              acSubmissionNum {
                  difficulty
                  count
              }
              totalSubmissionNum {
                  difficulty
                  count
                  # submissions
              }
          }
          badges {
              id
              displayName
              icon
              creationDate
          }
      }
      recentSubmissionList(username: $username, limit: 20) {
          title
          titleSlug
          timestamp
          statusDisplay
          lang
      }
    }
    `;

    const userQueryVariable = {
      //@ts-ignore
      username: leetUserName,
    };

    try {
      const response = await axios.post(
        'https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql',
        {
          query: userInfoQuery,
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

  /* 백준, 리트코드 선택 */
  // const [algoSelect, setAlgoSelect] = useState(1);
  // const platformChange = (e: RadioChangeEvent) => {
  //   setAlgoSelect(e.target.value);
  // };

  /* 문제 예제 인풋을 실행 인풋 창으로 복사 */
  // todo: 인덱스를 인수로 받고, 해당하는 예제 복사하기
  const copyToInput = () => {
    if (inputStdin.current === undefined) return;
    inputStdin.current.value = bojProbFullData?.samples?.[1].input;
  };

  const [algoSelect, setAlgoSelect] = useState(0);

  const handleChange = (event, newValue: number) => {
    setAlgoSelect(newValue);
  };

  return (
    <EditorWrapper>
      <EditorInfo>
        <div>
          🧙🏻‍♂️🪄{roomId}님의 IDE{' '}
          <span style={{ fontSize: '10px', color: 'grey' }}>
            내정보: {userName}
          </span>
          {/* <div className="algo-info">
        <div className="algo-user-input">
          <Radio.Group onChange={platformChange} value={algoSelect}>
            <Radio value={1}>LeetCode</Radio>
            <Radio value={2}>백준</Radio>
          </Radio.Group>

          {algoSelect === 1 ? (
            <div className="leet-user-input">
              <input ref={leetUserNameRef} placeholder="leetcode 아이디 입력" />
              <DownCircleOutlined onClick={fetchLeetUserData} />
            </div>
          ) : (
            <div className="boj-user-input">
              <input ref={bojUserNameRef} placeholder="백준 아이디 입력" />
              <DownCircleOutlined onClick={fetchBojUserData} />
            </div>
          )} */}
        </div>
      </EditorInfo>

      <AlgoWrapper>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ bgcolor: '#7f0000' }}>
            <Header>
              <StyledTabs
                value={algoSelect}
                onChange={handleChange}
                aria-label="algo-selector"
              >
                <StyledTab label="Baekjoon" />
                <StyledTab label="LeetCode" />
              </StyledTabs>
              <InputWrapper>
                <div style={{ color: '#ffffff' }}>
                  {algoSelect === 0 ? (
                    <div>
                      <AlgoInput
                        placeholder="백준 아이디"
                        ref={bojUserNameRef}
                      />
                      <DownCircleOutlined
                        onClick={fetchBojUserData}
                        style={{ color: '#ffe600' }}
                      />
                      <AlgoInput placeholder="문제 번호" ref={bojProbDataRef} />
                      <DownCircleOutlined
                        onClick={fetchBojProbInfo}
                        style={{ color: '#ffe600' }}
                      />
                    </div>
                  ) : (
                    <div>
                      <AlgoInput
                        placeholder="LeetCode ID"
                        ref={leetUserNameRef}
                      />
                      <DownCircleOutlined
                        onClick={fetchLeetUserData}
                        style={{ color: '#ffe600' }}
                      />
                      <AlgoInput
                        placeholder="Title slug"
                        ref={leetProbDataRef}
                      />
                      <DownCircleOutlined
                        onClick={fetchLeetProbInfo}
                        style={{ color: '#ffe600' }}
                      />
                    </div>
                  )}
                </div>
              </InputWrapper>
            </Header>

            <ProbInfo>
              <div style={{ color: '#000000' }}>
                내정보 : [Tier]
                {algoSelect === 0
                  ? bojUserData?.items[0].tier
                  : leetUserData?.matchedUser?.profile?.ranking}
                [AC]
                {algoSelect === 0
                  ? bojUserData?.items[0].solvedCount
                  : leetUserData?.matchedUser?.submitStats?.acSubmissionNum?.[0]
                      ?.count}
              </div>
            </ProbInfo>

            <ProbInfo>
              <div style={{ color: '#ffffff' }}>
                🎖{bojProbData?.level}
                {bojProbData?.problemId} {bojProbData?.titleKo}
              </div>

              {/* <div
          className="algo-problem-info"
          style={{ border: '5px solid black' }}
        >
          {algoSelect === 1 ? (
            <div className="leet-prob-info">
              <a
                href={`https://leetcode.com/problems/${leetProbData?.question.titleSlug}`}
                target="_blank"
                rel="noreferrer"
              >
                LeetCode에 답안 제출하러 가기
              </a>
              <div>문제 제목 : {leetProbData?.question.title}</div>
              <div>문제 번호 : {leetProbData?.question.questionId}</div>
              <div>난이도 : {leetProbData?.question.difficulty}</div>
              <h3>문제 내용</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: leetProbData?.question.content,
                }}
              />
              <h3>예제</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: leetProbData?.question.exampleTestcases.replace(
                    /\n/g,
                    '<br>'
                  ),
                }}
              />
              <h3>파이썬 스니펫</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: leetProbData?.question.codeSnippets[3].code.replace(
                    /\n/g,
                    '<br>'
                  ),
                }}
              ></div>
            </div>
          ) : (
            <div className="boj-prob-info">
              <span>
                <a
                  href={`https://acmicpc.net/problem/${bojProbData?.problemId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  백준에 답안 제출하러 가기
                </a>
              </span>

              <span style={{ display: 'flex' }}>
                {bojProbData?.level ? (
                  <RenderSvg svgName={bojProbData.level} />
                ) : null}
                {bojProbData?.titleKo}
              </span>

              <h3>문제 내용</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: bojProbFullData?.prob_desc.replace(/\n/g, '<br>'),
                }}
              />
              <h3>입력</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: bojProbFullData?.prob_input.replace(/\n/g, '<br>'),
                }}
              />
              <h3>출력</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: bojProbFullData?.prob_output.replace(/\n/g, '<br>'),
                }}
              />
              <div className="prob-samples">
                <h3>예제 1</h3>
                <button onClick={copyToInput}>input창으로 복사하기</button>
                <div className="prob-sample-input1">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: bojProbFullData?.prob_desc.replace(/\n/g, '<br>'),
                    }}
                  />
                  <h3>입력</h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: bojProbFullData?.prob_input.replace(
                        /\n/g,
                        '<br>'
                      ),
                    }}
                  />
                  <h3>출력</h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: bojProbFullData?.prob_output.replace(
                        /\n/g,
                        '<br>'
                      ),
                    }}
                  />
                  <a
                    href={`https://acmicpc.net/problem/${bojProbData?.problemId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    백준에 답안 제출하러 가기
                  </a>
                </div>
              ) : (
                <div>
                  🎖{leetProbData?.question.difficulty}{' '}
                  {leetProbData?.question.questionId}{' '}
                  {leetProbData?.question.title}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: leetProbData?.question.content,
                    }}
                  />
                  <h3>예제</h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: leetProbData?.question.exampleTestcases.replace(
                        /\n/g,
                        '<br>'
                      ),
                    }}
                  />
                  <h3>파이썬 스니펫</h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        leetProbData?.question.codeSnippets[3].code.replace(
                          /\n/g,
                          '<br>'
                        ),
                    }}
                  ></div>
                  <a
                    href={`https://leetcode.com/problems/${leetProbData?.question.titleSlug}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    LeetCode에 답안 제출하러 가기
                  </a>
                </div>
              )} */}
            </ProbInfo>

            <Box sx={{ p: 3 }} />
          </Box>
        </Box>
      </AlgoWrapper>

      <FormGroup>
        <FormControlLabel
          control={
            <MaterialUISwitch
              sx={{ m: 1 }}
              defaultChecked
              onClick={(checked) => {
                switchTheme(checked);
              }}
            />
          }
          label=""
        />
      </FormGroup>

      <div className="editor" ref={editor} style={{ minHeight: '50%' }} />

      <div className="compiler">
        {/* <div key={inputStdin.current}>
          <TextArea
            className="stdin"
            rows={5}
            placeholder="Input"
            defaultValue=""
            ref={inputStdin}
          />
        </div> */}
        <div>
          <textarea
            className="stdin"
            rows={5}
            placeholder="Input"
            ref={inputStdin}
          />
        </div>
        <Button onClick={runCode} type="primary">
          코드 실행
        </Button>
        <div className="compiled-result">
          <h3>OUTPUT</h3>
          <div
            style={{ border: '1px solid black' }}
            className="compiled-output"
            dangerouslySetInnerHTML={{
              __html: compileOutput,
            }}
          ></div>
          <div className="compiled-cputime">CPU TIME : {cpuTime}</div>
          <div className="compiled-memory">MEMORY : {memory}</div>
        </div>
      </div>
    </EditorWrapper>
  );
}

export default YjsCodeMirror;

const EditorWrapper = styledc.div`
  width: 95%;
  margin: 0 auto;
  // text-align: center;
  font-family: 'Cascadia Code', sans-serif;
`;

const EditorInfo = styledc.div`
font-size: 40px; 
font-weight: 600; 
margin-top: 3%;
`;

const AlgoWrapper = styledc.div`
margin-top: 20px;
width: 85%;
`;

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 80,
    width: '100%',
    backgroundColor: '#ffe600',
  },
});

interface StyledTabProps {
  label: string;
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(20),
  marginRight: theme.spacing(1),
  color: 'rgba(255, 255, 255, 0.7)',
  '&.Mui-selected': {
    color: '#fff',
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}));

const Header = styledc.div`
  display: flex;
  justify-content: space-between;
`;

const AlgoInput = styledc.input`
  font-size: 18px;
  padding: 10px;
  margin: 10px;
  background: papayawhip;
  border: none;
  border-radius: 3px;
`;
const InputWrapper = styledc.div`
  margin-top: 10px;
`;

const ProbInfo = styledc.div`
margin-left: 20px;
margin-top: 20px;
  color: 'rgba(255, 255, 255, 0.7)';
  font-size: 20px;
  background-color: 'white';
  width: 300px;
`;

const ProfileInfo = styledc.div`
  margin-left: 20px;
  martgin-top: 10px;
  font-size: 20px;
`;
