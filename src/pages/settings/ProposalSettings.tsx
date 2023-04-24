import { AddressAutofill } from '@mapbox/search-js-react';
import { AddAPhoto, AddCircleOutlineOutlined, Close, DeleteOutline, EditOutlined, PeopleOutline } from '@mui/icons-material';
import { Alert, Box, Button, Card, Divider, Grid, IconButton, ImageList, ImageListItem, InputAdornment, InputLabel, LinearProgress, Link, Stack, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { updateImagesInCloudinary } from '../../api/images.api';
import { listProposalResources, updateProposalResources } from '../../api/proposals.api';
import { updateSettings } from '../../api/settings.api';
import RichText from '../../shared/richtext/RichText';
import NewProduct from './NewProduct';

function ProposalSettings(props: any) {
    const [error, setError] = useState(null);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [fileURLs, setFileURLs] = useState([] as any);
    const [proposal, setProposal] = useState({} as any);
    const [loading, setLoading] = useState(false);
    const [originalImages, setOriginalImages] = useState([] as any);
    const [newProductOpen, setNewProductOpen] = useState(false);
    const [type, setType] = useState('');
    const [productId, setProductId] = useState(null);
    const [reload, setReload] = useState(false);


    const handleChangeSettings = (event: any) => {
        props.setSettings({ ...props.settings, [event.target.id]: event.target.value });
    };

    const handleChangeReview = (event: any, index: number) => {
        let reviews = proposal.reviews;
        reviews[index][event.target.id] = event.target.value;
        setProposal({ ...proposal, reviews: reviews });
      };
    
      const handleRemoveReview = (event: any, index: number) => {
        let reviews = proposal.reviews;
        reviews = reviews
          .slice(undefined, index)
          .concat(reviews.slice(index + 1, undefined));

          setProposal({ ...proposal, reviews: reviews });
        };
    
      const handleAddReview = () => {
        let reviews = proposal.reviews;
        reviews.push({ name: '', content: '' });
        setProposal({ ...proposal, reviews: reviews });
    };

    const handleDeleteProduct = (event: any, index: number) => {
        let products = proposal.products;
        products = products
          .slice(undefined, index)
          .concat(products.slice(index + 1, undefined));

          updateProposalResources({...proposal, products: products}).then(
            (res) => {
              setLoading(false);
              props.success('Successfully updated proposal settings');
              setReload(!reload);
            },
            (err) => {
              setLoading(false);
              setError(err.message);
              console.log('error' + err.message);
            }
          );
        };
    
    const handleAddProduct = () => {
        setProductId(null);
        setType('new');
        setNewProductOpen(true);
    };

    const handleEditProduct = (index: number) => {
        setType('edit');
        setProductId(proposal.products[index].id);
        setNewProductOpen(true);
    };

    const handleNewProductClose = () => {
        setNewProductOpen(false);
    }

    const handleSaveGallery = () => {
        setLoading(true);
        // only updating images from gallery, not products
        updateImagesInCloudinary(fileURLs, originalImages).then(
          (res) => {
            updateProposalResources({...proposal, gallery: res}).then(
              (res) => {
                setLoading(false);
                props.success('Successfully updated proposal settings');
                setReload(!reload);
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

    const handleSaveSettings = () => {
        updateSettings(props.settings)
        .then(res => {
            props.success('Successfully updated proposal settings');   
        }, err => {
            setError(err);
        })
    }

    const handleSaveReviews = () => {
        updateProposalResources(proposal).then(
            (res) => {
              setLoading(false);
              props.success('Successfully updated proposal settings');
              setReload(!reload);
            },
            (err) => {
              setLoading(false);
              setError(err.message);
              console.log('error' + err.message);
            }
          );
    }

    // gallery images
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
          const readAsDataURL = (files: File[]) => {
            setLoadingFiles(true);
            Promise.all(files.map(fileToDataURL)).then((fileArray) => {
              setLoadingFiles(false);
              setFileURLs(
                fileURLs.concat(fileArray as { url: string; file: File }[])
              );
            });
          };
          readAsDataURL(acceptedFiles);
        },
        [fileURLs]
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
        let fileUrls = fileURLs
          .slice(0, fileURLs.indexOf(file))
          .concat(
            fileURLs.slice(
              fileURLs.indexOf(file) + 1,
              fileURLs.length
            )
          );
        setFileURLs(fileUrls);
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

      useEffect(() => {
        listProposalResources().then(res => {
            setProposal(res);
            setOriginalImages(res.gallery);
            setFileURLs(res.gallery);
        }, err => {
            setError(err.message)
        })
      }, [newProductOpen, reload])


    return (
        <>
        {error && <Alert severity="error">{error}</Alert>}
        {loading && <LinearProgress/>}
        <Card sx={{ py: 3 }}>
            {/* for a very strange reason putting this making it style properly on mobile */}
            <AddressAutofill accessToken=''>
              <TextField sx={{display:'none'}} />
            </AddressAutofill>
            <Stack>
                <Typography align={'center'} variant="h6" marginBottom={2}>Summary</Typography>
                <Typography align={'center'} variant="body1" marginBottom={2}>Describe why the client should choose your company over the next one. This can be displayed on your proposals to re-sell your company to ensure you land the job.</Typography>
                <Box sx={{".quill": {height: '300px'}, height: '350px'}}>
                    <RichText
                        id='about'
                        onChange={handleChangeSettings}
                        value={props.settings.about}
                    />
                </Box>
                <Stack direction={'row'} justifyContent='center' spacing={2} marginTop={{xs: 10, sm: 3}}>
                    {/* <Button variant="outlined" onClick={handleReload}>Cancel</Button> */}
                    <Button variant="contained" onClick={handleSaveSettings}>Save Changes</Button>
                </Stack>
            </Stack>
        </Card>
        <Card sx={{ py: 3 }}>
            <Stack>
                <Typography align={'center'} variant="h6" marginBottom={2}>Gallery</Typography>
                <Typography align={'center'} variant="body1" marginBottom={2}>Upload images to display on your proposals. These could be pictures showcasing your work, team photos, or anything you like!</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
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
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                            >
                                <>
                                <input {...getInputProps()} />
                                {isDragActive ? (
                                    <Typography variant="body2">Drop the files here ...</Typography>
                                ) : (
                                    <Stack
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={1.5}
                                    >
                                    <AddAPhoto color="primary" fontSize="large" />
                                    <Typography variant="body2" color="default.main">
                                        Drop image files here
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
                            </Box>
                            {loadingFiles && <LinearProgress />}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        {fileURLs.length > 0 &&
                            <ImageList variant="woven" cols={3} rowHeight={164} sx={{maxHeight: '500px'}}>
                            {fileURLs.map((file: any) => (
                                <Box key={file.url} marginTop={4}>
                                <Stack direction={'row'} justifyContent="space-between">
                                    <IconButton onClick={() => handleDelete(file)}>
                                        <Close />
                                    </IconButton>
                                </Stack>
                                <ImageListItem>
                                    {/* eslint-disable-next-line */}
                                    <img src={file.url} />
                                </ImageListItem>
                                </Box>
                            ))}
                            </ImageList>
                        }
                    </Grid>
                </Grid>
                <Stack direction={'row'} justifyContent='center' spacing={2} marginTop={3}>
                    {/* <Button variant="outlined" onClick={handleReload}>Cancel</Button> */}
                    <Button variant="contained" onClick={handleSaveGallery}>Save Changes</Button>
                </Stack>
            </Stack>
        </Card>
        <Card sx={{ py: 3 }}>
            <Stack>
                <Typography align={'center'} variant="h6" marginBottom={2}>Reviews</Typography>
                <Typography align={'center'} variant="body1" marginBottom={2}>Add some reviews to display on your proposals.</Typography>
                <Grid container spacing={2}>
                    {proposal?.reviews?.map((review: any, index: number) => (
                        <Grid item lg={4} md={6} xs={12} marginTop={4} key={index}>
                            <Card key={index} sx={{backgroundColor: '#F3F5F8', boxShadow: 'none', paddingY: 2, height: '100%'}}>
                            <Stack spacing={1}>
                                <Stack direction={'row'} justifyContent="space-between">
                                    <InputLabel sx={{ color: 'primary.main' }}>Reviewer Name</InputLabel>
                                    <IconButton
                                    onClick={(e) => handleRemoveReview(e, index)}
                                    >
                                        <DeleteOutline color='error'/>
                                    </IconButton>
                                </Stack>
                                <TextField
                                id="name"
                                onChange={(e) => handleChangeReview(e, index)}
                                value={review.name}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <PeopleOutline color='primary' />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                                <InputLabel sx={{ color: 'primary.main' }}>Review</InputLabel>
                                <Box sx={{'.MuiInputBase-input': {borderRadius: '20px', paddingY: '10px'}, '.MuiInputBase-root': {padding: 0}}}>
                                    <TextField
                                    id="content"
                                    onChange={(e) => handleChangeReview(e, index)}
                                    value={review.content}
                                    fullWidth
                                    multiline
                                    minRows={4}
                                    />
                                </Box>
                            </Stack>
                            </Card>
                        </Grid>
                    ))}
                    <Grid item lg={4} md={6} xs={12} marginTop={4}>
                    <Card sx={{backgroundColor: '#F3F5F8', boxShadow: 'none', paddingY: 2, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Button
                        onClick={handleAddReview}
                        startIcon={<AddCircleOutlineOutlined />}
                        variant="contained"
                        >
                        <Typography>Add Review</Typography>
                        </Button>
                    </Card>
                    </Grid>
                </Grid>
                <Stack direction={'row'} justifyContent='center' spacing={2} marginTop={3} paddingTop={8}>
                    {/* <Button variant="outlined" onClick={handleReload}>Cancel</Button> */}
                    <Button variant="contained" onClick={handleSaveReviews}>Save Changes</Button>
                </Stack>
            </Stack>
        </Card>
        <Card sx={{ pt: 3, pb: 8 }}>
            <Stack>
                <Typography align={'center'} variant="h6" marginBottom={2}>Products</Typography>
                <Typography align={'center'} variant="body1" marginBottom={2}>Upload products to display on your proposals. These could be different brands of paint you use, specialty primers for unique surfaces, or whatever you like!</Typography>
                <Grid container spacing={2}>
                    {proposal?.products?.map((product: any, index: number) => (
                        <Grid item lg={4} md={6} xs={12} marginTop={4} key={index}>
                            <Card key={index} sx={{backgroundColor: '#F3F5F8', boxShadow: 'none', paddingY: 2, height: '100%'}}>
                            <Stack spacing={1}>
                                <Stack direction={'row'} justifyContent="space-between">
                                    <Stack direction={'row'} spacing={2}>
                                        <Typography
                                        variant='h6'
                                        >
                                            {product.name}
                                        </Typography>
                                    </Stack>
                                    <Stack direction={'row'}>
                                        <IconButton
                                        onClick={(_) => handleEditProduct(index)}
                                        >
                                            <EditOutlined color='primary'/>
                                        </IconButton>
                                        <IconButton
                                        onClick={(e) => handleDeleteProduct(e, index)}
                                        >
                                            <DeleteOutline color='error'/>
                                        </IconButton>
                                    </Stack>
                                </Stack>
                                <Typography
                                variant='body1'
                                >
                                    {product.description}
                                </Typography>
                                <Link
                                    sx={{ textAlign: 'center' }}
                                    href={`${product.link}`}
                                    target="_blank"
                                    visibility={!!product.link && product.link !== '' && product.link !== 'null' ? 'visible' : 'hidden'}
                                >
                                    More info
                                </Link>
                                <ImageListItem sx={{visibility: !!product.image && product.image !== '' && product.image !== 'null' && product.image !== 'undefined' ? 'visible' : 'hidden'}}>
                                    <img src={product.image} alt="" />
                                </ImageListItem>
                            </Stack>
                            </Card>
                        </Grid>
                    ))}
                    <Grid item lg={4} md={6} xs={12} marginTop={4}>
                    <Card sx={{backgroundColor: '#F3F5F8', boxShadow: 'none', paddingY: 2, height: '100%', display: 'flex', justifyContent:"center", alignItems:"center"}}>
                        <Button
                        onClick={handleAddProduct}
                        startIcon={<AddCircleOutlineOutlined />}
                        variant="contained"
                        >
                        <Typography>Add Product</Typography>
                        </Button>
                    </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Card>
        <NewProduct
        open={newProductOpen}
        onClose={handleNewProductClose}
        type={type}
        productId={productId}
        proposal={proposal}
        success={props.success}
        />
        </>
    )
}

export default ProposalSettings;