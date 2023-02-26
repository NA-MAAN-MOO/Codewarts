//@ts-nocheck
/* react & lib */
import { useRef, useEffect, useState } from 'react';
import { RootState } from 'stores';
import { useSelector } from 'react-redux';

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
import { userColor } from './userTagColors';

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
import { YjsProp } from 'types';

function YjsCodeMirror(props: YjsProp) {
  /* ref */
  const editor = useRef(null);
  const inputStdin = useRef(null);
  const leetUserNameRef = useRef(null);
  const leetProbDataRef = useRef(null);
  const bojUserNameRef = useRef(null);
  const bojProbDataRef = useRef(null);
  let mySocket = getPhaserSocket();

  /* states */
  const { userName, editorName } = useSelector(
    (state: RootState) => state.editor
  );
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
  const [undoManager, setUndoManager] = useState();
  const [ytext, setYtext] = useState();

  const { handleProvider, provider } = props;
  /* roomName 스트링 값 수정하지 말 것(※ 수정할 거면 전부 수정해야 함) */
  const roomName = `ROOMNAME${editorName}`;

  const [ydoc, setYdoc] = useState();

  useEffect(() => {
    setYdoc(new Y.Doc());
  }, []);

  useEffect(() => {
    if (!ydoc) return;
    handleProvider(
      new WebsocketProvider(
        `ws://localhost:1234/`, // serverUrl
        roomName,
        ydoc
        // { params: { auth: editorName } } // Specify a query-string that will be url-encoded and attached to the `serverUrl`
      )
    );
    console.log('provider 생성 시점');
  }, [ydoc]);

  useEffect(() => {
    if (!provider) return;
    console.log(provider);
    provider.on('status', (event: any) => {
      console.log(event.status); // logs "connected" or "disconnected"
    });
    setYtext(ydoc.getText('codemirror'));
  }, [provider]);
  // Websocket Provider setting

  useEffect(() => {
    if (!ytext) return;
    // const undoManager = new Y.UndoManager(ytext);
    setUndoManager(new Y.UndoManager(ytext));
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
  }, [ytext]);

  useEffect(() => {
    // handleProvider(provider);
    /* editor theme 설정 */
    if (!provider || !undoManager) return;
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
  }, [editorThemeMode, provider, undoManager]);

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
