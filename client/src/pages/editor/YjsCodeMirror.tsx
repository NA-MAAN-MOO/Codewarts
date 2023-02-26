//@ts-nocheck
/* react & lib */
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
import USERINFOQUERY from '../../graphql/userInfoQuery';

/* UI */
import './YjsCodeMirror.css';
import 'animate.css';
import {
  MiddleWrapper,
  EditorWrapper,
  AlgoInfoWrap,
  theme,
} from './editorStyle';
import 'styles/fonts.css'; /* FONT */
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

/* toast */
import { ToastContainer } from '../../components/editor/toast';

/* components */
import EditorThemeSwitch from 'components/editor/EditorThemeSwitch';
import RunButton from 'components/editor/RunButton';
import SubmitButton from 'components/editor/SubmitButton';
import EvaluateButton from 'components/editor/EvaluateButton';
import CompilerField from 'components/editor/CompilerField';
import AlgoHeaderTab from 'components/editor/AlgoHeaderTab';
import AlgoInfoAccordion from 'components/editor/AlgoInfoAccordion';
import EvaluateGauge from 'components/editor/EvaluateGauge';

/* network */
import { getPhaserSocket } from 'network/phaserSocket';

function YjsCodeMirror() {
  /* ref */
  const editor = useRef(null);
  const inputStdin = useRef(null);
  const leetUserNameRef = useRef(null);
  const leetProbDataRef = useRef(null);
  const bojUserNameRef = useRef(null);
  const bojProbDataRef = useRef(null);
  let mySocket = getPhaserSocket();

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
  // console.log(provider.awareness.getLocalState());
  // console.log(provider.awareness.getStates());

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
    return () => {
      view?.destroy();
    };
  }, [editorThemeMode]);

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

  return (
    <EditorWrapper>
      <ToastContainer />

      <AlgoInfoWrap>
        <Box
          sx={{
            bgcolor: '#272822',
            display: 'flex',
            borderRadius: 1.4,
            boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          <AlgoHeaderTab
            algoSelect={algoSelect}
            setAlgoSelect={setAlgoSelect}
            bojProbData={bojProbData}
            setBojProbData={setBojProbData}
            leetProbData={leetProbData}
            setLeetProbData={setLeetProbData}
            bojProbDataRef={bojProbDataRef}
            leetProbDataRef={leetProbDataRef}
            setBojProbFullData={setBojProbFullData}
          />
        </Box>
      </AlgoInfoWrap>

      <AlgoInfoAccordion
        inputStdin={inputStdin}
        bojProbData={bojProbData}
        leetProbData={leetProbData}
        algoSelect={algoSelect}
        bojProbFullData={bojProbFullData}
      />

      <MiddleWrapper>
        <ThemeProvider theme={theme}>
          <EditorThemeSwitch
            editorThemeMode={editorThemeMode}
            setEditorTheme={setEditorTheme}
          />
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
            mySocket={mySocket}
          />
          <EvaluateGauge
            value={markingPercent}
            min={0}
            max={100}
            label={`정답 게이지: ${markingPercent}%`}
          />
        </ThemeProvider>
      </MiddleWrapper>

      <div
        className="codemirror-editor"
        ref={editor}
        style={{
          minHeight: '50%',
          filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)',
          marginBottom: '10px',
        }}
      />

      <Divider />

      <Box
        sx={{
          flexGrow: 1,
          marginTop: '10px',
          marginBottom: '20px',
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
