import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { useCallback, useState, useReducer } from 'react';
import { useDropzone } from 'react-dropzone';
import { East, Description, Close } from '@mui/icons-material';
import { importClients } from '../../api/client.api';

export default function ImportClients(props: any) {
  const [activeStep, setActiveStep] = useState(0);
  const { onClose, selectedValue, open } = props;
  const [array, setArray] = useState([] as any[]);
  const [headers, setHeaders] = useState([] as any[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function reducer(state: any, newState: any) {
    return {
      ...state,
      ...newState,
    };
  }
  const [
    { first, last, phone, email, address, unit, city, country, state, zip },
    setAttributes,
  ] = useReducer(reducer, {
    first: 'Do not import',
    last: 'Do not import',
    phone: 'Do not import',
    email: 'Do not import',
    address: 'Do not import',
    unit: 'Do not import',
    city: 'Do not import',
    country: 'Do not import',
    state: 'Do not import',
    zip: 'Do not import',
  });

  const mappableFields = [
    {
      id: 'first',
      type: 'First Name',
      attr: first,
    },
    {
      id: 'last',
      type: 'Last Name',
      attr: last,
    },
    {
      id: 'phone',
      type: 'Primary Phone',
      attr: phone,
    },
    {
      id: 'email',
      type: 'Primary Email',
      attr: email,
    },
    {
      id: 'address',
      type: 'Address',
      attr: address,
    },
    {
      id: 'unit',
      type: 'Unit',
      attr: unit,
    },
    {
      id: 'city',
      type: 'City',
      attr: city,
    },
    {
      id: 'country',
      type: 'Country',
      attr: country,
    },
    {
      id: 'state',
      type: 'State',
      attr: state,
    },
    {
      id: 'zip',
      type: 'Postal',
      attr: zip,
    },
  ];

  const handleChange = (field: string, event: SelectChangeEvent<any>) => {
    switch (field) {
      case 'first':
        setAttributes({ first: event.target.value });
        break;
      case 'last':
        setAttributes({ last: event.target.value });
        break;
      case 'phone':
        setAttributes({ phone: event.target.value });
        break;
      case 'email':
        setAttributes({ email: event.target.value });
        break;
      case 'address':
        setAttributes({ address: event.target.value });
        break;
      case 'unit':
        setAttributes({ unit: event.target.value });
        break;
      case 'city':
        setAttributes({ city: event.target.value });
        break;
      case 'state':
        setAttributes({ state: event.target.value });
        break;
      case 'country':
        setAttributes({ country: event.target.value });
        break;
      case 'zip':
        setAttributes({ zip: event.target.value });
        break;
      default:
        break;
    }
  };

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleFinish = () => {
    setLoading(true);
    let importingClient = array.map((cl) => {
      return {
        first: cl[first]?.length > 0 ? cl[first] : undefined,
        last: cl[last]?.length > 0 ? cl[last] : undefined,
        phone: cl[phone]?.length > 0 ? cl[phone] : undefined,
        email: cl[email]?.length > 0 ? cl[email] : undefined,
        address: cl[address]?.length > 0 ? cl[address] : undefined,
        unit: cl[unit]?.length > 0 ? cl[unit] : undefined,
        city: cl[city]?.length > 0 ? cl[city] : undefined,
        state: cl[state]?.length > 0 ? cl[state] : undefined,
        country: cl[country]?.length > 0 ? cl[country] : undefined,
        zip: cl[zip]?.length > 0 ? cl[zip] : undefined,
      };
    });
    importClients(importingClient).then(
      (res) => {
        setLoading(false);
        onClose(selectedValue);
        props.success('Imported clients successfully');
      },
      (err) => {
        setLoading(false);
        setError(err.message);
      }
    );
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const fileReader = new FileReader();

    const csvFileToArray = (string: string) => {
      const csvHeader = string
        .slice(0, string.indexOf('\n'))
        .replace(/[\n\r]+/g, '')
        .split(',');
      setHeaders(csvHeader);
      const csvRows = string
        .slice(string.indexOf('\n') + 1)
        .replace(/[\r]+/g, '')
        .split('\n');

      const array = csvRows.map((i) => {
        const values = i.split(',');
        const obj = csvHeader.reduce((object: any, header, index) => {
          object[header] = values[index];
          return object;
        }, {});
        return obj;
      });

      setArray(array);
    };

    if (acceptedFiles[0]) {
      fileReader.onload = function (event: any) {
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      accept: {
        'text/csv': ['.csv'],
      },
      maxFiles: 1,
      onDrop,
    });

  const deleteFile = () => {
    acceptedFiles.pop();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle align="center">Set backup account</DialogTitle>
      <DialogContent>
        {loading && <LinearProgress />}
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep}>
            <Step>
              <StepLabel>Upload CSV</StepLabel>
            </Step>
            <Step>
              <StepLabel>Upload CSV</StepLabel>
            </Step>
          </Stepper>
          <Box mt={2}>
            {activeStep === 0 ? (
              <Box
                {...getRootProps()}
                sx={{
                  backgroundColor: 'default.light',
                  borderRadius: '10px',
                  p: 2,
                  cursor: 'pointer',
                  border: '1px dashed',
                  borderColor: 'default.main',
                  minHeight: 210,
                  minWidth: 500,
                }}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <Typography variant="body2" color="default.main">
                    Drop the files here ...
                  </Typography>
                ) : acceptedFiles.length > 0 ? (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" color="default.main">
                      You are uploading {acceptedFiles[0].name}
                    </Typography>
                    <Close onClick={deleteFile} />
                  </Stack>
                ) : (
                  <Stack alignItems="center" spacing={1.5}>
                    <Description color="primary" fontSize="large" />
                    <Typography
                      textAlign="center"
                      variant="body2"
                      color="default.main"
                    >
                      Drag a CSV file here to upload. Ensure your file has
                      header labels. Acceptable file types: .csv
                    </Typography>
                    <Divider>
                      <Typography variant="body2" color="default.main">
                        Or
                      </Typography>
                    </Divider>
                    <Button>Browse files</Button>
                  </Stack>
                )}
              </Box>
            ) : (
              <Box>
                <List>
                  {mappableFields.map((mappableField) => (
                    <ListItem key={mappableField.id} sx={{ gap: 2 }}>
                      <Box>
                        <InputLabel id="field"></InputLabel>
                        <Select
                          labelId="field"
                          id={mappableField.id}
                          value={mappableField.attr}
                          onChange={(e) => handleChange(mappableField.id, e)}
                        >
                          <MenuItem value={'Do not import'}>
                            Do not import
                          </MenuItem>
                          {headers.map((header, index) => (
                            <MenuItem key={index} value={header}>
                              {header}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                      <East />
                      <Box>
                        <Typography>{mappableField.type}</Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        {activeStep === 1 ? (
          <Button onClick={handleFinish} variant="contained">
            Finish
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={acceptedFiles.length === 0}
            variant="contained"
          >
            Next
          </Button>
        )}
      </DialogActions>
      {error && <Alert severity="error">{error}</Alert>}
    </Dialog>
  );
}
