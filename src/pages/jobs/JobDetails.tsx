import {
  AddCircleOutlineOutlined,
  AttachMoneyOutlined,
  Check,
  ContentCopyOutlined,
  DeleteOutline,
  MoreVert,
  PersonOutline,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createInvoice, updateInvoice } from '../../api/invoice.api';
import { updateJob } from '../../api/job.api';
import ConfirmDelete from '../../shared/ConfirmDelete';
import Duplicate from '../../shared/Duplicate';
import EmptyState from '../../shared/EmptyState';
import RichText from '../../shared/RichText';

function add(accumulator: number, a: number) {
  return +accumulator + +a;
}

function JobItemSaved(props: any) {
  return (
    <Box sx={{ px: 4 }}>
      <Grid container spacing={2} marginTop={2}>
        <Grid item={true} xs={4}>
          <Stack spacing={1.5}>
            <Typography variant="body2" color="neutral.light" fontWeight={500}>
              Service
            </Typography>
            <Typography variant="body2" color="neutral.main" fontWeight={600}>
              {props.item.title}
            </Typography>
          </Stack>
        </Grid>
        <Grid item={true} xs={4}></Grid>
        <Grid item={true} xs={4}>
          <Stack spacing={1.5} alignItems="flex-end">
            <Typography variant="body2" color="neutral.light" fontWeight={500}>
              Total
            </Typography>
            <Typography variant="body2" color="neutral.main" fontWeight={600}>
              ${props.item.price}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Stack marginTop={3}>
        <Typography variant="body2" color="neutral.light">
          Description
        </Typography>
        <Divider />
        <Typography
          variant="body2"
          color="neutral.main"
          dangerouslySetInnerHTML={{ __html: props.item.description }}
        ></Typography>
      </Stack>
      <Divider />
    </Box>
  );
}

function JobItemEdit(props: any) {
  const handleChange = (event: any) => {
    let items = props.job.items;
    items.find((it: any) => it === props.item)[event.target.id] =
      event.target.value;
    props.setJob({
      ...props.job,
      items: items,
    });
  };

  const handleDeleteItem = () => {
    let job = props.job;
    let item = job.items.find((it: any) => it === props.item);
    let itemIndex = job.items.indexOf(item);
    let items = job.items
      .slice(undefined, itemIndex)
      .concat(job.items.slice(itemIndex + 1, undefined));
    props.setJob({
      ...props.job,
      items: items,
    });
  };

  return (
    <>
      <Grid container spacing={2} mt={1}>
        <Grid item={true} xs={4}>
          <TextField
            id="title"
            label="Service"
            error={!props.item.title?.trim()?.length}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline />
                </InputAdornment>
              ),
            }}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            value={props.item.title ? props.item.title : ''}
            onChange={handleChange}
            size="small"
          />
        </Grid>
        <Grid item={true} xs={4}></Grid>
        <Grid item={true} xs={4}>
          <Stack>
            <TextField
              id="price"
              label="Price"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline />
                  </InputAdornment>
                ),
              }}
              value={props.item.price ? props.item.price : ''}
              onChange={handleChange}
              size="small"
            />
          </Stack>
        </Grid>
      </Grid>
      <Stack spacing={1.5} mt={2}>
        <Typography variant="body2" color="neutral.main">
          Description
        </Typography>
        <RichText
          content={props.item.description ? props.item.description : ''}
          {...props}
          type="job"
        />
        <Button
          onClick={handleDeleteItem}
          startIcon={<DeleteOutline />}
          color="error"
          sx={{ alignSelf: 'flex-end' }}
        >
          Delete Item
        </Button>
      </Stack>
      <Divider sx={{ mt: 3, mb: 1 }} />
    </>
  );
}

function JobDetails(props: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);
  const [editting, setEditting] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleEditting = () => {
    if (editting) {
      setLoading(true);
      updateJob(props.job).then(
        (res) => {
          setLoading(false);
          props.success('Successfully updated job');
        },
        (err) => {
          setLoading(false);
          setError(err.message);
        }
      );
    }
    setEditting(!editting);
  };

  const handleCancel = () => {
    setEditting(false);
    props.setReload(!props.reload);
  };

  const handleAddItem = () => {
    let items = props.job.items;
    items.push({ price: 0 });
    props.setJob({
      ...props.job,
      items: items,
    });
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = (value: string) => {
    setDeleteOpen(false);
    closeMenu();
  };

  const onDelete = () => {
    navigate(`/jobs`);
  };

  const handleDuplicateJob = () => {
    setDuplicateOpen(true);
  };

  const handleClose = (value: string) => {
    setDuplicateOpen(false);
    setAnchorEl(null);
  };

  const markJobAs = (status: string) => {
    closeMenu();
    props.job.job.status = status;
    updateJob(props.job).then(
      (res) => {
        props.success('Status updated successfully');
      },
      (err) => {}
    );
  };

  const handleGenerateInvoice = () => {
    let invoice: any = {
      client: props.job.job.client,
      property: props.job.job.property,
      status: 'Draft',
      job: props.job.job.id,
      quote: props.job.job.quote,
    };
    createInvoice(invoice).then(
      (res) => {
        let updatingInvoice: any = {};
        updatingInvoice.invoice = invoice;
        updatingInvoice.invoice.id = res.id;
        updatingInvoice.items = props.job.items;
        updateInvoice(updatingInvoice).then(
          (_) => {
            props.job.job.invoice = res.id;
            updateJob(props.job).then(
              (res) => {},
              (err) => {}
            );
            navigate(`/invoices/${res.id}`);
            props.success('Successfully generated invoice');
          },
          (err) => {}
        );
      },
      (err: any) => {}
    );
  };

  return (
    <Stack spacing={2}>
      <Card sx={{ pb: 4, pt: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          marginBottom={2}
        >
          <Typography variant="h6" fontWeight={600}>
            {`Job #${props.job.job.id}`}
          </Typography>
          <IconButton onClick={openMenu} color="primary">
            <MoreVert />
          </IconButton>
          <Menu
            id="visit-menu"
            anchorEl={anchorEl}
            open={isOpen}
            onClose={closeMenu}
          >
            <MenuList>
              {props.job.job.status !== ('Complete' || 'Archived') && (
                <MenuItem onClick={() => markJobAs('Complete')}>
                  <ListItemIcon>
                    <Check />
                  </ListItemIcon>
                  <ListItemText>Mark as Complete</ListItemText>
                </MenuItem>
              )}
              <MenuItem onClick={handleGenerateInvoice}>
                <ListItemIcon>
                  <AttachMoneyOutlined />
                </ListItemIcon>
                <ListItemText>Generate Invoice</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleDuplicateJob}>
                <ListItemIcon>
                  <ContentCopyOutlined />
                </ListItemIcon>
                <ListItemText>Duplicate</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleDeleteOpen}>
                <ListItemIcon>
                  <DeleteOutline />
                </ListItemIcon>
                <ListItemText>Delete Job</ListItemText>
              </MenuItem>
            </MenuList>
          </Menu>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack spacing={2}>
            <Typography
              textAlign="center"
              variant="body2"
              fontWeight={500}
              color="neutral.light"
            >
              Created
            </Typography>
            <Typography textAlign="center" variant="body2">
              11/27/2022
            </Typography>
          </Stack>
          <Stack spacing={2}>
            <Typography
              textAlign="center"
              variant="body2"
              fontWeight={500}
              color="neutral.light"
            >
              From
            </Typography>
            {props.job.job.quote ? (
              <Link
                sx={{ textAlign: 'center' }}
                href={`/quotes/${props.job.job.quote}`}
              >
                Quote
              </Link>
            ) : (
              <Typography textAlign="center">-</Typography>
            )}
          </Stack>
          <Stack spacing={2}>
            <Typography
              textAlign="center"
              variant="body2"
              fontWeight={500}
              color="neutral.light"
            >
              Used for
            </Typography>
            {props.job.job.invoice ? (
              <Link
                sx={{ textAlign: 'center' }}
                href={`/invoices/${props.job.job.invoice}`}
              >
                Invoice
              </Link>
            ) : (
              <Typography textAlign="center">-</Typography>
            )}
          </Stack>
          <Stack spacing={1}>
            <Typography
              textAlign="center"
              variant="body2"
              fontWeight={500}
              color="neutral.light"
            >
              Status
            </Typography>
            <Chip label={props.job.job.status} color="success" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={{ py: 3 }}>
        {loading && <LinearProgress />}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" fontWeight={600}>
            Job Details
          </Typography>
          {editting ? (
            <Stack direction="row" spacing={2}>
              <Button onClick={handleCancel} variant="outlined">
                Cancel
              </Button>
              <Button onClick={handleEditting} variant="contained">
                Save Changes
              </Button>
            </Stack>
          ) : (
            <Button onClick={handleEditting} variant="contained">
              Edit Job
            </Button>
          )}
        </Stack>
        <Divider sx={{ mt: 3, mb: 1 }} />
        {editting && (
          <>
            {props.job.items.map((item: any, index: number) => (
              <JobItemEdit key={index} item={item} {...props} />
            ))}
            <Stack alignItems="center" my={2}>
              <Button
                onClick={handleAddItem}
                startIcon={<AddCircleOutlineOutlined />}
              >
                <Typography>Add Item</Typography>
              </Button>
            </Stack>
          </>
        )}
        {!editting && (
          <>
            {props.job.items.map((item: any, index: number) => (
              <JobItemSaved key={index} item={item} {...props} />
            ))}
            {props.job?.items?.length === 0 && <EmptyState type="job-items" />}
          </>
        )}
        <Grid container justifyContent="flex-end" mt={2.5}>
          <Grid item xs={4}>
            <Grid container>
              <Grid item xs={5}>
                <Typography variant="h6" color="primary" fontWeight={700}>
                  Subtotal
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6" fontWeight={600} color="neutral.main">
                  ${props.job.items.map((i: any) => i.price).reduce(add, 0)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {error && <Alert severity="error">{error}</Alert>}
        <ConfirmDelete
          open={deleteOpen}
          onClose={handleDeleteClose}
          type={'jobs'}
          deleteId={props.job.job.id}
          onDelete={onDelete}
          success={props.success}
        />
        <Duplicate
          open={duplicateOpen}
          onClose={handleClose}
          type={'Job'}
          job={props.job}
          success={props.success}
        />
      </Card>
    </Stack>
  );
}

export default JobDetails;
