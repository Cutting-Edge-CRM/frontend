import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputLabel,
    LinearProgress,
    Stack,
    Switch,
    TextField,
    useMediaQuery,
  } from '@mui/material';
  import * as React from 'react';
  import { AddressAutofill } from '@mapbox/search-js-react';
  import { useState } from 'react';
import { inviteUser, updateUser } from '../../api/user.api';
import { theme } from '../../theme/theme';
  
  export default function EditEmployee(props: any) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const handleCancel = () => {
      props.onClose();
      setError(null);
    };
    const handleSave = () => {
      setLoading(true);
      if (props.type === 'edit') {
        // save value
        updateUser({ ...props.employee }).then(
          (res) => {
            setLoading(false);
            handleCancel();
            props.success('Successfully updated employee');
            props.setReload(!props.reload);
          },
          (err) => {
            setLoading(false);
            setError(err.message);
          }
        );
      }
      if (props.type === 'new') {
        // save value
        inviteUser({ ...props.employee }).then(
          (res) => {
            setLoading(false);
            handleCancel();
            props.success('Successfully invited employee');
            props.setReload(!props.reload);
          },
          (err) => {
            setLoading(false);
            setError(err.message);
          }
        );
      }
    };
  
    const handleChange = (event: any) => {
      props.setEmployee({
        ...props.employee,
        [event.target.id]: event.target.value,
      });
    };

    const handleCheck = (event: any) => {
        props.setEmployee({
          ...props.employee,
          role: event.target.checked ? 'admin' : 'staff',
        });
      };
  
    return (
      <Dialog fullScreen={useMediaQuery(theme.breakpoints.down("sm"))} onClose={handleCancel} open={props.open}>
        <DialogTitle align="center">
          {props.type === 'edit' ? 'Edit Employee' : 'Create New Employee'}
        </DialogTitle>
        <DialogContent>
          {loading && <LinearProgress />}
          <Stack mt={2} >
            <Stack direction={'row'} spacing={2}>
                <Stack>
                    <InputLabel id="first-label" sx={{ color: 'primary.main' }}>
                    First Name
                    </InputLabel>
                    <TextField
                        id="first"
                        value={
                        props.employee?.first ? props.employee?.first : ''
                        }
                        onChange={handleChange}
                    />
                </Stack>
                <Stack>
                    <InputLabel id="last-label" sx={{ color: 'primary.main' }}>
                    Last Name
                    </InputLabel>
                    <TextField
                        id="last"
                        value={
                        props.employee?.last ? props.employee?.last : ''
                        }
                        onChange={handleChange}
                    />
                </Stack>
            </Stack>
            <InputLabel id="email-label" sx={{ color: 'primary.main' }}>
                Email
            </InputLabel>
            <TextField
                id="email"
                value={
                props.employee?.email ? props.employee?.email : ''
                }
                onChange={handleChange}
            />
            <Stack direction={'row'} spacing={2}>
                <Stack>
                    <InputLabel id="phone-label" sx={{ color: 'primary.main' }}>
                    Phone
                    </InputLabel>
                    <TextField
                        id="phone"
                        value={
                        props.employee?.phone ? props.employee?.phone : ''
                        }
                        onChange={handleChange}
                    />
                </Stack>
                <Stack>
                    <InputLabel id="phone-label" sx={{ color: 'primary.main' }}>
                        Admin
                    </InputLabel>
                    <Switch
                    id="admin"
                    checked={props.employee?.role === 'admin'}
                    onChange={handleCheck}
                    ></Switch>
                </Stack>
            </Stack>
            <form>
              <AddressAutofill accessToken={process.env.REACT_APP_MAPBOX_TOKEN as string}>
                <Stack spacing={2}>
                    <Stack direction={'row'} spacing={2}>
                        <Stack>
                        <InputLabel id="address-label" sx={{ color: 'primary.main' }}>
                            Address
                        </InputLabel>
                        <TextField
                            id="address"
                            autoComplete="street-address"
                            value={
                            props.employee?.address ? props.employee?.address : ''
                            }
                            onChange={handleChange}
                        />
                        <InputLabel id="city-label" sx={{ color: 'primary.main' }}>
                            City
                        </InputLabel>
                        <TextField
                            id="city"
                            autoComplete="address-level2"
                            value={props.employee?.city ? props.employee?.city : ''}
                            onChange={props.handleChangeProperty}
                        />
                        <InputLabel id="zip-label" sx={{ color: 'primary.main' }}>
                            Postal Code
                        </InputLabel>
                        <TextField
                            id="zip"
                            autoComplete="postal-code"
                            value={props.employee?.zip ? props.employee?.zip : ''}
                            onChange={handleChange}
                        />
                        </Stack>
                        <Stack>
                        <InputLabel id="unit-label" sx={{ color: 'primary.main' }}>
                            Unit
                        </InputLabel>
                        <TextField
                            id="address2"
                            value={
                            props.employee?.address2 ? props.employee?.address2 : ''
                            }
                            onChange={handleChange}
                        />
                        <InputLabel id="state-label" sx={{ color: 'primary.main' }}>
                            State/Province
                        </InputLabel>
                        <TextField
                            id="state"
                            autoComplete="address-level1"
                            value={
                            props.employee?.state ? props.employee?.state : ''
                            }
                            onChange={handleChange}
                        />
                        <InputLabel id="country-label" sx={{ color: 'primary.main' }}>
                            Country
                        </InputLabel>
                        <TextField
                            id="country"
                            autoComplete="country-name"
                            value={
                            props.employee?.country ? props.employee?.country : ''
                            }
                            onChange={handleChange}
                        />
                        </Stack>
                    </Stack>
                </Stack>
              </AddressAutofill>
            </form>
            </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} variant="outlined">
            Cancel
          </Button>
          {props.type === 'edit' &&
            <Button onClick={handleSave} variant="contained">
              Save Employee
            </Button>
          }
          {props.type === 'new' &&
            <Button onClick={handleSave} variant="contained">
              Invite Employee
            </Button>
          }
        </DialogActions>
        {error && <Alert severity="error">{error}</Alert>}
      </Dialog>
    );
  }
  