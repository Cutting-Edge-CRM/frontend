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
  } from '@mui/material';
  import * as React from 'react';
  import { AddressAutofill } from '@mapbox/search-js-react';
  import { useState } from 'react';
  
  export default function EditEmployee(props: any) {
    const [error] = useState(null);
    const [loading] = useState(false);
  
    const handleCancel = () => {
      props.onClose();
    };
    // const handleSave = () => {
    //   setLoading(true);
    //   if (props.modalType === 'edit') {
    //     // save value
    //     updateUser({ ...props.employee, client: props.client }).then(
    //       (res) => {
    //         setLoading(false);
    //         props.update(res);
    //         props.success('Successfully updated employee');
    //       },
    //       (err) => {
    //         setLoading(false);
    //         setError(err.message);
    //       }
    //     );
    //   }
    //   if (props.modalType === 'new') {
    //     // save value
    //     createUser({ ...props.employee, client: props.client }).then(
    //       (res) => {
    //         setLoading(false);
    //         props.create(res);
    //         props.success('Successfully created employee');
    //       },
    //       (err) => {
    //         setLoading(false);
    //         setError(err.message);
    //       }
    //     );
    //   }
    // };
  
    const handleChange = (event: any) => {
      props.setEmployee({
        ...props.employee,
        [event.target.id]: event.target.value,
      });
    };

    const handleCheck = (event: any) => {
        let options = props.quote.options;
        options
          .find((op: any) => op === props.option)
          .items.find((it: any) => it === props.item)[event.target.id] = event
          .target.checked
          ? 1
          : 0;
        props.setQuote({
          quote: props.quote.quote,
          options: options,
        });
      };
  
    return (
      <Dialog onClose={handleCancel} open={props.open}>
        <DialogTitle align="center">
          {props.modalType === 'edit' ? 'Edit Employee' : 'Create New Employee'}
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
                        defaultValue={
                        props.employee?.first ? props.employee?.first : undefined
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
                        defaultValue={
                        props.employee?.last ? props.employee?.last : undefined
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
                defaultValue={
                props.employee?.email ? props.employee?.email : undefined
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
                        defaultValue={
                        props.employee?.phone ? props.employee?.phone : undefined
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
                    checked={props.employee?.admin === 1}
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
                            defaultValue={
                            props.employee?.address ? props.employee?.address : undefined
                            }
                            onChange={handleChange}
                        />
                        <InputLabel id="city-label" sx={{ color: 'primary.main' }}>
                            City
                        </InputLabel>
                        <TextField
                            id="city"
                            autoComplete="address-level2"
                            defaultValue={props.employee?.city ? props.employee?.city : undefined}
                            onChange={props.handleChangeProperty}
                        />
                        <InputLabel id="zip-label" sx={{ color: 'primary.main' }}>
                            Postal Code
                        </InputLabel>
                        <TextField
                            id="zip"
                            autoComplete="postal-code"
                            defaultValue={props.employee?.zip ? props.employee?.zip : undefined}
                            onChange={handleChange}
                        />
                        </Stack>
                        <Stack>
                        <InputLabel id="unit-label" sx={{ color: 'primary.main' }}>
                            Unit
                        </InputLabel>
                        <TextField
                            id="address2"
                            defaultValue={
                            props.employee?.address2 ? props.employee?.address2 : undefined
                            }
                            onChange={handleChange}
                        />
                        <InputLabel id="state-label" sx={{ color: 'primary.main' }}>
                            State/Province
                        </InputLabel>
                        <TextField
                            id="state"
                            autoComplete="address-level1"
                            defaultValue={
                            props.employee?.state ? props.employee?.state : undefined
                            }
                            onChange={handleChange}
                        />
                        <InputLabel id="country-label" sx={{ color: 'primary.main' }}>
                            Country
                        </InputLabel>
                        <TextField
                            id="country"
                            autoComplete="country-name"
                            defaultValue={
                            props.employee?.country ? props.employee?.country : undefined
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
          {/* <Button onClick={handleSave} variant="contained">
            Save Changes
          </Button> */}
        </DialogActions>
        {error && <Alert severity="error">{error}</Alert>}
      </Dialog>
    );
  }
  