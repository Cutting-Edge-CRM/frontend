import {
  AddCircleOutlineOutlined,
  CalendarMonthOutlined,
  CreateOutlined,
  DeleteOutline,
  MoreVert,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemProps,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { listUsers } from '../../api/user.api';
import { listVisits } from '../../api/visit.api';
import EditVisit from './EditVisit';
import dayjs from 'dayjs';
import ConfirmDelete from '../ConfirmDelete';
import EmptyState from '../EmptyState';
import { currentUserClaims } from '../../auth/firebase';

const StyledVisitContainer = styled(ListItem)<ListItemProps>(({ theme }) => ({
  backgroundColor: theme.palette.info.light,
  borderRadius: '10px',
  marginTop: theme.spacing(2),
  paddingRight: 0,
}));

function Visits(props: any) {
  const [rows, setRows] = useState([] as any);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visit, setVisit] = useState({} as any);
  const [type, setType] = useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);
  const [users, setUsers] = useState([] as any[]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>, visit: any) => {
    console.log(visit.start);
    setStartTime(visit.start?.split(' ')[1]);
    setEndTime(visit.end?.split(' ')[1]);
    setVisit(visit);
    setAnchorEl(event.currentTarget);
    setVisit({
      ...visit,
      users: users.filter((user) =>
        visit.users.some((obj: any) => obj.id === user.id)
      ),
    });
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleNewOpen = () => {
    setVisit({ users: [], property: '', anytime: true, type: "Estimate", notes: "" });
    setType('new');
    setOpen(true);
  };

  const handleEditOpen = () => {
    setType('edit');
    setOpen(true);
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleDeleteClose = (value: string) => {
    closeMenu();
    setDeleteOpen(false);
  };

  const handleUpdate = (value: string) => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleCreate = (value: string) => {
    setOpen(false);
  };

  const onDelete = () => {
    return;
  };

  useEffect(() => {
    listUsers().then(
      (result: any) => {
        setUsers(result);
      },
      (err) => {
        setError(err.message);
      }
    );
  }, []);

  useEffect(() => {
    listVisits(props.client, props.job?.job?.id).then(
      (result) => {
        setLoading(false);
        result = result.map((re: any) => {
          return {
            ...re,
            start: dayjs(re.start).format('YYYY-MM-DD HH:mm'),
            end: dayjs(re.end).format('YYYY-MM-DD HH:mm'),
          };
        });
        setRows(result);
      },
      (err) => {
        setLoading(false);
        setError(err.message);
      }
    );
  }, [props, open, deleteOpen]);

  if (props.subscription.subscription === 'basic' && !loading) {
    return(
      <Box borderRadius={'15px'} overflow={'hidden'}>
        <a href="/settings?tab=billing">
        <img src="https://res.cloudinary.com/dtjqpussy/image/upload/v1676492393/Visits_mgf9s5.png"
        width={'100%'} alt="upgrade for visits"></img>
        </a>
      </Box>
    );
  }

  return (
    <Card sx={{ py: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography fontWeight={600} fontSize={18}>
          Visits
        </Typography>
        {(currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner') &&
        <IconButton onClick={handleNewOpen} color="info">
          <AddCircleOutlineOutlined />
        </IconButton>
        }
      </Stack>
      {loading && <Box textAlign='center'><CircularProgress /></Box>}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <List>
          {rows.map((visit: any) => (
            <StyledVisitContainer key={visit.id}>
              <Grid container spacing={2}>
                <Grid item={true} xs={2} alignSelf="center">
                  <CalendarMonthOutlined color="primary" />
                </Grid>
                <Grid item={true} xs={8}>
                  <Stack>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ opacity: 0.7 }}
                    >
                      {visit.type}
                    </Typography>
                    <Typography variant="caption">{visit.address}</Typography>
                    {visit.unscheduled === (1 || true) ?
                      <Typography
                          color="primary"
                          variant="caption"
                          fontWeight={500}
                        >
                          Unscheduled
                        </Typography>
                    :
                    <>
                    {dayjs(visit.start).diff(dayjs(visit.end), 'hours') < 24 &&
                    dayjs(visit.start).diff(dayjs(visit.end), 'hours') > -24 ? (
                      // if start and end within 1 day of eachother
                      visit.anytime === (1 || true) ? (
                        // if anytime: Jan 13
                        <Typography
                          color="primary"
                          variant="caption"
                          fontWeight={500}
                        >
                          {dayjs(visit.start).format('MMM D')} - Anytime
                        </Typography>
                      ) : (
                        // if not anytime: Jan 13 4:30pm - 6:00pm
                        <Typography
                          color="primary"
                          variant="caption"
                          fontWeight={500}
                        >
                          {dayjs(visit.start).format('MMM D')}{' '}
                          {dayjs(visit.start).format('h:mma')} -{' '}
                          {dayjs(visit.end).format('h:mma')}
                        </Typography>
                      )
                    ) : (
                      // if start and end not within 1 day of eachother: Jan 13 - Jan 16
                      <Typography
                        color="primary"
                        variant="caption"
                        fontWeight={500}
                      >
                        {dayjs(visit.start).format('MMM D')} -{' '}
                        {dayjs(visit.end).format('MMM D')}
                      </Typography>
                    )}                    
                    </>
                    }
                    <Typography
                      variant="caption"
                      fontStyle="italic"
                      sx={{ opacity: 0.8 }}
                    >
                      {visit.users
                        .map((user: any) =>
                          user.name ? user.name : user.email
                        )
                        .join(', ')}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid
                  item={true}
                  xs={2}
                  display="flex"
                  alignItems="flex-start"
                  justifyContent="flex-end"
                >
                  {(currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner') &&
                  <IconButton
                    onClick={(e) => openMenu(e, visit)}
                    color="primary"
                  >
                    <MoreVert />
                  </IconButton>
                  }
                  <Menu
                    id="visit-menu"
                    anchorEl={anchorEl}
                    open={isOpen}
                    onClose={closeMenu}
                  >
                    <MenuList>
                      <MenuItem onClick={handleEditOpen}>
                        <ListItemIcon>
                          <CreateOutlined />
                        </ListItemIcon>
                        <ListItemText>Edit Visit</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={handleDeleteOpen}>
                        <ListItemIcon>
                          <DeleteOutline />
                        </ListItemIcon>
                        <ListItemText>Delete Visit</ListItemText>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Grid>
              </Grid>
            </StyledVisitContainer>
          ))}
          {rows.length === 0 && (
            <EmptyState type="visits"/>
          )}
        </List>
      )}
      <EditVisit
        visit={visit}
        setVisit={setVisit}
        open={open}
        onClose={handleClose}
        update={handleUpdate}
        create={handleCreate}
        type={type}
        users={users}
        client={props.client}
        startTime={startTime}
        endTime={endTime}
        setStartTime={setStartTime}
        setEndTime={setEndTime}
        success={props.success}
        job={props.job}
      />
      <ConfirmDelete
        open={deleteOpen}
        onClose={handleDeleteClose}
        type={'visits'}
        deleteId={visit.id}
        onDelete={onDelete}
        success={props.success}
      />
    </Card>
  );
}

export default Visits;
