import Grid from '@mui/material/Unstable_Grid2';
import { AlgoTextField, Item } from '../../../src/pages/editor/editorStyle';

//@ts-ignore
function CompilerField(props) {
  const { inputStdin, cpuTime, memory, compileOutput } = props;

  const timeMemoryFieldStyle = { p: 0 };

  return (
    <Grid container spacing={1.5}>
      <Grid xs>
        <Item>
          <AlgoTextField
            id="standard-multiline-static"
            label="INPUT"
            multiline
            fullWidth
            rows={6}
            variant="standard"
            inputRef={inputStdin}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              disableUnderline: false,
            }}
          />
        </Item>
      </Grid>

      <Grid xs>
        <Item>
          <Grid container spacing={1.5}>
            <Grid xs sx={timeMemoryFieldStyle}>
              <AlgoTextField
                id="standard-read-only-input"
                variant="standard"
                label="TIME"
                size="small"
                fullWidth
                InputProps={{
                  readOnly: true,
                  disableUnderline: true,
                }}
                InputLabelProps={{ shrink: true }}
                value={cpuTime}
              />
            </Grid>

            <Grid xs sx={timeMemoryFieldStyle}>
              <AlgoTextField
                id="standard-read-only-input"
                variant="standard"
                label="MEMORY"
                size="small"
                fullWidth
                InputProps={{
                  readOnly: true,
                  disableUnderline: true,
                }}
                InputLabelProps={{ shrink: true }}
                value={memory}
              />
            </Grid>
          </Grid>
          <AlgoTextField
            id="standard-multiline-static"
            label="OUTPUT"
            multiline
            fullWidth
            rows={4}
            variant="standard"
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
            value={compileOutput ? compileOutput : null}
          />
        </Item>
      </Grid>
    </Grid>
  );
}

export default CompilerField;
