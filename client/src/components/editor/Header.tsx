import { EditorInfo } from 'pages/editor/editorStyle';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';

const Header = () => {
  const { userName, editorName } = useSelector(
    (state: RootState) => state.editor
  );

  return (
    <EditorInfo>
      <div style={{ color: 'lightgray' }}>
        <span
          style={{
            color: 'papayawhip',
          }}
        >
          {editorName}
        </span>
        님의 에디터
      </div>
    </EditorInfo>
  );
};

export default Header;
