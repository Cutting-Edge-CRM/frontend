import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { listJobs } from '../../api/job.api';
import Table from '../../shared/Table'
import { jobColumns } from '../../util/columns';

function Jobs() {
  const [rows, setRows] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(10);

  useEffect(() => {
    listJobs(undefined, undefined, page, pageSize)
    .then((result) => {
      setIsLoaded(true);
      setRows(result?.rows);
      setRowCount(result?.rowCount?.[0]?.rowCount);
    }, (err) => {
      setIsLoaded(true);
      setError(err.message)
    })
  }, [page, pageSize])

  if (error) {
    return (<Typography>{error}</Typography>);
  }
  if (!isLoaded) {
    return (<Typography>Loading...</Typography>);
  }
  
    return (
        
        <Box>
          <Table 
          rows={rows} 
          columns={jobColumns} 
          type="Jobs" 
          title="Jobs"
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          rowCount={rowCount}
          ></Table>
      </Box>
    )
}

export default Jobs;