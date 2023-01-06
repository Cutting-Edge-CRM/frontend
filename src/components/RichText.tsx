import { AttachFile, FormatAlignCenter, FormatAlignLeft, FormatAlignRight, FormatBold, FormatIndentDecrease, FormatIndentIncrease, FormatItalic, FormatUnderlined, Superscript } from '@mui/icons-material';
import { Divider, IconButton, Select, Stack } from '@mui/material';
import React from 'react';
import {Editor, EditorState} from 'draft-js';
  
export default function RichText(props: any) {
    const [editorState, setEditorState] = React.useState(
        EditorState.createEmpty()
      );
     
      const editor = React.useRef(null);
     
      function focusEditor() {
        // editor.current.focus();
      }
     
      React.useEffect(() => {
        focusEditor()
      }, []);

    return (
        <><Stack direction="row">
        <IconButton>
            <FormatBold />
        </IconButton>
        <IconButton>
            <FormatItalic />
        </IconButton>
        <IconButton>
            <FormatUnderlined />
        </IconButton>
        <Divider orientation="vertical" flexItem />
        <Select></Select>
        <Divider orientation="vertical" flexItem />
        <IconButton>
            <Superscript />
        </IconButton>
        <Divider orientation="vertical" flexItem />
        <IconButton>
            <FormatIndentDecrease />
        </IconButton>
        <IconButton>
            <FormatIndentIncrease />
        </IconButton>
        <Divider orientation="vertical" flexItem />
        <IconButton>
            <FormatAlignLeft />
        </IconButton>
        <IconButton>
            <FormatAlignCenter />
        </IconButton>
        <IconButton>
            <FormatAlignRight />
        </IconButton>
        <Divider orientation="vertical" flexItem />
        <IconButton>
            <AttachFile />
        </IconButton>
        </Stack>
        <Editor
                ref={editor}
                editorState={editorState}
                onChange={editorState => setEditorState(editorState)} /></>
    );
  }