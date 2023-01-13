import { AddAPhotoOutlined, Close } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, ImageList, ImageListItem, Stack, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { saveImages } from '../../api/images.api';
import { createNote, updateNote } from '../../api/note.api';

export default function EditNote(props: any) {
  const [fileURLs, setFileURLs] = useState([] as {url: string, file: File}[]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  const handleCancel = () => {
      props.onClose();
    };

  const handleSave = () => {
      if (props.type === 'edit') {
        updateNote(props.note)
        .then(res => {
          setSavingNote(true);
          saveImages(fileURLs, 'note', props.note.id)
          .then(res => {
            setSavingNote(false);
            props.onClose();
            console.log(res);
          }, err => {
            setSavingNote(false);
            console.log("error" + err.message);
          })
        }, err => {
          setSavingNote(false);
          console.log("error" + err.message);
        })
      }
      if (props.type === 'new') {
        createNote(props.note)
        .then(res => {
          setSavingNote(true);
          saveImages(fileURLs, 'note', res.id)
          .then(res => {
            setSavingNote(false);
            props.onClose();
            console.log(res);
          }, err => {
            setSavingNote(false);
            console.log("error" + err.message);
          })
        }, err => {
          setSavingNote(false);
            console.log("error" + err.message);
        })
      } 
    };

  const handleChange = (event: any) => {
      props.setNote({ ...props.note, [event.target.id]: event.target.value});
    };

  const onDrop = useCallback((acceptedFiles: File[]) => {

    const readAsDataURL = (files: File[]) => {
      setLoadingFiles(true);
      Promise.all(files.map(fileToDataURL))
      .then((fileArray) => {
        setLoadingFiles(false);
        setFileURLs(fileURLs.concat(fileArray as {url: string, file: File}[]))
      })
    }
      readAsDataURL(acceptedFiles)
    }, [fileURLs, setFileURLs])

  let {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
      accept: {
        'image/jpeg': ['.jpeg', '.jpg'],
        'image/png' : ['.png'],
        'image/tiff' : ['.tif', '.tiff'],
        'image/svg+xml' : ['.svg'],
        'image/webp': ['.webp']
      },
      maxFiles:12,
      onDrop})

  const handleDelete = (file: {url: string, file: File}) => {
      acceptedFiles = acceptedFiles.slice(0, acceptedFiles.indexOf(file.file)).concat(acceptedFiles.slice(acceptedFiles.indexOf(file.file)+1, acceptedFiles.length));
      let fileUrls = fileURLs.slice(0, fileURLs.indexOf(file)).concat(fileURLs.slice(fileURLs.indexOf(file)+1, fileURLs.length));
      setFileURLs(fileUrls);
  }

  const fileToDataURL = (file: File) => {
    var reader = new FileReader();
    return new Promise(function (resolve, reject) {
      reader.onload = function (event) {
        resolve({url: event.target?.result, file: file})
      }
      reader.readAsDataURL(file)
    })
  }  
  

    return (
      <Dialog onClose={handleCancel} open={props.open}>
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent>
            <Stack spacing={2}>
                <TextField
                id="title" 
                label="Title"
                defaultValue={props.note.title ? props.note.title : undefined}
                onChange={handleChange}
                />
                <TextField
                multiline
                minRows={5}
                id="content" 
                label="Content"
                defaultValue={props.note.content ? props.note.content : undefined}
                onChange={handleChange}
                />
                <Box>
                  <Box {...getRootProps()}>
                  <input {...getInputProps()} />
                  {
                      isDragActive ?
                      (<Typography>Drop the files here ...</Typography>) :
                      (<>
                      <AddAPhotoOutlined/>
                      <Typography>Drag photos here to upload</Typography>
                      <Typography>Max 12 photos. Acceptable file types: .jpeg .jpg .png .svg .tiff .tif .webp</Typography>
                      <Divider>Or</Divider>
                      <Button>Browse files</Button>
                      </>)
                  }
                  </Box>
                  {loadingFiles && <Typography>Uploading...</Typography>}
                      <ImageList cols={3} rowHeight={164}>
                        {fileURLs.map((file) => (
                          <Box key={file.url}>
                            <IconButton onClick={ () => handleDelete(file)}>
                              <Close/>
                            </IconButton>
                          <ImageListItem >
                            {/* eslint-disable-next-line */}
                            <img src={file.url}/>
                          </ImageListItem>
                          </Box>
                        ))}
                    </ImageList>
                </Box>
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
        </DialogActions>
        {savingNote && <Typography>Saving...</Typography>}
      </Dialog>
    );
  }