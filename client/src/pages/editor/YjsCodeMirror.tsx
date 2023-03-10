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
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ResizeSensor from 'resize-sensor';

/* toast */
import { ToastContainer } from '../../components/editor/toast';

/* components */
import EditorThemeSwitch from 'components/editor/EditorThemeSwitch';
import RunButton from 'components/editor/RunButton';
import EvaluateButton from 'components/editor/EvaluateButton';
import CompilerField from 'components/editor/CompilerField';
import AlgoHeaderTab from 'components/editor/AlgoHeaderTab';
import AlgoInfoAccordion from 'components/editor/AlgoInfoAccordion';
import ProbTitle from 'components/editor/ProbTitle';
import SearchModal from '../../components/editor/ProbSearchModal';

/* network */
import { getPhaserSocket } from 'network/phaserSocket';
import { YjsProp } from 'types';

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
  // const [algoSelect, setAlgoSelect] = useState(0); // 백준(0), 리트코드(1)
  const [undoManager, setUndoManager] = useState();
  const [ytext, setYtext] = useState();
  const theme = useTheme();
  let [drawWidth, setDrawWidth] = useState(0);
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
    // console.log('provider 생성 시점');
  }, [ydoc]);

  useEffect(() => {
    if (!provider || !ydoc) return;
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

    const editorPlaceHolder = `def hello():\n\tprint("hello world")`;

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
        EditorView.lineWrapping,
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
  useEffect(() => {
    const mainDiv = document.getElementsByClassName('mainDiv')[0];

    // mainDiv.addEventListener('resize', console.log(mainDiv.clientWidth));
    new ResizeSensor(mainDiv, function () {
      // console.log('Changed to ' + mainDiv.clientWidth);
      // console.log(drawWidth);
      setDrawWidth(mainDiv.clientWidth * 0.4);
      // console.log(drawWidth);
    });
  });

  return (
    <EditorWrapper>
      <ToastContainer />
      <Box sx={{ display: 'flex' }} className="mainDiv">
        <CssBaseline />
        <Drawer
          sx={{
            width: drawWidth,
            flexShrink: 0,
            // border: '1px solid green',
            '& .MuiDrawer-paper': {
              width: drawWidth,
              boxSizing: 'border-box',
            },
          }}
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
                // setAlgoSelect={setAlgoSelect}
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
              <EvaluateButton
                ytext={ytext}
                bojProblemId={bojProblemId}
                mySocket={mySocket}
                bojProbFullData={bojProbFullData}
                setCompileOutput={setCompileOutput}
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
