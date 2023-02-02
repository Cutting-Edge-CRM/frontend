import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2'
import { Stack } from '@mui/system';
import Contact from '../../shared/client/Contact';
import Visits from '../../shared/visit/Visits';
import Notes from '../../shared/note/Notes';
import JobDetails from './JobDetails';
import { getJob } from '../../api/job.api';
import { useParams } from 'react-router-dom';
import { Alert, Box, CircularProgress } from '@mui/material';
import Property from '../../shared/property/Property';
import Timeline from '../../shared/timeline/Timeline';

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
        <Grid container spacing={2}>
            <Grid xs={8}>
                <Stack spacing={2}>
                    <JobDetails job={job} setJob={setJob} success={props.success} setReload={setReload} reload={reload}/>
                    <Property property={job.job.property} success={props.success}/>
                </Stack>
            </Grid>
            <Grid xs={4}>
                <Stack spacing={2}>
                    <Contact client={job?.job.client} success={props.success}/>
                    <Visits client={job?.job.client} success={props.success}/>
                    <Timeline client={job.job?.client} resourceType='job' resourceId={job.job?.id} />
                    <Notes client={job?.job.client} success={props.success}/>
                </Stack>
            </Grid>
        </Grid>
    )
}

export default Job;