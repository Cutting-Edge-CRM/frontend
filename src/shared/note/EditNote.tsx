import { AddAPhotoOutlined, Close } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, ImageList, ImageListItem, Stack, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { saveImagesCloudinary, updateImagesInCloudinary } from '../../api/images.api';
import { createNote, updateNote } from '../../api/note.api';

export default function EditNote(props: any) {
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  const handleCancel = () => {
      props.onClose();
    };

  const handleSave = () => {
      if (props.type === 'edit') {
        setSavingNote(true);
        updateImagesInCloudinary(props.fileURLs, props.originalImages)
        .then(res => {
          updateNote({...props.note, images: res})
          .then(res => {
            setSavingNote(false);
            props.onClose();
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
        setSavingNote(true);
        saveImagesCloudinary(props.fileURLs)
        .then(res => {
          createNote({...props.note, images: res})
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
        props.setFileURLs(props.fileURLs.concat(fileArray as {url: string, file: File}[]))
      })
    }
      readAsDataURL(acceptedFiles)
    }, [props])

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
      acceptedFiles = acceptedFiles.slice(0, acceptedFiles.indexOf(file?.file)).concat(acceptedFiles.slice(acceptedFiles.indexOf(file?.file)+1, acceptedFiles.length));
      let fileUrls = props.fileURLs.slice(0, props.fileURLs.indexOf(file)).concat(props.fileURLs.slice(props.fileURLs.indexOf(file)+1, props.fileURLs.length));
      props.setFileURLs(fileUrls);
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
                        {props.fileURLs.map((file: any) => (
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