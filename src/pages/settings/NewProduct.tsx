import { AddAPhoto, Close } from '@mui/icons-material';
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
    ImageListItem,
    InputLabel,
    LinearProgress,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
  } from '@mui/material';
  import * as React from 'react';
  import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { updateImagesInCloudinary } from '../../api/images.api';
import { updateProposalResources } from '../../api/proposals.api';
import { theme } from '../../theme/theme';
  
  export default function NewProduct(props: any) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [productFileURLs, setProductFileURLs] = useState([] as any);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [product, setProduct] = useState({} as any);

  
    const handleCancel = () => {
      props.onClose();
      setError(null);
    };

    const handleSave = () => {
      setLoading(true);
      updateImagesInCloudinary(productFileURLs, [{url: product.image}]).then(
        (res) => {
          if (props.type === 'edit') {
            props.proposal.products.find((p: any) => p.id === props.productId).image = res?.[0]?.url;
            updateProposalResources(props.proposal).then(
              (res) => {
                setLoading(false);
                props.onClose();
                props.success('Successfully updated proposal settings');
              },
              (err) => {
                setLoading(false);
                setError(err.message);
                console.log('error' + err.message);
              }
            );
          } else {
            let productWithImage = product;
            productWithImage.image = res?.[0]?.url;
            updateProposalResources({...props.proposal, products: props.proposal.products.concat(productWithImage)}).then(
              (res) => {
                setLoading(false);
                props.onClose();
                props.success('Successfully updated proposal settings');
              },
              (err) => {
                setLoading(false);
                setError(err.message);
                console.log('error' + err.message);
              }
            );
          }
        },
        (err) => {
          setLoading(false);
          setError(err.message);
          console.log('error' + err.message);
        }
      );
    };
  
    const handleChange = (event: any) => {
      if (props.productId) {
        props.proposal.products.find((p: any) => p.id === props.productId)[event.target.id] = event.target.value;
        setProduct({...props.proposal.products.find((p: any) => p.id === props.productId)});
      } else {
        setProduct({...product, [event.target.id]: event.target.value});
      }
    };


        const onProductDrop = React.useCallback(
            (acceptedFiles: File[]) => {
              const readAsDataURL = (files: File[]) => {
                setLoadingFiles(true);
                productFileToDataURL(files[0]).then((file) => {
                  setLoadingFiles(false);
                  setProductFileURLs([file] as { url: string; file: File }[]);
                });
              };
              readAsDataURL(acceptedFiles);
            },
            []
          );
    
        
          let { getRootProps:getRootPropsForProduct, getInputProps:getInputPropsForProduct, isDragActive:isDragActiveForProduct, } =
            useDropzone({
              accept: {
                'image/jpeg': ['.jpeg', '.jpg'],
                'image/png': ['.png'],
                'image/tiff': ['.tif', '.tiff'],
                'image/svg+xml': ['.svg'],
                'image/webp': ['.webp'],
              },
              maxFiles: 1,
              onDrop:onProductDrop,
            });
        
          const handleDeleteProduct = () => {
            setProductFileURLs([]);
          };
        
          const productFileToDataURL = (file: File) => {
            var reader = new FileReader();
            return new Promise(function (resolve, reject) {
              reader.onload = function (event) {
                resolve({ url: event.target?.result, file: file });
              };
              reader.readAsDataURL(file);
            });
          };
    
    React.useEffect(() => {
      setProductFileURLs([]);
      setProduct({...props.proposal.products?.find((p: any) => p.id === props.productId)});
      let image = props.proposal.products?.find((p: any) => p.id === props.productId)?.image;
      if (image) {
        setProductFileURLs([{url: image}]);
      }
    }, [props])


    return (
      <Dialog fullScreen={useMediaQuery(theme.breakpoints.down("sm"))} onClose={handleCancel} open={props.open} fullWidth>
        <DialogTitle align="center">
          {props.type === 'edit' ? 'Edit Product' :  'New Product'}
        </DialogTitle>
        <DialogContent>
          {loading && <LinearProgress />}
          <Stack spacing={1}>
                        <InputLabel sx={{ color: 'primary.main' }}>Product</InputLabel>
                        <TextField
                        id="name"
                        value={product.name ?? ''}
                        onChange={handleChange}
                        fullWidth
                        />
                        <InputLabel sx={{ color: 'primary.main' }}>Link</InputLabel>
                        <TextField
                        id="link"
                        value={product.link ?? ''}
                        onChange={handleChange}
                        fullWidth
                        />
                        <InputLabel sx={{ color: 'primary.main' }}>Description</InputLabel>
                        <TextField
                        id="description"
                        value={product.description ?? ''}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        minRows={4}
                        />
                        <Box>
                            <Box
                            {...getRootPropsForProduct()}
                            sx={{
                                backgroundColor: 'default.light',
                                borderRadius: '10px',
                                p: 2,
                                cursor: 'pointer',
                                border: '1px dashed',
                                borderColor: 'default.main',
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                            >
                            {productFileURLs.length === 0 &&
                                <>
                                <input {...getInputPropsForProduct()} />
                                {isDragActiveForProduct ? (
                                    <Typography variant="body2">Drop the files here ...</Typography>
                                ) : (
                                    <Stack
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={1.5}
                                    >
                                    <AddAPhoto color="primary" fontSize="large" />
                                    <Typography variant="body2" color="default.main">
                                        Drop an image file here. Ensure the image is square for proper formatting.
                                    </Typography>
                                    <Divider>
                                        <Typography variant="body2" color="default.main">
                                        Or
                                        </Typography>
                                    </Divider>
                                    <Button>Browse files</Button>
                                    </Stack>
                                )}
                                </>
                                }
                                {productFileURLs.length > 0 &&
                                    <Box>
                                    <IconButton onClick={() => handleDeleteProduct()}>
                                        <Close />
                                    </IconButton>
                                    <ImageListItem>
                                        <img src={productFileURLs?.[0]?.url} alt="" />
                                    </ImageListItem>
                                    </Box>
                            }
                            </Box>
                            {loadingFiles && <LinearProgress />}
                        </Box>
                        </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCancel} variant="outlined">
                Cancel
            </Button>
            <Button onClick={handleSave} variant="contained">
                Save
            </Button>
        </DialogActions>
        {error && <Alert severity="error">{error}</Alert>}
      </Dialog>
    );
  }
  