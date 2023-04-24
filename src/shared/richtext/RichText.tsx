import React from 'react';
import ReactQuill from 'react-quill';
import './quill.snow.css';

export default function RichText(props: any) {

  var toolbarOptions = [
    [{ 'header': [] }],
    [{ 'size': [] }],                                     // custom dropdown
    [{ 'font': [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],       // toggled buttons
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'super' }],                           // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']                                         // remove formatting button
  ];

    const handleChange = (value: any) => {
      props.onChange({
        target: {
          value: value,
          id: props.id
        }
      });
    }
    
    return (
      <ReactQuill readOnly={props.disabled} theme="snow" modules={{clipboard: {matchVisual: false}, toolbar: toolbarOptions}} value={props.value} onChange={handleChange} />
    );
  }