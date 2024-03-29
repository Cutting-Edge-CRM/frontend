import React, { useState } from 'react';
import TabbedSummary from './TabbedSummary';
import Properties from '../../shared/property/Properties';
import Grid from '@mui/material/Unstable_Grid2';
import Contact from '../../shared/client/Contact';
import Visits from '../../shared/visit/Visits';
import Notes from '../../shared/note/Notes';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, useMediaQuery } from '@mui/material';
import ConfirmDelete from '../../shared/ConfirmDelete';
import Timeline from '../../shared/timeline/Timeline';
import { theme } from '../../theme/theme';

function Client(props: any) {
  let { id } = useParams();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    setDeleteOpen(false);
    navigate('/clients');
  };

  const handleDeleteClose = (value: string) => {
    setDeleteOpen(false);
  };

  return (
    <>
    <Grid container spacing={2} sx={{width: "100%", margin: 0}}>
      <Grid xs={12} md={8} spacing={2}>
      <Grid container>
          {useMediaQuery(theme.breakpoints.down("sm")) &&
            <Grid xs={12}>
            <Contact client={id} success={props.success} />
            </Grid>
          }
          <Grid xs={12}>
            <Properties type="client" client={id} success={props.success} reload={reload} setReload={setReload} />
          </Grid>
          <Grid xs={12}>
            <TabbedSummary client={id} success={props.success} reload={reload} setReload={setReload}/>
          </Grid>
        </Grid>
      </Grid>
      <Grid xs={12} md={4} spacing={2}>
      <Grid container>
        {!useMediaQuery(theme.breakpoints.down("sm")) &&
          <Grid xs={12}>
          <Contact client={id} success={props.success} reload={reload} setReload={setReload}/>
          </Grid>
        }
        <Grid xs={12}>
          <Visits client={id} success={props.success} subscription={props.subscription} reload={reload} setReload={setReload}/>
        </Grid>
        <Grid xs={12} sm={6} md={12}>
          <Notes client={id} success={props.success} />
        </Grid>
        <Grid xs={12} sm={6} md={12}>
          <Timeline client={id}/>
        </Grid>
        </Grid>
      </Grid>
      <ConfirmDelete
        open={deleteOpen}
        onClose={handleDeleteClose}
        onDelete={handleDelete}
        type={'clients'}
        deleteId={id}
        success={props.success}
      />
    </Grid>
    <Button
    onClick={handleDeleteOpen}
    color="error"
    sx={{ alignSelf: 'flex-start', mt: 3 }}
    >
    Delete Client
  </Button>
  </>
  );
}

export default Client;
