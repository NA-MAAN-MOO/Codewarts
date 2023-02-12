/* react */
import { useRef, useEffect, useState } from 'react';
//dkjasklfjlskjdf?
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
import { Switch, Space, Button, Input } from 'antd';

function YjsCodeMirror() {
  /* local state 디스트럭쳐링 */
  const { userName, roomId } = useSelector((state: RootState) => state.editor);
  let [compileOutput, setCompileOutput] = useState('');
  let [cpuTime, setCpuTime] = useState('');
  let [memory, setMemory] = useState('');
  let [editorTheme, setEditorTheme] = useState(okaidia);
  const { TextArea } = Input;

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
    `ws://localhost:3000/`, // serverUrl
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
  // console.log(provider.awareness.getLocalState());
  // console.log('클라이언트ID ' + provider.awareness.clientID);
  // console.log(provider.awareness.states.values().next().value['name']); // 모든 client의 state
  // console.log(provider.awareness.getStates().get(2127960527).user.name); // get(clientID)
  // provider.awareness.getStates().forEach((key, value) => {
  //   console.log(key, value);
  // });

  const editor = useRef(null);
  const inputStdin = useRef(null);

  useEffect(() => {
    /* editor theme 설정 */
    let basicTheme = EditorView.theme({
      // '.cm-gutter': { minHeight: '50%' },
      // '&': {
      // fontFamily: 'Cascadia Code',
      // height: '50%',
      // },
      '.cm-content': {
        fontFamily: 'Cascadia Code',
        fontSize: 'large',
      },
      '.cm-gutter': {
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
        basicTheme,
        editorTheme,
      ],
    });

    if (!editor.current) return;

    const view = new EditorView({
      state: state,
      parent: editor.current || undefined,
    });

    /* view 중복 생성 방지 */
    return () => view?.destroy();
  }, [editorTheme]);
  /* 유저가 작성한 코드를 컴파일하기 위해 서버로 보냄 */
  const runCode = async () => {
    if (!inputStdin.current) return;
    try {
      const { data } = await axios.post(`http://localhost:3001/run-code`, {
        codeToRun: ytext.toString(),
        //@ts-ignore
        stdin: inputStdin.current.value,
      });
      console.log(data); // 전체 reponse body (output, statusCode, memory, cpuTime)
      setCompileOutput(data.output);
      setMemory(data.memory);
      setCpuTime(data.cpuTime);
    } catch (error) {
      console.error(error);
      alert('코드 서버로 보내기 실패');
    }
  };
  /* 다크/라이트 모드 테마 토글 */
  function switchTheme(checked: boolean) {
    if (editorTheme === okaidia) {
      setEditorTheme(noctisLilac);
    } else {
      setEditorTheme(okaidia);
    }
  }
  // todo: 컴파일러에 useRef 넣어주기
  return (
    <>
      <div>유저 이름 : {userName}</div>
      <div>룸 ID : {roomId}</div>
      <div>이 방에 있는 유저리스트 : </div>
      <Space direction="vertical">
        <Switch
          checkedChildren="Dark"
          unCheckedChildren="Lavender"
          defaultChecked
          onChange={(checked) => {
            switchTheme(checked);
          }}
        />
      </Space>
      <div id="editor" ref={editor} style={{ minHeight: '50%' }} />
      <div id="compiler">
        <div>
          <Button onClick={runCode} type="primary">
            코드 실행
          </Button>
          <div>
            <TextArea
              id="stdin"
              rows={5}
              placeholder="Input"
              ref={inputStdin}
            />
            {/* <div id="compiled-result"></div> */}
            <div id="compiled-output">OUTPUT : {compileOutput}</div>
            <div id="compiled-cputime">CPU TIME : {cpuTime}</div>
            <div id="compiled-memory">MEMORY : {memory}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default YjsCodeMirror;
