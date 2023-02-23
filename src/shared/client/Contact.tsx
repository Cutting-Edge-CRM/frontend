import { CreateOutlined, OpenInNew } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Card,
  CircularProgress,
  IconButton,
  Stack,
  styled,
  Typography,
  TypographyProps,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClient } from '../../api/client.api';
import { currentUserClaims } from '../../auth/firebase';
import { getChipColor } from '../../theme/theme';
import EditContact from './EditContact';

const StyledTypography = styled(Typography)<TypographyProps>(() => ({
  minWidth: 74,
}));

function Contact(props: any) {
  const [open, setOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [contact, setContact] = useState({} as any);
  const navigate = useNavigate();

  const handleEditOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };

  const handleUpdate = (value: string) => {
    setOpen(false);
  };

  const handleGoToClient = () => {
    navigate(`/clients/${props.client}`);
  }

  useEffect(() => {
    getClient(props.client).then(
      (result) => {
        setIsLoaded(true);
        setContact(result);
      },
      (err) => {
        setIsLoaded(true);
        setError(err.message);
      }
    );
  }, [props, open, props.reload]);

  return (
    <Card sx={{ py: 2 }}>
      {!isLoaded && <Box textAlign='center'><CircularProgress /></Box>}
      {error && <Alert severity="error">{error}</Alert>}
      {isLoaded && !error &&
      <>
      <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      marginBottom={3}
    >
      <Stack direction={'row'} spacing={2} alignItems="center">
      <Avatar sx={{ width: 45, height: 45, backgroundColor: `${getChipColor(contact.status as string)}.main`, color: `${getChipColor(contact.status as string)}.dark`}}>
        {contact?.first?.[0]}
        {contact?.last?.[0]}
      </Avatar>
      <Typography fontWeight={600} fontSize={18}>
        {contact?.first} {contact?.last}
        <IconButton onClick={handleGoToClient}><OpenInNew/></IconButton>
      </Typography>
      </Stack>
      {(currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner') &&
      <IconButton onClick={handleEditOpen} color="info">
        <CreateOutlined />
      </IconButton>
      }
      <EditContact
        contact={contact}
        setContact={setContact}
        open={open}
        onClose={handleClose}
        update={handleUpdate}
        type={'edit'}
        success={props.success}
      />
    </Stack>
    <Stack spacing={4}>
      <Stack spacing={2}>
        {contact?.contacts
          ?.filter((c: any) => c.type === 'phone' && c.content !== '')
          .map((phone: any, index: number) => (
            <Stack direction="row" spacing={2} key={index}>
              <StyledTypography color="primary" variant="body2">
                Phone
              </StyledTypography>
              <Typography variant="body2">{phone.content}</Typography>
            </Stack>
          ))}
        {contact?.contacts?.filter(
          (c: any) => c.type === 'phone' && c.content !== ''
        ).length === 0 && (
          <Stack direction="row" spacing={2}>
            <StyledTypography color="primary" variant="body2">
              Phone
            </StyledTypography>
            <Typography variant="body2">No phone numbers</Typography>
          </Stack>
        )}
      </Stack>
      <Stack spacing={2}>
        {contact?.contacts
          ?.filter((c: any) => c.type === 'email' && c.content !== '')
          .map((email: any, index: number) => (
            <Stack direction="row" spacing={2} key={index}>
              <StyledTypography color="primary" variant="body2">
                Email
              </StyledTypography>
              <Typography variant="body2">{email.content}</Typography>
            </Stack>
          ))}
        {contact?.contacts?.filter(
          (c: any) => c.type === 'email' && c.content !== ''
        ).length === 0 && (
          <Stack direction="row" spacing={2}>
            <StyledTypography color="primary" variant="body2">
              Email
            </StyledTypography>
            <Typography variant="body2">No email addresses</Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
    </>
      }
    </Card>
  );
}

export default Contact;
