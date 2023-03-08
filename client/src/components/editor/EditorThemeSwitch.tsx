import FormControlLabel from '@mui/material/FormControlLabel';
import {
  MaterialUISwitch,
  tooltipStyle,
} from '../../../src/pages/editor/editorStyle';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { solarizedLight } from '@uiw/codemirror-theme-solarized';
import Tooltip from '@mui/material/Tooltip';

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
      <Tooltip
        title={
          editorThemeMode === okaidia
            ? '라이트 모드로 바꾸기'
            : '다크 모드로 바꾸기'
        }
        arrow
        slotProps={tooltipStyle}
      >
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
      </Tooltip>
    </>
  );
}

export default EditorThemeSwitch;
