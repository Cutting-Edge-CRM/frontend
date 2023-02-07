import React from 'react';
import ReactQuill from 'react-quill';
import './quill.snow.css';

export default function RichText(props: any) {

    const handleChange = (value: any) => {
      props.onChange({
        target: {
          value: value,
          id: props.id
        }
      });
    }

    return (
        <ReactQuill theme="snow" modules={{clipboard: {matchVisual: false}}} value={props.value} onChange={handleChange} />
    );
  }