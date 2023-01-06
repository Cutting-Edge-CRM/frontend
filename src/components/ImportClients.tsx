import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, InputLabel, List, ListItem, MenuItem, Select, SelectChangeEvent, Step, StepLabel, Stepper, Typography } from '@mui/material';
import * as React from 'react';
import { useCallback, useState, useReducer } from 'react';
import { useDropzone } from 'react-dropzone';
import { East, Description, Close } from '@mui/icons-material';

export interface ImportClientsProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
  }
  
export default function ImportClients(props: ImportClientsProps) {
    const [activeStep, setActiveStep] = useState(0);
    const { onClose, selectedValue, open } = props;

    function reducer(state: any, newState: any) {
        return {
            ...state, ...newState
        }
    }
    const [{
        first,
        last,
        phone1,
        phone2,
        email1,
        email2,
        address,
        unit,
        city,
        country,
        region,
        zip,
    }, setAttributes] = useReducer(reducer, {
        first: "Do not import",
        last: "Do not import",
        phone1: "Do not import",
        phone2: "Do not import",
        email1: "Do not import",
        email2: "Do not import",
        address: "Do not import",
        unit: "Do not import",
        city: "Do not import",
        country: "Do not import",
        region: "Do not import",
        zip: "Do not import",
    });
    
    const mappableFields = [
        {
            id: "first",
            type: "First Name",
            attr: first
        },
        { 
            id: "last",
            type: "Last Name",
            attr: last
        },
        { 
            id: "phone1",
            type: "Primary Phone",
            attr: phone1
        },
        { 
            id: "phone2",
            type: "Secondary Phone",
            attr: phone2
        },
        { 
            id: "email1",
            type: "Primary Email",
            attr: email1
        },
        { 
            id: "email2",
            type: "Secondary Email",
            attr: email2
        },
        { 
            id: "address",
            type: "Address",
            attr: address
        },
        { 
            id: "unit",
            type: "Unit",
            attr: unit
        },
        { 
            id: "city",
            type: "City",
            attr: city
        },
        { 
            id: "country",
            type: "Country",
            attr: country
        },
        { 
            id: "region",
            type: "State",
            attr: region
        },
        { 
            id: "zip",
            type: "Postal",
            attr: zip
        },
    ]

    const handleChange = (field: string, event: SelectChangeEvent<any>) => {
        switch (field) {
            case "first":
                setAttributes({ first: event.target.value})
                break;
            case "last":
                setAttributes({ last: event.target.value})
                break;
            case "phone1":
                setAttributes({ phone1: event.target.value})
                break;
            case "phone2":
                setAttributes({ phone2: event.target.value})
                break;
            case "email1":
                setAttributes({ email1: event.target.value})
                break;
            case "email2":
                setAttributes({ email2: event.target.value})
                break;
            case "address":
                setAttributes({ address: event.target.value})
                break;
            case "unit":
                setAttributes({ unit: event.target.value})
                break;
            case "city":
                setAttributes({ city: event.target.value})
                break;
            case "region":
                setAttributes({ region: event.target.value})
                break;
            case "country":
                setAttributes({ country: event.target.value})
                break;
            case "zip":
                setAttributes({ zip: event.target.value})
                break;    
            default:
                break;
        }
    };
  
    const handleClose = () => {
      onClose(selectedValue);
    };
  
    const handleNext = () => {  
      setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
      }, [])

    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
        accept: {
          'text/csv': ['.csv'],
        },
        maxFiles:1,
        onDrop})

    const deleteFile = () => {
        acceptedFiles.pop();
    }

    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Set backup account</DialogTitle>
        <DialogContent>
        <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        <Step>
            <StepLabel>Upload CSV</StepLabel>
        </Step>
        <Step>
            <StepLabel>Upload CSV</StepLabel>
        </Step>
      </Stepper>
        <React.Fragment>
            {activeStep === 0 ? (
                <Box {...getRootProps()}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                    (<Typography>Drop the files here ...</Typography>) :
                    acceptedFiles.length > 0 ?
                    
                    (<>
                    <Close onClick={deleteFile} />
                    <Typography>You are uploading {acceptedFiles[0].name}</Typography>
                    </>) :
                    (<>
                    <Description/>
                    <Typography>Drag a CSV file here to upload</Typography>
                    <Divider>Or</Divider>
                    <Button>Browse files</Button>
                    </>)
                }
                </Box>
            ) : (
                <Box>
                    <List>
                        {mappableFields.map(mappableField => (
                            <ListItem key={mappableField.id}>
                                <Box>
                                    <InputLabel id="field"></InputLabel>
                                    <Select
                                        labelId='field'
                                        id={mappableField.id}
                                        value={mappableField.attr}
                                        onChange={(e) => handleChange(mappableField.id, e)}
                                    >
                                        {/* loop through csv columns */}
                                        <MenuItem value={"Do not import"}>Do not import</MenuItem>
                                        <MenuItem value={0}>Twenty</MenuItem>
                                        <MenuItem value={1}>Thirty</MenuItem>
                                    </Select>
                                </Box>
                                <East/>
                                <Box>
                                    <Typography>{mappableField.type}</Typography>
                                </Box>
                        </ListItem>
                        ))}
                    </List>
                </Box>
            )}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === 1 ? (
            <Button
            onClick={handleClose}>
                Finish
            </Button>
            ) : (
            <Button
            onClick={handleNext}
            disabled={acceptedFiles.length === 0}>
                Next
            </Button>
            )}
          </Box>
        </React.Fragment>
    </Box>
        </DialogContent>
      </Dialog>
    );
  }
  