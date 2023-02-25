import { EditorInfo } from 'pages/editor/editorStyle';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';

const Header = () => {
  const { userName, roomId } = useSelector((state: RootState) => state.editor);

  return (
    <EditorInfo>
      <div style={{ color: 'lightgray' }}>
        <span
          style={{
            color: 'papayawhip',
            filter: 'drop-shadow(0px 4px 4px rgba(255, 255, 255, 0.5)',
          }}
        >
          {roomId}
        </span>
        님의 에디터
        {/* <span style={{ fontSize: '10px', color: 'grey' }}>나: {userName}</span> */}
      </div>
    </EditorInfo>
  );
};

export default Header;
