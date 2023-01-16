import { PersonOutline } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

export default function EmptyState(props: any) {

    const [logo, setLogo] = useState(<></> as JSX.Element);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        switch (props.type) {
            case 'quotes':
                setLogo(<PersonOutline/>);
                setTitle(`No Quotes`);
                setBody(`You haven't created any quotes yet, click "New Quote" above to create one!`);
                break;
            case 'jobs':
                setLogo(<PersonOutline/>);
                setTitle('No Jobs');
                setBody(`You haven't created any jobs yet, click "New Job" above to create one!`);
                break;
            case 'invoices':
                setLogo(<PersonOutline/>);
                setTitle('No Invoices');
                setBody(`You haven't created any invoices yet, click "New Invoice" above to create one!`);
                break;
            case 'client-quotes':
                setLogo(<PersonOutline/>);
                setTitle('No Quotes');
                setBody(`This client doesn't have any quotes yet, click "New Quote" above to create one!`);
                break;
            case 'client-jobs':
                setLogo(<PersonOutline/>);
                setTitle('No Jobs');
                setBody(`This client doesn't have any jobs yet, click "New Job" above to create one!`);
                break;
            case 'client-invoices':
                setLogo(<PersonOutline/>);
                setTitle('No Invoices');
                setBody(`This client doesn't have any invoices yet, click "New Invoice" above to create one!`);
                break;
            case 'quote-items':
                setLogo(<PersonOutline/>);
                setTitle('No Items');
                setBody(`This quote doesn't have any items yet, edit the quote to create one!`);
                break;
            case 'job-items':
                setLogo(<PersonOutline/>);
                setTitle('No Items');
                setBody(`This job doesn't have any items yet, click edit the job to create one!`);
                break;
            case 'invoice-items':
                setLogo(<PersonOutline/>);
                setTitle('No Items');
                setBody(`This invoice doesn't have any items yet, edit the invoice to create one!`);
                break;
            case 'properties':
                setLogo(<PersonOutline/>);
                setTitle('No Properties');
                setBody(`This client doesn't have any properties yet, click "New Property" above to create one!`);
                break;
            case 'clients':
                setLogo(<PersonOutline/>);
                setTitle('No Clients');
                setBody(`You haven't created any clients yet, click "New Client" above to create one!`);
                break;
            default:
                break;
        }
    }, [props.type])  
    
    return (
        <Box>
            <Stack direction='row'>
                {logo}
                <Typography>
                    {title}
                </Typography>
                <Typography>
                    {body}
                </Typography>
            </Stack>
        </Box>
    );
  }