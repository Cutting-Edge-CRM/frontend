import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2'
import Contact from '../../shared/client/Contact';
import Notes from '../../shared/note/Notes';
import JobDetails from './JobDetails';
import { getJob } from '../../api/job.api';
import { useParams } from 'react-router-dom';
import { Alert, Box, CircularProgress } from '@mui/material';
import Property from '../../shared/property/Property';
import Timeline from '../../shared/timeline/Timeline';
import Visits from '../../shared/visit/Visits';

function Job(props: any) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [job, setJob] = useState({} as any);
    let { id } = useParams();
    const [reload, setReload] = useState(false);


    useEffect(() => {
        getJob(id)
        .then(res => {
            setJob(res);
            setIsLoaded(true);
        }, (err) => {
            setError(err.message);
            setIsLoaded(true);
        })
    }, [id, reload])


    if (error) {
        return (<Alert severity="error">{error}</Alert>);
        }
    if (!isLoaded) {
        return (<Box textAlign='center'><CircularProgress /></Box>);
        }
    
    return (
        <>
        <Grid container spacing={2} sx={{width: "100%", margin: 0}}>
          <Grid xs={12} md={8} spacing={2}>
          <Grid container>
              <Grid xs={12}>
              <JobDetails job={job} setJob={setJob} success={props.success} setReload={setReload} reload={reload}/>
              </Grid>
              <Grid xs={12}>
              <Property property={job.job.property} success={props.success}/>
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={12} md={4} spacing={2}>
          <Grid container>
              <Grid xs={12}>
              <Contact client={job?.job.client} success={props.success}/>
              </Grid>
            <Grid xs={12} sm={6} md={12}>
                <Visits client={job?.job.client} job={job} success={props.success} subscription={props.subscription} />
            </Grid>
            <Grid xs={12} sm={6} md={12}>
                <Notes client={job.job?.client} success={props.success}/>
            </Grid>
            <Grid xs={12} sm={6} md={12}>
                <Timeline client={job.job?.client} resourceType='job' resourceId={job.job?.id} />
            </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
      );
}

export default Job;