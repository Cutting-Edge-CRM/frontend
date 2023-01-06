import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { listJobs } from '../../api/job.api';
import Table from '../../components/Table'
import { jobColumns } from '../../util/columns';

function Jobs() {
  const [rows, setRows] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    listJobs()
    .then((result) => {
      setIsLoaded(true);
      setRows(result)
    }, (err) => {
      setIsLoaded(true);
      setError(err.message)
    })
  }, [])

  if (error) {
    return (<Typography>{error}</Typography>);
  }
  if (!isLoaded) {
    return (<Typography>Loading...</Typography>);
  }
  
    return (
        
        <Box>
          <Table rows={rows} columns={jobColumns} type="Jobs" title="Jobs"></Table>
      </Box>
    )
}

export default Jobs;