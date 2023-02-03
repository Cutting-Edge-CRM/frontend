import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List, { ListProps } from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
  AttachMoney,
  FormatPaintOutlined,
  PeopleOutlineOutlined,
  CalendarMonthOutlined,
  TrendingUpOutlined,
  SellOutlined,
  AccessTimeOutlined,
  SummarizeOutlined,
  SettingsOutlined,
  Settings as SettingsIcon,
  Search,
  ArrowDropDown,
  NotificationsNone,
} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {
  Alert,
  Avatar,
  InputAdornment,
  ListItemButton,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  styled,
  TextField,
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import Dashboard from '../dashboard/Dashboard';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Clients from '../clients/Clients';
import Quotes from '../quotes/Quotes';
import Jobs from '../jobs/Jobs';
import Invoices from '../invoices/Invoices';
import { logout } from '../../auth/firebase';
import Client from '../clients/Client';
import Quote from '../quotes/Quote';
import Job from '../jobs/Job';
import Invoice from '../invoices/Invoice';
import Schedule from '../schedule/Schedule';
import { useEffect } from 'react';
import { getSettings } from '../../api/settings.api';
import CompanySettings from '../settings/CompanySettings';

const NavList = styled(List)<ListProps>(({ theme }) => ({
  padding: theme.spacing(0, 3),
  '& .MuiListItem-root': {
    marginTop: theme.spacing(0.5),
  },
  '&& .Mui-selected, && .Mui-selected:hover': {
    backgroundColor: theme.palette.primary.main,
    '&, & .MuiListItemIcon-root': {
      color: 'white',
    },
  },
  '&, & .MuiListItemButton-root': {
    borderRadius: '8px',
  },
  '&, & .MuiListItemIcon-root': {
    color: theme.palette.text.primary,
    minWidth: '40px',
  },
}));

const drawerWidth = 270;
const topTabs = [
  { display: 'Dashboard', slug: 'dashbaord', icon: <TrendingUpOutlined /> },
  { display: 'Schedule', slug: 'schedule', icon: <CalendarMonthOutlined /> },
  { display: 'Clients', slug: 'clients', icon: <PeopleOutlineOutlined /> },
  { display: 'Quotes', slug: 'quotes', icon: <SellOutlined /> },
  { display: 'Jobs', slug: 'jobs', icon: <FormatPaintOutlined /> },
  { display: 'Invoices', slug: 'invoices', icon: <AttachMoney /> },
  { display: 'Timesheets', slug: 'timesheets', icon: <AccessTimeOutlined /> },
];
const middleTabs = [
  { display: 'Reports', slug: 'reports', icon: <SummarizeOutlined /> },
  { display: 'Settings', slug: 'settings', icon: <SettingsOutlined /> },
];
const bottomTabs = [{ display: 'Log out', slug: 'dashbaord', icon: <Logout /> }];

function Shell() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settings, setSettings] = useState({} as any);
  const location = useLocation();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const success = (message: string) => {
    setSuccessMessage(message);
    setSuccessOpen(true);
  };

  const handleSuccessClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSuccessOpen(false);
  };

  useEffect(() => {
    getSettings().then(
      (res) => {
        setSettings(res);
      },
      (err) => {
        console.error(err.message);
      }
    );
  }, []);

  const drawer = (
    <Stack height="100%">
      <Toolbar>
        <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>CE</Avatar>
        <Typography variant="h6" noWrap component="div" fontWeight={600}>
          CuttingEdge CRM
        </Typography>
      </Toolbar>
      <Stack justifyContent="space-around" height="100%">
        <NavList>
          {topTabs.map((tab, index) => (
            <ListItem key={tab.display} disablePadding>
              <ListItemButton
                component={Link}
                to={topTabs[index].slug}
                selected={location.pathname.includes(topTabs[index].slug)}
              >
                <ListItemIcon>{tab.icon}</ListItemIcon>
                <ListItemText
                  primary={tab.display}
                  primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </NavList>
        <NavList>
          {middleTabs.map((tab, index) => (
            <ListItem key={tab.display} disablePadding>
              <ListItemButton
                component={Link}
                to={middleTabs[index].slug}
                selected={location.pathname.includes(middleTabs[index].slug)}
              >
                <ListItemIcon>{tab.icon}</ListItemIcon>
                <ListItemText
                  primary={tab.display}
                  primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </NavList>
        <NavList>
          {bottomTabs.map((tab, index) => (
            <ListItem key={tab.display} disablePadding>
              <ListItemButton
                component={Link}
                to={bottomTabs[index].slug}
                selected={location.pathname.includes(bottomTabs[index].slug)}
              >
                <ListItemIcon>{tab.icon}</ListItemIcon>
                <ListItemText
                  primary={tab.display}
                  primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </NavList>
      </Stack>
    </Stack>
  );

  return (
    // toolbar

    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: 'none',
        }}
        color="inherit"
      >
        <Toolbar
          sx={{ display: 'flex', justifyContent: 'space-between', mx: '8px' }}
        >
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <TextField
            size="small"
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <Stack direction="row" alignItems="center" spacing={3}>
            <IconButton sx={{ borderRadius: '50%' }}>
              <NotificationsNone color="primary" />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar
                sx={{ width: '40px', height: '40px', bgcolor: 'primary.main' }}
              >
                NW
              </Avatar>
              <Typography
                variant="body2"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                White Mountain Painting
              </Typography>
              <IconButton onClick={handleClick} size="small">
                <ArrowDropDown color="primary" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem>
                  <Avatar /> Profile
                </MenuItem>
                <Divider />
                <MenuItem>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem onClick={logout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* sidebar */}

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          PaperProps={{ elevation: 2 }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRadius: '15px',
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          PaperProps={{ elevation: 2 }}
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRadius: '15px',
              border: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />

        {/* body */}
        <Routes>
          <Route path="/dashboard" element={<Dashboard success={success} />} />
          <Route path="/schedule" element={<Schedule success={success} />} />
          <Route path="/clients" element={<Clients success={success} />} />
          <Route path="/clients/:id" element={<Client success={success} />} />
          <Route path="/quotes" element={<Quotes success={success} />} />
          <Route
            path="/quotes/:id"
            element={<Quote success={success} settings={settings} />}
          />
          <Route path="/jobs" element={<Jobs success={success} />} />
          <Route path="/jobs/:id" element={<Job success={success} />} />
          <Route path="/invoices" element={<Invoices success={success} />} />
          <Route
            path="/invoices/:id"
            element={<Invoice success={success} settings={settings} />}
          />
          <Route path="/settings" element={<CompanySettings success={success} />} />
          <Route path="/" element={<Dashboard success={success} />} />
        </Routes>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={successOpen}
          autoHideDuration={4000}
          onClose={handleSuccessClose}
        >
          <Alert
            onClose={handleSuccessClose}
            severity="success"
            sx={{ width: '100%' }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default Shell;
