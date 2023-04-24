import { AttachMoney, ColorLens, Description, EventAvailable, FormatListBulleted, FormatPaint, History, Image, Map, MapsHomeWork, People, RateReview, Sell } from '@mui/icons-material';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

export default function EmptyState(props: any) {

    const [logo, setLogo] = useState(<></> as JSX.Element);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        switch (props.type) {
            case 'quotes':
                setLogo(<Sell sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setTitle(`No Quotes`);
                setBody(`You haven't created any quotes yet, click "New Quote" above to create one!`);
                break;
            case 'jobs':
                setLogo(<FormatPaint sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setTitle('No Jobs');
                setBody(`You haven't created any jobs yet, click "New Job" above to create one!`);
                break;
            case 'invoices':
                setLogo(<AttachMoney sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setTitle('No Invoices');
                setBody(`You haven't created any invoices yet, click "New Invoice" above to create one!`);
                break;
            case 'client-quotes':
                setLogo(<Sell sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setTitle('No Quotes');
                setBody(`This client doesn't have any quotes yet, click "New Quote" above to create one!`);
                break;
            case 'client-jobs':
                setLogo(<FormatPaint sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setTitle('No Jobs');
                setBody(`This client doesn't have any jobs yet, click "New Job" above to create one!`);
                break;
            case 'client-invoices':
                setLogo(<AttachMoney sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setTitle('No Invoices');
                setBody(`This client doesn't have any invoices yet, click "New Invoice" above to create one!`);
                break;
            case 'quote-items':
                setLogo(<Sell sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setTitle('No Items');
                setBody(`This quote doesn't have any items yet, edit the quote to create one!`);
                break;
            case 'job-items':
                setLogo(<FormatPaint sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setTitle('No Items');
                setBody(`This job doesn't have any items yet, click edit the job to create one!`);
                break;
            case 'invoice-items':
                setLogo(<AttachMoney sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setTitle('No Items');
                setBody(`This invoice doesn't have any items yet, edit the invoice to create one!`);
                break;
            case 'properties':
                setLogo(<MapsHomeWork sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setTitle('No Properties');
                setBody(`This client doesn't have any properties yet, click "New Property" above to create one!`);
                break;
            case 'clients':
                setLogo(<People sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setTitle('No Clients');
                setBody(`You haven't created any clients yet, click "New Client" above to create one!`);
                break;
            case 'notes':
                setLogo(<FormatListBulleted sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setBody(`This client doesn't have any notes yet, click the '+' icon above to add one!`);
                break;
            case 'visits':
                setLogo(<EventAvailable sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setBody(`This client doesn't have any visits yet, click the '+' icon above to add one!`);
                break;
            case 'timeline':
                setLogo(<History sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setBody(`There is no history associated with this resource yet.`);
                break;
            case 'unscheduled':
                setLogo(<EventAvailable sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setBody(`No unscheduled visits!`);
                break;
            case 'map':
                setLogo(<Map sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setBody(`Map is not available for this property`);
                break;
            case 'clienthub-Pending':
                setLogo(<Sell sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setBody(`You have no pending quotes.`);
                break;
            case 'clienthub-Approved':
                setLogo(<Sell sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setBody(`You have no approved quotes.`);
                break;
            case 'clienthub-Rejected':
                setLogo(<Sell sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setBody(`You have no rejected quotes.`);
                break;
            case 'clienthub-Converted':
                setLogo(<Sell sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setBody(`You have no converted quotes.`);
                break;
            case 'clienthub-Archived':
                setLogo(<Sell sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setBody(`You have no archived quotes.`);
                break;
            case 'clienthub-Awaiting Payment':
                setLogo(<AttachMoney sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setBody(`You have no invoices awaiting payment.`);
                break;
            case 'clienthub-Paid':
                setLogo(<AttachMoney sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setBody(`You have no paid invoices.`);
                break;
            case 'proposalResources':
                setLogo(<Description sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setTitle(`No Proposal Details`);
                setBody(`You haven't added any resources to this proposal. Click 'Edit Quote' above to add some!`);
                break;
            case 'gallery':
                setLogo(<Image sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setTitle(`No Gallery Images`);
                setBody(`You haven't added any gallery images. Click 'Gallery Settings' above to add some!`);
                break;
            case 'reviews':
                setLogo(<RateReview sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setTitle(`No Reviews`);
                setBody(`You haven't added any reviews. Click 'Review Settings' above to add some!`);
                break;
            case 'products':
                setLogo(<ColorLens sx={{ fontSize: 60, color: 'primary.main' }}/>);
                setTitle(`No Products`);
                setBody(`You haven't added any products. Click 'Product Settings' above to add some!`);
                break;
            default:
                break;
        }
    }, [props.type])  
    
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%'
          }}>
            <Stack direction='row' spacing={2} sx={{
                backgroundColor: 'default.light',
                borderRadius: '10px',
                p: 2,
                height: '50%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around'
            }}>
                {logo &&
                <Box sx={{
                    width:'20%',
                    display: 'flex',
                    justifyContent: 'center',
                    }}>
                    <Avatar 
                    sx={{
                        backgroundColor: 'white',
                        height: '80px',
                        width: '80px'
                        }}>
                        {logo}
                    </Avatar>
                </Box>
                }
                <Stack direction={{xs: 'column', sm: 'row'}} width="100%" spacing={2} alignItems="center">
                {title &&
                    <Typography 
                    textAlign="center"
                    variant="h6"
                    color="neutral.dark"
                    >
                    {title}
                    </Typography>
                }
                
                <Typography 
                    textAlign="center"
                    variant="body2"
                    color="neutral.dark"
                    >
                    {body}
                </Typography>
                </Stack>
            </Stack>
        </Box>
    );
  }