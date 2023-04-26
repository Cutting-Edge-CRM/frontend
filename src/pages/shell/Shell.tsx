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
  SellOutlined,
  AccessTimeOutlined,
  SettingsOutlined,
  Settings as SettingsIcon,
  Search,
  ArrowDropDown,
  WorkspacePremium,
  Info,
  Warning,
  AddCircleOutline,
  Close,
  TrendingUpOutlined,
} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {
  Alert,
  Avatar,
  Collapse,
  InputAdornment,
  ListItemButton,
  Menu,
  MenuItem,
  MenuList,
  Snackbar,
  Stack,
  styled,
  TextField,
  useMediaQuery,
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import Dashboard from '../dashboard/Dashboard';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Clients from '../clients/Clients';
import Quotes from '../quotes/Quotes';
import Jobs from '../jobs/Jobs';
import Invoices from '../invoices/Invoices';
import { logout, setSubscription } from '../../auth/firebase';
import Client from '../clients/Client';
import Quote from '../quotes/Quote';
import Job from '../jobs/Job';
import Invoice from '../invoices/Invoice';
import Schedule from '../schedule/Schedule';
import { useEffect } from 'react';
import { getSettings } from '../../api/settings.api';
import CompanySettings from '../settings/CompanySettings';
import Timesheets from '../timesheets/Timesheets';
import { listClients } from '../../api/client.api';
import { listQuotes } from '../../api/quote.api';
import { listJobs } from '../../api/job.api';
import { listInvoices } from '../../api/invoice.api';
import NewClient from '../../shared/client/NewClient';
import SelectPropertyAndClient from '../../shared/client/SelectPropertyAndClient';
import SelectClient from '../../shared/client/SelectClient';
import { theme } from '../../theme/theme';
import { getCompany } from '../../api/company.api';
import { getUser } from '../../api/user.api';
import { daysLeftInFreeTrial, isAllowed, isCanceled, isFreeTrial, pastDue } from '../../auth/FeatureGuards';
import NewEvent from '../../shared/NewEvent';
import GuardedRouteUser from '../../auth/GuardedRouteUser';

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

function Shell() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settings, setSettings] = useState({} as any);
  const location = useLocation();
  const [searchItems, setSearchItems] = useState([] as any);
  const [anchorElSearch, setAnchorElSearch] = React.useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorElSearch);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [quickCreateAnchor, setQuickCreateAnchor] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  let mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [company, setCompany] = useState({} as any);
  const [user, setUser] = useState({} as any);
  const [alertOpen, setAlertOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSubscription().then(res => {
      setLoading(false);
    }, err => {
      setLoading(false);
    })
  })

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
    getCompany()
    .then((result) => {
        setCompany(result);
    }, (err) => {
        // setLoading(false);
        // setError(err.message);
    })
    }, []);

    useEffect(() => {
      getUser()
      .then((result) => {
          setUser(result);
      }, (err) => {
      })
      }, []);

  const handleSearch = (event: any) => {
    let query = event.target.value;
    Promise.all([listClients(query, 0, 10), listQuotes(undefined, query, 0, 10), listJobs(undefined, query, 0, 10), listInvoices(undefined, query, 0, 10)])
    .then(([clients, quotes, jobs, invoices]) => {
      setAnchorElSearch(event.target);
      let results: any[] = [];
      results = results.concat(clients.rows.map((client: any) => {
        return {
          id: client.id,
          type: 'clients',
          row1: client.name,
          row2: client.contact,
          icon: (<PeopleOutlineOutlined color='primary' />)
        }
      }))
      results = results.concat(quotes.rows.map((quote: any) => {
        return {
          id: quote.id,
          type: 'quotes',
          row1: quote.clientName,
          row2: `$${quote.price}`,
          icon: (<SellOutlined color='primary' />)
        }
      }))
      results = results.concat(jobs.rows.map((job: any) => {
        return {
          id: job.id,
          type: 'jobs',
          row1: job.clientName,
          row2: `$${job.price}`,
          icon: (<FormatPaintOutlined color='primary' />)
        }
      }))
      results = results.concat(invoices.rows.map((invoice: any) => {
        return {
          id: invoice.id,
          type: 'invoices',
          row1: invoice.clientName,
          row2: `$${invoice.price}`,
          icon: (<AttachMoney color='primary' />)
        }
      }))
      results = results.slice(0,10);
      setSearchItems(results);
    }, (err) => {
    })
  }

  const closeMenu = () => {
    setAnchorElSearch(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setAnchorElSearch(null);
  }

  const handleQuickCreate = (e: any) => {
    setQuickCreateAnchor(e.target);
    setQuickCreateOpen(!quickCreateOpen);
  }

  const [newClientOpen, setNewClientOpen] = useState(false);
  const handleNewClient = () => {
    setNewClientOpen(true);
    setQuickCreateOpen(false);
  }
  const handleCloseClient = () => {
    setNewClientOpen(false);
  }
  const [newQuoteOpen, setNewQuoteOpen] = useState(false);
  const handleNewQuote = () => {
    setNewQuoteOpen(true);
    setQuickCreateOpen(false);
  }
  const handleCloseQuote = () => {
    setNewQuoteOpen(false);
  }
  const [newJobOpen, setNewJobOpen] = useState(false);
  const handleNewJob = () => {
    setNewJobOpen(true);
    setQuickCreateOpen(false);
  }
  const handleCloseJob = () => {
    setNewJobOpen(false);
  }
  const [newInvoiceOpen, setNewInvoiceOpen] = useState(false);
  const handleNewInvoice = () => {
    setNewInvoiceOpen(true);
    setQuickCreateOpen(false);
  }
  const handleCloseInvoice = () => {
    setNewInvoiceOpen(false);
  }
  const [newEventOpen, setNewEventOpen] = useState(false);
  const handleNewEvent = () => {
    setNewEventOpen(true);
    setQuickCreateOpen(false);
  }
  const handleCloseEvent = () => {
    setNewEventOpen(false);
  }

const drawerWidth = 270;
const topTabs = [
  { display: 'Dashboard', slug: 'dashboard', icon: <TrendingUpOutlined />, notAllowed: !isAllowed('view-dashboard') },
  { display: 'Schedule', slug: 'schedule', icon: <CalendarMonthOutlined />, premium: true },
  { display: 'Clients', slug: 'clients', icon: <PeopleOutlineOutlined /> },
  { display: 'Quotes', slug: 'quotes', icon: <SellOutlined /> },
  { display: 'Jobs', slug: 'jobs', icon: <FormatPaintOutlined /> },
  { display: 'Invoices', slug: 'invoices', icon: <AttachMoney /> },
  { display: 'Timesheets', slug: 'timesheets', icon: <AccessTimeOutlined />, premium: true },
];

const quickCreateTabs = [
  { display: 'Client', function: handleNewClient, icon: <PeopleOutlineOutlined color='primary' /> },
  { display: 'Quote', function: handleNewQuote, icon: <SellOutlined color='primary' /> },
  { display: 'Job', function: handleNewJob, icon: <FormatPaintOutlined color='primary' /> },
  { display: 'Invoice', function: handleNewInvoice, icon: <AttachMoney color='primary' /> },
]

const bottomTabs = [
  { display: 'Settings', slug: 'settings', icon: <SettingsOutlined /> },
];

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
        <Avatar sx={{ mr: 1 }} src="https://res.cloudinary.com/dtjqpussy/image/upload/v1679078662/Untitled_136_136_px_1_wz09on.png" sizes='small'>
        </Avatar>
        <Typography variant="h6" noWrap component="div" fontWeight={600}>
          Cutting Edge
        </Typography>
      </Toolbar>
      <Stack justifyContent="space-around" height="100%">
        <NavList>
          <ListItem disablePadding>
              <ListItemButton
                selected={quickCreateOpen}
                onClick={handleQuickCreate}
              >
                <ListItemIcon><AddCircleOutline/></ListItemIcon>
                <ListItemText
                  primary="Create"
                  primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
            {!mobile &&
            <Menu
            open={quickCreateOpen}
            anchorEl={quickCreateAnchor}
            onClose={handleQuickCreate}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
            >
              <Stack direction={'row'}>
                <MenuItem onClick={handleNewClient}>
                  <Stack alignItems={'center'}>
                    <PeopleOutlineOutlined color='primary'/>
                    <Typography>Client</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem onClick={handleNewQuote}>
                  <Stack alignItems={'center'}>
                    <SellOutlined color='primary'/>
                    <Typography>Quote</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem onClick={handleNewJob}>
                  <Stack alignItems={'center'}>
                    <FormatPaintOutlined color='primary'/>
                    <Typography>Job</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem onClick={handleNewInvoice}>
                  <Stack alignItems={'center'}>
                    <AttachMoney color='primary'/>
                    <Typography>Invoice</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem onClick={handleNewEvent}>
                  <Stack alignItems={'center'}>
                    <CalendarMonthOutlined color='primary'/>
                    <Typography>Event</Typography>
                  </Stack>
                </MenuItem>
              </Stack>
            </Menu>
            }
          {mobile && quickCreateOpen && quickCreateTabs.map((tab, index) => (
            <ListItem key={tab.display} disablePadding>
              <ListItemButton
                onClick={tab.function}
                sx={{paddingLeft: 5}}
              >
                <ListItemIcon>{tab.icon}</ListItemIcon>
                <ListItemText
                  primary={tab.display}
                  primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          {topTabs.map((tab, index) => (
            <ListItem key={tab.display} disablePadding sx={{display: tab.notAllowed ? 'none' : 'block'}}>
              <ListItemButton
                component={Link}
                to={topTabs[index].slug}
                selected={location.pathname.includes(topTabs[index].slug)}
                onClick={handleDrawerToggle}
              >
                <ListItemIcon>{tab.icon}</ListItemIcon>
                <ListItemText
                  primary={tab.display}
                  primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }}
                />
                {tab.premium && !isAllowed('team-feature') && <ListItemIcon><WorkspacePremium sx={{color: 'yellow.dark'}}/></ListItemIcon>}
              </ListItemButton>
            </ListItem>
          ))}
        </NavList>
        <NavList>
        </NavList>
        <NavList>
          {bottomTabs.map((tab, index) => (
            <ListItem key={tab.display} disablePadding>
              <ListItemButton
                component={Link}
                to={bottomTabs[index].slug}
                selected={location.pathname.includes(bottomTabs[index].slug)}
                onClick={handleDrawerToggle}
              >
                <ListItemIcon>{tab.icon}</ListItemIcon>
                <ListItemText
                  primary={tab.display}
                  primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
            <ListItem disablePadding>
              <ListItemButton
                onClick={logout}
              >
                <ListItemIcon><Logout/></ListItemIcon>
                <ListItemText
                  primary={"Logout"}
                  primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
        </NavList>
      </Stack>
    </Stack>
  );

  if (loading) {
    return (<></>);
  }

  return (
    // toolbar

    <Box sx={{ display: 'flex', backgroundColor: "#f4f5f7" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
          boxShadow: 'none',
          backgroundColor: "#f4f5f7"
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
            sx={{ mr: 2, display: { lg: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <TextField
            size="small"
            placeholder="Search"
            onChange={handleSearch}
            sx={{backgroundColor: "white", borderRadius: '20px'}}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <Menu
            id="search-menu"
            anchorEl={anchorElSearch}
            open={isOpen}
            onClose={closeMenu}
            sx={{".MuiList-root": {outline: "none"}}}
          >
            <MenuList>
              {searchItems.map((row: any, index: any) => (
                <ListItemButton key={index} onClick={() => handleNavigate(`/${row.type}/${row.id}`)}>
                  <ListItemIcon>
                    {row.icon}
                  </ListItemIcon>
                  <Stack>
                    <Typography>{row.row1}</Typography>
                    <Typography color={'neutral.light'}>{row.row2}</Typography>
                  </Stack>
                </ListItemButton>
              ))}
            </MenuList>
          </Menu>
          <Stack direction="row" alignItems="center" spacing={3} ml={1}>
            {/* <IconButton sx={{ borderRadius: '50%' }}>
              <NotificationsNone color="primary" />
            </IconButton>
            <Divider orientation="vertical" flexItem /> */}
              <Avatar
                sx={{ width: '40px', height: '40px', bgcolor: 'primary.main' }}
                src={company.logo}
              >
                <a href='/settings?tab=personal-details' style={{textDecoration: 'none', color: 'white'}}>
                {user.first && user.last ?
                  <>
                {user?.first?.[0]}
                {user?.last?.[0]}
                </>
                :
                company.companyName?.[0]
                }
                </a>
              </Avatar>
              <Typography
                variant="body2"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', lg: 'block' } }}
              >
                <a href='/settings?tab=company-info' style={{textDecoration: 'none', color: 'black'}}>
                {company.companyName}
                </a>
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
                <MenuItem onClick={() => handleNavigate(`/settings?tab=personal-details`)}>
                  <Avatar
                  sx={{ width: '40px', height: '40px', bgcolor: 'primary.main' }}
                >
                  {user.first || user.last ?
                    <>
                  {user?.first?.[0]}
                  {user?.last?.[0]}
                  </>
                  :
                  company.companyName?.[0]
                }
                </Avatar> Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleNavigate(`/settings`)}>
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
        </Toolbar>
        <Divider sx={{
          '&.MuiDivider-root': {
            border: `2px solid white`,
          },
          }}
          variant="middle"
          >
          </Divider>
      </AppBar>

      {/* sidebar */}

      <Box
        component="nav"
        sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
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
            display: { xs: 'block', lg: 'none' },
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
            display: { xs: 'none', lg: 'block' },
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
        sx={(theme) => ({
          flexGrow: 1,
          p: 3,
          [theme.breakpoints.down("sm")]: {
            p: 0,
          },
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
        })}
        
      >
        <Toolbar>
          <Collapse in={alertOpen} sx={{width: '100%', marginRight: '30px'}}>
          {isCanceled() && <Alert action={<IconButton onClick={() => setAlertOpen(false)}><Close fontSize="inherit" /></IconButton>} icon={<Info fontSize="inherit" sx={{color: 'blue.dark'}}/>} sx={{mt: 7, mb: 2, width: '100%', backgroundColor: 'blue.main'}}>You have cancelled your subscription. You will still have access to your plan until the end of your billing period.</Alert>}
          {pastDue() && <Alert action={<IconButton onClick={() => setAlertOpen(false)}><Close fontSize="inherit" /></IconButton>} icon={<Warning fontSize="inherit" sx={{color: 'yellow.dark'}}/>} sx={{mt: 7, mb: 2, width: '100%', backgroundColor: 'yellow.main'}}>Your subscription is past due. Add or update payment methods to continue using service.</Alert>}
          {isFreeTrial() && <Alert action={<IconButton onClick={() => setAlertOpen(false)}><Close fontSize="inherit" /></IconButton>} icon={<Info fontSize="inherit" sx={{color: 'blue.dark'}}/>} sx={{mt: 7, mb: 2, width: '100%', backgroundColor: 'blue.main'}}>{daysLeftInFreeTrial()} days remaining in your free trial</Alert>}
          </Collapse>
        </Toolbar>

        {/* body */}
        <Routes>
          <Route path="/dashboard" element={<GuardedRouteUser><Dashboard success={success} settings={settings} permission="view-dashboard" /></GuardedRouteUser>} />
          <Route path="/schedule" element={<Schedule success={success} settings={settings} />} />
          <Route path="/clients" element={<Clients success={success} settings={settings} />} />
          <Route path="/clients/:id" element={<Client success={success} settings={settings} />} />
          <Route path="/quotes" element={<Quotes success={success} settings={settings} />} />
          <Route
            path="/quotes/:id"
            element={<Quote success={success} settings={settings} />}
          />
          <Route path="/jobs" element={<Jobs success={success} settings={settings} />} />
          <Route path="/jobs/:id" element={<Job success={success} settings={settings} />} />
          <Route path="/invoices" element={<Invoices success={success} settings={settings} />} />
          <Route
            path="/invoices/:id"
            element={<Invoice success={success} settings={settings} />}
          />
          <Route path="/settings" element={<CompanySettings success={success}/>} />
          <Route path="/timesheets" element={<Timesheets success={success}/>} />
          <Route path="/" element={<Clients success={success} settings={settings} />} />
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
      <NewClient
        open={newClientOpen}
        onClose={handleCloseClient}
        success={success}
      />
      <SelectPropertyAndClient
        open={newQuoteOpen || newJobOpen}
        onClose={newQuoteOpen ? handleCloseQuote: handleCloseJob}
        type={newQuoteOpen ? "Quotes" : "Jobs"}
        success={success}
      />
      <SelectClient
        open={newInvoiceOpen}
        onClose={handleCloseInvoice}
        success={success}
      />
      <NewEvent
        open={newEventOpen}
        onClose={handleCloseEvent}
        success={success}
      />
    </Box>
  );
}

export default Shell;
