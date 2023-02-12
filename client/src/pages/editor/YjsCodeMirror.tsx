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
import { DownCircleOutlined } from '@ant-design/icons';

function YjsCodeMirror() {
  /* states */
  const { userName, roomId } = useSelector((state: RootState) => state.editor);
  let [compileOutput, setCompileOutput] = useState('');
  let [cpuTime, setCpuTime] = useState('');
  let [memory, setMemory] = useState('');
  let [editorTheme, setEditorTheme] = useState(okaidia);
  let [leetUserData, setLeetUserData] = useState();
  let [leetProbData, setLeetProbData] = useState();

  /* ref */
  const editor = useRef(null);
  const inputStdin = useRef(null);
  const leetUserNameRef = useRef(null);
  const leetProbDataRef = useRef(null);

  /* for UI */
  const { TextArea } = Input;

  /* LeetCode user info */

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

  /* 문제 정보 가져오기 */
  const fetchProbInfo = async () => {
    if (leetProbDataRef.current === null) return;

    /* 문제 정보 query */
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

  /* leetcode 유저 정보 가져오기 */
  const fetchUserData = async () => {
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

  return (
    <>
      <div className="algo-info">
        <div id="algo-user-input">
          <input
            ref={leetUserNameRef}
            placeholder="leetcode나 백준 아이디 입력하세요"
          />
          <DownCircleOutlined onClick={fetchUserData} />
        </div>

        <div className="algo-user-info">
          <div>깃헙 주소 :{leetUserData?.matchedUser.githubUrl}</div>
          <div>ranking : {leetUserData?.matchedUser.profile.ranking}</div>
          <div>
            총 맞춘 문제수 :
            {leetUserData?.matchedUser.submitStats.acSubmissionNum[0].count}
          </div>
        </div>

        <div className="algo-problem-input">
          <input
            ref={leetProbDataRef}
            placeholder="leetcode title slug 입력!"
          />
          <DownCircleOutlined onClick={fetchProbInfo} />
        </div>

        <div id="algo-problem-info" style={{ border: '5px solid black' }}>
          <div>
            답안 제출하러 가기 : https://leetcode.com/problems/
            {leetProbDataRef.current.value}/
          </div>
          <div>문제 title : {leetProbData?.question.title}</div>
          <div>문제 번호 : {leetProbData?.question.questionId}</div>
          <div>문제 정보 : {leetProbData?.question.content}</div>
          <div>예제 : {leetProbData?.question.exampleTestcases}</div>
          <div>difficulty : {leetProbData?.question.difficulty}</div>
          <div>
            code snippets : {leetProbData?.question.codeSnippets[3].code}
          </div>
        </div>
      </div>

      <div className="room-user-info">
        <div>유저 이름 : {userName}</div>
        <div>룸 ID : {roomId}</div>
        <div>이 방에 있는 유저리스트 : </div>
      </div>

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
        <Button onClick={runCode} type="primary">
          코드 실행
        </Button>
        <TextArea id="stdin" rows={5} placeholder="Input" ref={inputStdin} />
        <div className="compiled-result">
          <div id="compiled-output">OUTPUT : {compileOutput}</div>
          <div id="compiled-cputime">CPU TIME : {cpuTime}</div>
          <div id="compiled-memory">MEMORY : {memory}</div>
        </div>
      </div>
    </>
  );
}

export default YjsCodeMirror;
