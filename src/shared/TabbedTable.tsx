import { Box, Card, Divider, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Table from './Table';
import { quoteColumns, jobColumns, invoiceColumns } from '../util/columns';
import { listQuotes } from '../api/quote.api';
import { listJobs } from '../api/job.api';
import { listInvoices } from '../api/invoice.api';

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
    const [value, setValue] = useState(0);
    const [quoteRows, setQuoteRows] = useState([]);
    const [quotesAreLoaded, setQuotesAreLoaded] = useState(false);
    const [quotesError, setQuotesError] = useState(null);
    const [jobRows, setJobRows] = useState([]);
    const [jobsAreLoaded, setJobsAreLoaded] = useState(false);
    const [jobsError, setJobsError] = useState(null);
    const [invoiceRows, setInvoiceRows] = useState([]);
    const [invoicesAreLoaded, setInvoicesAreLoaded] = useState(false);
    const [invoicesError, setInvoicesError] = useState(null);
  
    useEffect(() => {
      listQuotes(props.client)
      .then((result) => {
        setQuotesAreLoaded(true);
        setQuoteRows(result)
      }, (err) => {
        setQuotesAreLoaded(true);
        setQuotesError(err.message)
      })
      listJobs(props.client)
      .then((result) => {
        setJobsAreLoaded(true);
        setJobRows(result)
      }, (err) => {
        setJobsAreLoaded(true);
        setJobsError(err.message)
      })
      listInvoices(props.client)
      .then((result) => {
        setInvoicesAreLoaded(true);
        setInvoiceRows(result)
      }, (err) => {
        setInvoicesAreLoaded(true);
        setInvoicesError(err.message)
      })
    }, [props.client])
  

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
                {quotesError && <Typography>{quotesError}</Typography>}
                {!quotesAreLoaded && <Typography>Loading...</Typography>}
                {quotesAreLoaded && !quotesError && <Table rows={quoteRows} columns={quoteColumns} type="Quotes" title={null} client={props.client}></Table>}
            </TabPanel>
            <TabPanel value={value} index={1}>
                {jobsError && <Typography>{jobsError}</Typography>}
                {!jobsAreLoaded && <Typography>Loading...</Typography>}
                {jobsAreLoaded && !jobsError && <Table rows={jobRows} columns={jobColumns} type="Jobs" title={null} client={props.client} ></Table>}
            </TabPanel>
            <TabPanel value={value} index={2}>
                {invoicesError && <Typography>{invoicesError}</Typography>}
                {!invoicesAreLoaded && <Typography>Loading...</Typography>}
                {invoicesAreLoaded && !invoicesError && <Table rows={invoiceRows} columns={invoiceColumns} type="Invoices" title={null}client={props.client} ></Table>}
            </TabPanel>
        </Card>
    )
}

export default TabbedTable;