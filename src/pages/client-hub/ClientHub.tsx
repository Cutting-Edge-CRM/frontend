import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List, { ListProps } from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { AttachMoney, SellOutlined } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Alert, AppBar, Avatar, Grid, IconButton, ListItemButton, Snackbar, Stack, styled } from '@mui/material';
import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom';
import ClientHubQuotes from './ClientHubQuotes';
import Login from '../utility/login/Login';
import ClientHubQuote from './ClientHubQuote';
import ClientHubInvoices from './ClientHubInvoices';
import ClientHubInvoice from './ClientHubInvoice';
import { getCompany } from '../../api/company.api';
import { getSettings } from '../../api/settings.api';

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

const drawerWidth = 240;
const topTabs = [{display: 'Quotes', icon: <SellOutlined/>, slug: 'quotes'}, {display: 'Invoices', icon: <AttachMoney/>, slug: 'invoices'}];

function ClientHub() {
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  let { clientId } = useParams();
  const location = useLocation();
  const [company, setCompany] = useState({} as any);
  const [logoUrl, setLogoUrl] = useState([] as any);
  const [settings, setSettings] = useState({} as any);


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  const success = (message: string) => {
    setSuccessMessage(message);
    setSuccessOpen(true);
  };

  useEffect(() => {
    getCompany()
    .then((result) => {
        // setLoading(false);
        if (result.logo) {
            setLogoUrl([{url: result.logo}]);
        }
        setCompany(result);
    }, (err) => {
        // setLoading(false);
        // setError(err.message);
    })
    }, []);

    useEffect(() => {
      getSettings()
      .then((result) => {
          setSettings(result)
      }, (err) => {
      })
      }, []);

  const handleSuccessClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSuccessOpen(false);
  };
  
  const drawer = (
    <Stack height="100%">
      <Toolbar>
        <Stack alignItems={'center'} mt={2}>
        <Avatar sx={{ mr: 1, width: 100, height: 100 }} src={logoUrl?.[0]?.url} sizes='small' variant='square'>
        </Avatar>
        <Typography variant="h6" component="div" fontWeight={600} textAlign="center">
          {company.companyName}
        </Typography>
        </Stack>
      </Toolbar>
      <Stack height="100%">
        <NavList sx={{marginTop: 5}}>
          {topTabs.map((tab, index) => (
            <ListItem key={tab.display} disablePadding>
              <ListItemButton
                component={Link}
                to={`/client-hub/${clientId}/${topTabs[index].display}`}
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
      </Stack>
    </Stack>
  );

  return (

        <Box sx={{ display: 'flex', width: "100vw"}}>

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
        </Toolbar>
      </AppBar>
    
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
          sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` }, backgroundColor: "#f4f5f7", minHeight: "100vh", }}
        >
        <Grid container width={"100%"} justifyContent="center">
          <Grid item xs={11} lg={8}>
            <Toolbar />
      
          {/* body */}
          <Routes>
            <Route path="/quotes" element={<ClientHubQuotes success={success} />} />
            <Route path="/quotes/:quoteId" element={<ClientHubQuote success={success} settings={settings} />} />
            <Route path="/invoices" element={<ClientHubInvoices success={success} />} />
            <Route path="/invoices/:invoiceId" element={<ClientHubInvoice success={success} />} />
            <Route path="*" element={<Login />} />
          </Routes>
          <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={successOpen} autoHideDuration={4000} onClose={handleSuccessClose}>
              <Alert onClose={handleSuccessClose} severity="success" sx={{ width: '100%' }}>
                {successMessage}
              </Alert>
          </Snackbar>
          </Grid>
        </Grid>
      </Box>
      </Box>
  );

}

export default ClientHub;