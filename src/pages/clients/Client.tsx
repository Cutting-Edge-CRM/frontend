import React, { useState } from 'react';
import TabbedSummary from './TabbedSummary';
import Properties from '../../shared/property/Properties';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/system';
import Contact from '../../shared/client/Contact';
import Visits from '../../shared/visit/Visits';
import Notes from '../../shared/note/Notes';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import ConfirmDelete from '../../shared/ConfirmDelete';

function Client(props: any) {
  let { id } = useParams();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();

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
    <Grid container spacing={2}>
      <Grid xs={8}>
        <Stack spacing={2}>
          <Properties type="client" client={id} success={props.success} />
          <TabbedSummary client={id} success={props.success} />
          <Button
            onClick={handleDeleteOpen}
            color="error"
            sx={{ alignSelf: 'flex-start' }}
          >
            Delete Client
          </Button>
        </Stack>
      </Grid>
      <Grid xs={4}>
        <Stack spacing={2}>
          <Contact client={id} success={props.success} />
          <Visits client={id} success={props.success} />
          <Notes client={id} success={props.success} />
        </Stack>
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
  );
}

export default Client;
