import { Box, Card, Divider, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { quoteColumns, jobColumns, invoiceColumns } from '../../util/columns';
import { listQuotes } from '../../api/quote.api';
import { listJobs } from '../../api/job.api';
import { listInvoices } from '../../api/invoice.api';
import TabbedTable from './TabbedTable';

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

function TabbedSummary(props: any) {
    const [value, setValue] = useState(0);
    const [quoteRows, setQuoteRows] = useState([]);
    const [quotesAreLoading, setQuotesAreLoading] = useState(true);
    const [quotesError, setQuotesError] = useState(null);
    const [jobRows, setJobRows] = useState([]);
    const [jobsAreLoading, setJobsAreLoading] = useState(true);
    const [jobsError, setJobsError] = useState(null);
    const [invoiceRows, setInvoiceRows] = useState([]);
    const [invoicesAreLoading, setInvoicesAreLoading] = useState(true);
    const [invoicesError, setInvoicesError] = useState(null);
  
    useEffect(() => {
      listQuotes(props.client)
      .then((result) => {
        setQuotesAreLoading(false);
        setQuoteRows(result?.rows)
      }, (err) => {
        setQuotesAreLoading(false);
        setQuotesError(err.message)
      })
      listJobs(props.client)
      .then((result) => {
        setJobsAreLoading(false);
        setJobRows(result?.rows)
      }, (err) => {
        setJobsAreLoading(false);
        setJobsError(err.message)
      })
      listInvoices(props.client)
      .then((result) => {
        setInvoicesAreLoading(false);
        setInvoiceRows(result?.rows)
      }, (err) => {
        setInvoicesAreLoading(false);
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
            <Tabs value={value} onChange={handleChange}>
                <Tab label="Quotes" id="quotes" />
                <Tab label="Jobs" id="jobs" />
                <Tab label="Invoices" id="invoices" />
            </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <TabbedTable rows={quoteRows} columns={quoteColumns} type="Quotes" title={null} client={props.client} success={props.success} errorListing={quotesError} loadingList={quotesAreLoading}></TabbedTable>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <TabbedTable rows={jobRows} columns={jobColumns} type="Jobs" title={null} client={props.client} success={props.success} errorListing={jobsError} loadingList={jobsAreLoading}></TabbedTable>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <TabbedTable rows={invoiceRows} columns={invoiceColumns} type="Invoices" title={null}client={props.client} success={props.success} errorListing={invoicesError} loadingList={invoicesAreLoading}></TabbedTable>
            </TabPanel>
        </Card>
    )
}

export default TabbedSummary;