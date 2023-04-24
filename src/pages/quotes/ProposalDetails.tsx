import { OpenInNew, Star } from '@mui/icons-material';
import { Box, Button, Card, Checkbox, Grid, ImageList, ImageListItem, InputLabel, Link, Stack, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../shared/EmptyState';
import RichText from '../../shared/richtext/RichText';

function ProposalDetails(props: any) {
    const navigate = useNavigate();

    const handleGoToSettings = () => {
        navigate(`/settings?tab=proposals`);
    }

    return (
    <Stack marginBottom={4}>
        {props.editting &&
        <>
        <Stack direction={'row'} marginTop={6} justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
                Summary
            </Typography>
            <Button
            onClick={handleGoToSettings}
            endIcon={<OpenInNew/>}
            >
                Proposal Settings
            </Button>
        </Stack>
        <Typography variant="body1" marginBottom={2}>Describe why the client should choose your company over the next one. This can be displayed on your proposals to re-sell your company to ensure you land the job.</Typography>
        <Box sx={{".quill": {height: '300px'}, height: '350px'}}>
            <RichText
                id='about'
                onChange={props.handleChangeAbout}
                value={props.about}
            />
        </Box>
        <Stack direction={'row'} marginTop={8} justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
                Gallery
            </Typography>
            <Button
            onClick={handleGoToSettings}
            endIcon={<OpenInNew/>}
            >
                Gallery Settings
            </Button>
        </Stack>
        <Typography variant="body1" marginBottom={2}>Select which photos you would like to include in this proposal</Typography>
        {props.proposal.gallery?.length > 0 &&
        <ImageList variant="woven" cols={3} rowHeight={164} sx={{maxHeight: '500px'}}>
            {props.proposal.gallery?.map((file: any) => (
                <ImageListItem key={file.id}>
                    <Checkbox 
                    checked={!!props.selected.find((s: any) => s.resourceId === file.id && s.resourceType === 'gallery')}
                    onChange={(e) => props.handleSelect(e, file.id, 'gallery')}
                    sx={{marginBottom: '-100px', marginLeft: '10px', zIndex: 100, backgroundColor: 'white', ':hover': {backgroundColor: 'white'}}} />
                    {/* eslint-disable-next-line */}
                    <img src={file.url} />
                </ImageListItem>
            ))}
        </ImageList>
        }
        {props.proposal.gallery?.length === 0 &&
        <EmptyState type="gallery" />
        }
        <Stack direction={'row'} marginTop={8} justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
                Reviews
            </Typography>
            <Button
            onClick={handleGoToSettings}
            endIcon={<OpenInNew/>}
            >
                Review Settings
            </Button>
        </Stack>
        <Typography variant="body1" marginBottom={2}>Select which reviews you would like to display on this proposal</Typography>
        <Grid container spacing={2}>
            {props.proposal?.reviews?.map((review: any, index: number) => (
                <Grid item xs={4} marginTop={4} key={index}>
                    <Card key={index} sx={{backgroundColor: '#F3F5F8', boxShadow: 'none', paddingY: 2, height: '100%'}}>
                    <Stack spacing={1}>
                        <Stack direction={'row'} justifyContent="space-between">
                            <InputLabel sx={{ color: 'primary.main' }}>Reviewer Name</InputLabel>
                            <Checkbox
                            checked={!!props.selected.find((s: any) => s.resourceId === review.id && s.resourceType === 'review')}
                            onChange={(e) => props.handleSelect(e, review.id, 'review')}
                            sx={{ backgroundColor: 'white', ':hover': {backgroundColor: 'white'}}}
                            />
                        </Stack>
                        <Typography>{review.name}</Typography>
                        <InputLabel sx={{ color: 'primary.main' }}>Review</InputLabel>
                        <Typography>{review.content}</Typography>
                    </Stack>
                    </Card>
                </Grid>
            ))}
        </Grid>
        {props.proposal.reviews?.length === 0 &&
                <EmptyState type="reviews" />
            }
        <Stack direction={'row'} marginTop={10} justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
                Products
            </Typography>
            <Button
            onClick={handleGoToSettings}
            endIcon={<OpenInNew/>}
            >
                Products Settings
            </Button>
        </Stack>
        <Typography variant="body1" marginBottom={2}>Select which products you would like to display on this proposal</Typography>
        <Grid container spacing={2}>
            {props.proposal?.products?.map((product: any, index: number) => (
                <Grid item xs={4} key={index}>
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
                        <Box sx={{width: '40px', height: '40px'}}>
                        <Checkbox
                        checked={!!props.selected.find((s: any) => s.resourceId === product.id && s.resourceType === 'product')}
                        onChange={(e) => props.handleSelect(e, product.id, 'product')}
                        sx={{ backgroundColor: 'white', ':hover': {backgroundColor: 'white'}}} />
                        </Box>
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
        </Grid>
        {props.proposal.products?.length === 0 &&
                <EmptyState type="products" />
            }
        </>
        }
        {!props.editting &&
        // eslint-disable-next-line
        !(props.about?.replace(/\<.*?\>/g, "")?.length > 1) &&
        props.proposal.gallery?.filter((g: any) => !!props.selected.find((s: any) => s.resourceId === g.id && s.resourceType === 'gallery'))?.length === 0 &&
        props.proposal?.reviews?.filter((r: any) => !!props.selected.find((s: any) => s.resourceId === r.id && s.resourceType === 'review'))?.length === 0 &&
        props.proposal?.products?.filter((p: any) => !!props.selected.find((s: any) => s.resourceId === p.id && s.resourceType === 'product'))?.length === 0 && 
        <Box marginTop={3}><EmptyState type="proposalResources" /></Box>
        }
        {!props.editting &&
        <>
        {/* eslint-disable-next-line */}
        {props.about?.replace(/\<.*?\>/g, "")?.length > 1 &&
            <Typography dangerouslySetInnerHTML={{ __html: props.about }}></Typography>
        }
        {props.proposal.gallery?.filter((g: any) => !!props.selected.find((s: any) => s.resourceId === g.id && s.resourceType === 'gallery'))?.length > 0 &&
        <>
        <Typography fontWeight={600} variant="h6" marginBottom={2} marginTop={4}>Gallery</Typography>
        <ImageList variant="woven" cols={3} rowHeight={164}>
            {props.proposal.gallery?.filter((g: any) => !!props.selected.find((s: any) => s.resourceId === g.id && s.resourceType === 'gallery'))?.map((file: any) => (
                <ImageListItem key={file.id}>
                    {/* eslint-disable-next-line */}
                    <img src={file.url} />
                </ImageListItem>
            ))}
        </ImageList>
        </>
        }
        {props.proposal?.reviews?.filter((r: any) => !!props.selected.find((s: any) => s.resourceId === r.id && s.resourceType === 'review'))?.length > 0 && 
        <>
        <Typography fontWeight={600} variant="h6" marginBottom={2} marginTop={4}>Reviews</Typography>
        <Grid container spacing={2}>
            {props.proposal?.reviews?.filter((r: any) => !!props.selected.find((s: any) => s.resourceId === r.id && s.resourceType === 'review'))?.map((review: any, index: number) => (
                <Grid item xs={4} marginTop={4} key={index}>
                    <Card key={index} sx={{backgroundColor: '#F3F5F8', boxShadow: 'none', paddingY: 2, height: '100%'}}>
                    <Stack spacing={1}>
                        <Stack direction={'row'} justifyContent="center">
                            <Star sx={{color: '#FFD700'}} fontSize="large"/>
                            <Star sx={{color: '#FFD700'}} fontSize="large"/>
                            <Star sx={{color: '#FFD700'}} fontSize="large"/>
                            <Star sx={{color: '#FFD700'}} fontSize="large"/>
                            <Star sx={{color: '#FFD700'}} fontSize="large"/>
                        </Stack>
                        <Typography fontStyle={'italic'} >{review.content}</Typography>
                        <Typography fontWeight={600} visibility={!!review.name ? 'visible' : 'hidden'}>- {review.name}</Typography>
                    </Stack>
                    </Card>
                </Grid>
            ))}
        </Grid>
        </>
        }
        {props.proposal?.products?.filter((p: any) => !!props.selected.find((s: any) => s.resourceId === p.id && s.resourceType === 'product'))?.length > 0 && 
        <>
        <Typography fontWeight={600} variant="h6" marginBottom={2} marginTop={8}>Products</Typography>
        <Grid container spacing={2}>
            {props.proposal?.products?.filter((p: any) => !!props.selected.find((s: any) => s.resourceId === p.id && s.resourceType === 'product'))?.map((product: any, index: number) => (
                <Grid item xs={4} key={index}>
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
        </Grid>
        </>
        }
        </>
        }
    </Stack>
    )
}

export default ProposalDetails;