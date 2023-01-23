import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2'
import { Stack } from '@mui/system';
import Contact from '../../shared/client/Contact';
import Visits from '../../shared/visit/Visits';
import Notes from '../../shared/note/Notes';
import JobDetails from './JobDetails';
import { getJob } from '../../api/job.api';
import { useParams } from 'react-router-dom';
import { Alert, CircularProgress } from '@mui/material';
import Property from '../../shared/property/Property';

function Job(props: any) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [job, setJob] = useState({} as any);
    let { id } = useParams();

    useEffect(() => {
        getJob(id)
        .then(res => {
            setJob(res);
            setIsLoaded(true);
        }, (err) => {
            setError(err.message);
            setIsLoaded(true);
        })
    }, [id])


    if (error) {
        return (<Alert severity="error">{error}</Alert>);
        }
    if (!isLoaded) {
        return (<CircularProgress />);
        }
    
    return (
        <Grid container spacing={2}>
            <Grid xs={8}>
                <Stack spacing={2}>
                    <JobDetails job={job} setJob={setJob} success={props.success}/>
                    <Property property={job.job.property} success={props.success}/>
                </Stack>
            </Grid>
            <Grid xs={4}>
                <Stack spacing={2}>
                    <Contact client={job?.job.client} success={props.success}/>
                    <Visits client={job?.job.client} success={props.success}/>
                    <Notes client={job?.job.client} success={props.success}/>
                </Stack>
            </Grid>
        </Grid>
    )
}

export default Job;