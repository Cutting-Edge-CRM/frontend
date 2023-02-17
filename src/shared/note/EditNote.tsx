import { AddAPhotoOutlined, Close } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
  LinearProgress,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  saveImagesCloudinary,
  updateImagesInCloudinary,
} from '../../api/images.api';
import { createNote, updateNote } from '../../api/note.api';
import { theme } from '../../theme/theme';

export default function EditNote(props: any) {
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCancel = () => {
    props.onClose();
  };

  const handleSave = () => {
    if (props.type === 'Edit') {
      setLoading(true);
      updateImagesInCloudinary(props.fileURLs, props.originalImages).then(
        (res) => {
          updateNote({ ...props.note, images: res }).then(
            (res) => {
              setLoading(false);
              props.onClose();
              props.success('Successfully updated note');
            },
            (err) => {
              setLoading(false);
              setError(err.message);
              console.log('error' + err.message);
            }
          );
        },
        (err) => {
          setLoading(false);
          setError(err.message);
          console.log('error' + err.message);
        }
      );
    }
    if (props.type === 'New') {
      setLoading(true);
      saveImagesCloudinary(props.fileURLs).then(
        (res) => {
          createNote({ ...props.note, images: res }).then(
            (res) => {
              setLoading(false);
              props.onClose();
              props.success('Successfully created new note');
            },
            (err) => {
              setError(err.message);
              setLoading(false);
              console.log('error' + err.message);
            }
          );
        },
        (err) => {
          setError(err.message);
          setLoading(false);
          console.log('error' + err.message);
        }
      );
    }
  };

  const handleChange = (event: any) => {
    props.setNote({ ...props.note, [event.target.id]: event.target.value });
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const readAsDataURL = (files: File[]) => {
        setLoadingFiles(true);
        Promise.all(files.map(fileToDataURL)).then((fileArray) => {
          setLoadingFiles(false);
          props.setFileURLs(
            props.fileURLs.concat(fileArray as { url: string; file: File }[])
          );
        });
      };
      readAsDataURL(acceptedFiles);
    },
    [props]
  );

  let { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      accept: {
        'image/jpeg': ['.jpeg', '.jpg'],
        'image/png': ['.png'],
        'image/tiff': ['.tif', '.tiff'],
        'image/svg+xml': ['.svg'],
        'image/webp': ['.webp'],
      },
      maxFiles: 12,
      onDrop,
    });

  const handleDelete = (file: { url: string; file: File }) => {
    acceptedFiles = acceptedFiles
      .slice(0, acceptedFiles.indexOf(file?.file))
      .concat(
        acceptedFiles.slice(
          acceptedFiles.indexOf(file?.file) + 1,
          acceptedFiles.length
        )
      );
    let fileUrls = props.fileURLs
      .slice(0, props.fileURLs.indexOf(file))
      .concat(
        props.fileURLs.slice(
          props.fileURLs.indexOf(file) + 1,
          props.fileURLs.length
        )
      );
    props.setFileURLs(fileUrls);
  };

  const fileToDataURL = (file: File) => {
    var reader = new FileReader();
    return new Promise(function (resolve, reject) {
      reader.onload = function (event) {
        resolve({ url: event.target?.result, file: file });
      };
      reader.readAsDataURL(file);
    });
  };

  const noteIsValid = () => {
    return (
      props.fileURLs.length > 0 ||
      props.note.title?.trim()?.length > 0 ||
      props.note.content?.trim()?.length > 0
    );
  };

  return (
    <Dialog fullScreen={useMediaQuery(theme.breakpoints.down("sm"))}  onClose={handleCancel} open={props.open} fullWidth>
      <DialogTitle align="center">{props.type} Note</DialogTitle>
      <DialogContent>
        {loading && <LinearProgress />}
        <Stack spacing={2} mt={2}>
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
            <Box
              {...getRootProps()}
              sx={{
                backgroundColor: 'default.light',
                borderRadius: '10px',
                p: 2,
                cursor: 'pointer',
                border: '1px dashed',
                borderColor: 'default.main',
              }}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <Typography variant="body2">Drop the files here ...</Typography>
              ) : (
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  spacing={1.5}
                >
                  <Typography variant="body2" color="default.main">
                    Drag photos here to upload
                  </Typography>
                  <Typography variant="body2" color="default.main">
                    Max 12 photos. Acceptable file types: .jpeg .jpg .png .svg
                    .tiff .tif .webp
                  </Typography>
                  <AddAPhotoOutlined color="primary" fontSize="large" />
                  <Divider>
                    <Typography variant="body2" color="default.main">
                      Or
                    </Typography>
                  </Divider>
                  <Button>Browse files</Button>
                </Stack>
              )}
            </Box>
            {loadingFiles && <LinearProgress />}
            <ImageList cols={3} rowHeight={164}>
              {props.fileURLs.map((file: any) => (
                <Box key={file.url}>
                  <IconButton onClick={() => handleDelete(file)}>
                    <Close />
                  </IconButton>
                  <ImageListItem>
                    {/* eslint-disable-next-line */}
                    <img src={file.url} />
                  </ImageListItem>
                </Box>
              ))}
            </ImageList>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} variant="outlined">
          Cancel
        </Button>
        <Button
          disabled={!noteIsValid()}
          onClick={handleSave}
          variant="contained"
        >
          Save Changes
        </Button>
      </DialogActions>
      {error && <Alert severity="error">{error}</Alert>}
    </Dialog>
  );
}
