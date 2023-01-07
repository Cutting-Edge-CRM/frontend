import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2'
import { Stack } from '@mui/system';
import Contact from '../../components/Contact';
import Visits from '../../components/Visits';
import Notes from '../../components/Notes';
import JobDetails from '../../components/JobDetails';
import { getJob } from '../../api/job.api';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import Property from '../../components/Property';

function Job() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [job, setJob] = useState({} as any);
    let { id } = useParams();

    useEffect(() => {
        getJob(id)
        .then(res => {
            setJob(res.job);
            setIsLoaded(true);
        }, (err) => {
            setError(err.message);
            setIsLoaded(true);
        })
    }, [id])


    if (error) {
        return (<Typography>{error}</Typography>);
        }
    if (!isLoaded) {
        return (<Typography>Loading...</Typography>);
        }
    
    return (
        <Grid container spacing={2}>
            <Grid xs={8}>
                <Stack spacing={2}>
                    <JobDetails/>
                    <Property property={job.property} />
                </Stack>
            </Grid>
            <Grid xs={4}>
                <Stack spacing={2}>
                    <Contact/>
                    <Visits/>
                    <Notes />
                </Stack>
            </Grid>
        </Grid>
    )
}

export default Job;