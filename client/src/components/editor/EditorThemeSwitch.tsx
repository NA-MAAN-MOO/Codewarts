import FormControlLabel from '@mui/material/FormControlLabel';
import { MaterialUISwitch } from '../../../src/pages/editor/editorStyle';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { solarizedLight } from '@uiw/codemirror-theme-solarized';

//@ts-ignore
function EditorThemeSwitch(props) {
  const { editorThemeMode, setEditorTheme } = props;

  /* 다크/라이트 모드 테마 토글 */
  function switchTheme(checked: boolean) {
    if (editorThemeMode === okaidia) {
      setEditorTheme(solarizedLight);
    } else {
      setEditorTheme(okaidia);
    }
  }

  return (
    <>
      <FormControlLabel
        control={
          <MaterialUISwitch
            sx={{ ml: 3 }}
            defaultChecked
            onClick={(checked) => {
              //@ts-ignore
              switchTheme(checked);
            }}
          />
        }
        label=""
      />
    </>
  );
}

export default EditorThemeSwitch;
