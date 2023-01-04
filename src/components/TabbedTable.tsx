import { Box, Card, Divider, Tab, Tabs, Typography } from '@mui/material';
import React from 'react';
import Table from './Table';
import { quoteColumns, jobColumns, invoiceColumns } from '../util/columns';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
  
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <Box
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box>
            {children}
            </Box>
        )}
        </Box>
    );
}

function TabbedTable(props: any) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    return (
        <Card>
            <Typography>Overview</Typography>
            <Divider/>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Quotes" id="quotes" />
                <Tab label="Jobs" id="jobs" />
                <Tab label="Invoices" id="invoices" />
            </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Table rows={props.quoteRows} columns={quoteColumns} type="Quotes" title={null}></Table>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Table rows={props.jobRows} columns={jobColumns} type="Jobs" title={null}></Table>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Table rows={props.invoiceRows} columns={invoiceColumns} type="Invoices" title={null}></Table>
            </TabPanel>
        </Card>
    )
}

export default TabbedTable;