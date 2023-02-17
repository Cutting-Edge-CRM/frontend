import {
  AddCircleOutlineOutlined,
  DeleteOutline,
  EmailOutlined,
  PersonOutline,
  PhoneOutlined,
} from '@mui/icons-material';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  useMediaQuery,
} from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import { updateClient } from '../../api/client.api';
import { theme } from '../../theme/theme';
import { emailValid } from '../../util/tools';

export default function EditContact(props: any) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    props.onClose();
  };

  const handleSave = () => {
    setLoading(true);
    let contacts = props.contact.contacts.filter(
      (con: any) => con.content.length > 0
    );
    props.setContact({ ...props.contact, contacts: contacts });
    updateClient(props.contact).then(
      (res) => {
        setLoading(false);
        props.update();
        props.success('Successfully updated client');
      },
      (err) => {
        setLoading(false);
        setError(err.message);
      }
    );
  };

  const handleChange = (event: any) => {
    props.setContact({
      ...props.contact,
      [event.target.id]: event.target.value.trim(),
    });
  };

  const handleChangePhone = (event: any, index: number) => {
    let contacts = props.contact?.contacts?.filter(
      (c: any) => c.type === 'phone'
    );
    contacts[index].content = event.target.value;
    contacts = contacts.concat(
      props.contact?.contacts?.filter((c: any) => c.type === 'email')
    );
    props.setContact({ ...props.contact, contacts: contacts });
  };

  const handleRemovePhone = (event: any, index: number) => {
    let contacts = props.contact?.contacts?.filter(
      (c: any) => c.type === 'phone'
    );
    contacts = contacts
      .slice(undefined, index)
      .concat(contacts.slice(index + 1, undefined));
    contacts = contacts.concat(
      props.contact?.contacts?.filter((c: any) => c.type === 'email')
    );
    props.setContact({ ...props.contact, contacts: contacts });
  };

  const handleAddPhone = (event: any) => {
    let contacts = props.contact.contacts;
    contacts.push({ type: 'phone', content: '' });
    props.setContact({ ...props.contact, contacts: contacts });
  };

  const handleChangeEmail = (event: any, index: number) => {
    let contacts = props.contact?.contacts?.filter(
      (c: any) => c.type === 'email'
    );
    contacts[index].content = event.target.value;
    contacts = contacts.concat(
      props.contact?.contacts?.filter((c: any) => c.type === 'phone')
    );
    props.setContact({ ...props.contact, contacts: contacts });
  };

  const handleRemoveEmail = (event: any, index: number) => {
    let contacts = props.contact?.contacts?.filter(
      (c: any) => c.type === 'email'
    );
    contacts = contacts
      .slice(undefined, index)
      .concat(contacts.slice(index + 1, undefined));
    contacts = contacts.concat(
      props.contact?.contacts?.filter((c: any) => c.type === 'phone')
    );
    props.setContact({ ...props.contact, contacts: contacts });
  };

  const handleAddEmail = (event: any) => {
    let contacts = props.contact.contacts;
    contacts.push({ type: 'email', content: '' });
    props.setContact({ ...props.contact, contacts: contacts });
  };

  const validInput = () => {
    return (
      (props.contact.contacts.filter((con: any) => con.content?.length > 4)
        .length > 0 ||
        props.contact.first?.trim().length > 1 ||
        props.contact.last?.trim().length > 1) &&
      props.contact.contacts
        .filter((email: any) => email.type === 'email')
        .filter(
          (email: any) =>
            !emailValid(email.content) && email.content.trim().length > 0
        ).length === 0
    );
  };


  let phoneNumbers: any = [];
  let emailAddresses: any = [];

  phoneNumbers = props.contact?.contacts
    ?.filter((c: any) => c.type === 'phone')
    ?.map((phone: any, index: any) => {
      return (
        <TextField
          key={index}
          label="Phone"
          type={'tel'}
          value={phone.content}
          onChange={(e) => handleChangePhone(e, index)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneOutlined color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <IconButton onClick={(e) => handleRemovePhone(e, index)}>
                <DeleteOutline />
              </IconButton>
            ),
          }}
        />
      );
    });

  emailAddresses = props.contact?.contacts
    ?.filter((c: any) => c.type === 'email')
    ?.map((email: any, index: any) => {
      return (
        <TextField
          key={index}
          label="Email"
          type={'email'}
          value={email.content}
          error={!(emailValid(email.content) || email.content.length < 1)}
          onChange={(e) => handleChangeEmail(e, index)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlined color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <IconButton onClick={(e) => handleRemoveEmail(e, index)}>
                <DeleteOutline />
              </IconButton>
            ),
          }}
        />
      );
    });

  return (
    <Dialog fullScreen={useMediaQuery(theme.breakpoints.down("sm"))} onClose={handleCancel} open={props.open}>
      <DialogTitle align="center">Client Info</DialogTitle>
      <DialogContent>
        {loading && <LinearProgress />}
        <Stack spacing={2} mt={2}>
          <Stack direction={useMediaQuery(theme.breakpoints.down("sm")) ? 'column' : 'row'} spacing={2}>
            <TextField
              id="first"
              label="First name"
              defaultValue={
                props.contact?.first ? props.contact.first : undefined
              }
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="last"
              label="Last name"
              defaultValue={
                props.contact?.last ? props.contact.last : undefined
              }
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          {phoneNumbers}
          <Button
            sx={{ alignSelf: 'flex-start' }}
            onClick={handleAddPhone}
            startIcon={<AddCircleOutlineOutlined color="primary" />}
          >
            Add Phone Number
          </Button>
          {emailAddresses}
          <Button
            sx={{ alignSelf: 'flex-start' }}
            onClick={handleAddEmail}
            startIcon={<AddCircleOutlineOutlined color="primary" />}
          >
            Add Email Address
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} variant="outlined">
          Cancel
        </Button>
        <Button
          disabled={!validInput()}
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
