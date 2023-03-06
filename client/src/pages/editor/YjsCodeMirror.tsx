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

/* codemirror */
import { basicSetup } from 'codemirror';
import { python } from '@codemirror/lang-python';
import { indentUnit, foldGutter } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { keymap, EditorView, placeholder } from '@codemirror/view';
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
  buttonTheme,
  Main,
  DrawerHeader,
  leftDrawerCSS,
  AlgoInputWrap,
  editorThemeCSS,
} from './editorStyle';
import 'styles/fonts.css'; /* FONT */
import { ThemeProvider, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

/* toast */
import { ToastContainer } from '../../components/editor/toast';

/* components */
import EditorThemeSwitch from 'components/editor/EditorThemeSwitch';
import RunButton from 'components/editor/RunButton';
import EvaluateButton from 'components/editor/EvaluateButton';
import CompilerField from 'components/editor/CompilerField';
import AlgoHeaderTab from 'components/editor/AlgoHeaderTab';
import AlgoInfoAccordion from 'components/editor/AlgoInfoAccordion';
import EvaluateGauge from 'components/editor/EvaluateGauge';
import ProbTitle from 'components/editor/ProbTitle';
import SearchModal from '../../components/editor/ProbSearchModal';

/* network */
import { getPhaserSocket } from 'network/phaserSocket';
import { YjsProp } from 'types';

import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const APPLICATION_YJS_URL =
  process.env.REACT_APP_YJS_URL || 'ws://localhost:1234/';

function YjsCodeMirror(props: YjsProp) {
  /* ref */
  const editor = useRef(null);
  const inputStdin = useRef(null);
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
  let [bojProblemId, setBojProblemId] = useState();
  let [bojProbFullData, setBojProbFullData] = useState();
  let [markingPercent, setMarkingPercent] = useState(null);
  const [algoSelect, setAlgoSelect] = useState(0); // 백준(0), 리트코드(1)
  const [undoManager, setUndoManager] = useState();
  const [ytext, setYtext] = useState();
  const theme = useTheme();

  const { handleProvider, provider, leftOpen, handleLeftDrawerClose } = props;

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
        `${APPLICATION_YJS_URL}`, // serverUrl
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
    let basicThemeSet = EditorView.theme(editorThemeCSS);

    const editorPlaceHolder = `def solution():`;

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
        indentUnit.of('\t'),
        foldGutter(),
        placeholder(editorPlaceHolder),
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
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Drawer
          sx={leftDrawerCSS}
          variant="persistent"
          anchor="left"
          open={leftOpen}
        >
          <DrawerHeader>
            <AlgoInputWrap>
              <AlgoHeaderTab
                bojProbDataRef={bojProbDataRef}
                setBojProbFullData={setBojProbFullData}
                setBojProblemId={setBojProblemId}
              />
              <SearchModal
                setBojProbFullData={setBojProbFullData}
                setBojProblemId={setBojProblemId}
                setAlgoSelect={setAlgoSelect}
              />
            </AlgoInputWrap>

            <IconButton onClick={handleLeftDrawerClose}>
              {theme.direction === 'ltr' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <AlgoInfoWrap>
            <Box
              sx={{
                bgcolor: '#272822',
                display: 'block',
                borderRadius: 1.4,
                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            >
              <ProbTitle
                bojProblemId={bojProblemId}
                bojProbFullData={bojProbFullData}
              />
              <AlgoInfoAccordion
                inputStdin={inputStdin}
                bojProbFullData={bojProbFullData}
                bojProblemId={bojProblemId}
              />
            </Box>
          </AlgoInfoWrap>
        </Drawer>
        <Main open={leftOpen}>
          <MiddleWrapper>
            <ThemeProvider theme={buttonTheme}>
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
              {/* <SubmitButton bojProblemId={bojProblemId} /> */}
              <EvaluateButton
                ytext={ytext}
                bojProblemId={bojProblemId}
                markingPercent={markingPercent}
                setMarkingPercent={setMarkingPercent}
                mySocket={mySocket}
                bojProbFullData={bojProbFullData}
              />
              <EvaluateGauge
                value={markingPercent}
                min={0}
                max={100}
                label={markingPercent === null ? '' : `${markingPercent}점`}
              />
            </ThemeProvider>
          </MiddleWrapper>
          <div
            className="codemirror-editor"
            ref={editor}
            style={{
              filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)',
              marginBottom: '10px',
              // height: '50%',
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
        </Main>
      </Box>
    </EditorWrapper>
  );
}
export default YjsCodeMirror;
