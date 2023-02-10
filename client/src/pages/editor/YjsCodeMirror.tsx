/* react */
import { useRef, useEffect, useState } from 'react';

/* lib */
import * as random from 'lib0/random';
import { useSelector, useDispatch } from 'react-redux';

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
import { RootState } from 'stores';

function YjsCodeMirror() {
  /* local state 디스트럭쳐링 */
  const { userName, roomId } = useSelector((state: RootState) => state.editor);
  let [content, setContent] = useState('');

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
  console.log(provider.awareness.states); // 모든 client의 state
  // console.log(provider.awareness.getStates().get(2127960527).user.name); // get(clientID)
  // provider.awareness.getStates().forEach((key, value) => {
  //   console.log(key, value);
  // });

  const editor = useRef(null);

  useEffect(() => {
    /* editor theme 설정 */
    let myTheme = EditorView.theme({
      // '.cm-gutter': { minHeight: '50%' },
      // '&': {
      // fontFamily: 'Cascadia Code',
      // height: '50%',
      // },
      '.cm-content': {
        caretColor: '#0e9',
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
        myTheme,
        noctisLilac,
      ],
    });

    if (!editor.current) return;

    const view = new EditorView({
      state: state,
      parent: editor.current || undefined,
    });

    /* view 중복 생성 방지 */
    return () => view?.destroy();
  }, []);

  function runCode() {
    console.log(ytext.toString());
  }

  // todo: 컴파일러에 useRef 넣어주기
  return (
    <>
      <div>유저 이름 : {userName}</div>
      <div>룸 ID : {roomId}</div>
      <div>이 방에 있는 유저리스트 : </div>

      <div id="editor" ref={editor} style={{ minHeight: '50%' }} />
      <div id="compiler" style={{ border: '1px solid black' }}>
        <div>
          <button onClick={runCode}>코드 실행</button>
          <div>
            <div id="result"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default YjsCodeMirror;
