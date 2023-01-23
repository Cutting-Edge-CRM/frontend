import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { listJobs } from '../../api/job.api';
import Table from '../../shared/Table'
import { jobColumns } from '../../util/columns';

function Jobs(props: any) {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [jobsAreLoading, setJobsAreLoading] = useState(true);
  const [errorListingJobs, setErrorListingJobs] = useState(null);

  useEffect(() => {
    listJobs(undefined, undefined, page, pageSize)
    .then((result) => {
      setJobsAreLoading(false);
      setRows(result?.rows);
      setRowCount(result?.rowCount?.[0]?.rowCount);
    }, (err) => {
      setJobsAreLoading(false);
      setErrorListingJobs(err.message)
    })
  }, [page, pageSize])
  
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
          success={props.success}
          errorListing={errorListingJobs}
          listLoading={jobsAreLoading}
          ></Table>
      </Box>
    )
}

export default Jobs;