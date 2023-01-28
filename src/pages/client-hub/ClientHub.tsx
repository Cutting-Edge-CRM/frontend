import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { AttachMoney, SellOutlined } from '@mui/icons-material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Alert, Avatar, ListItemButton, Snackbar } from '@mui/material';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import ClientHubQuotes from './ClientHubQuotes';
import Login from '../utility/login/Login';
import ClientHubQuote from './ClientHubQuote';

const drawerWidth = 240;
const topTabs = [{display: 'Quotes', icon: <SellOutlined/>}, {display: 'Invoices', icon: <AttachMoney/>}];

function ClientHub() {
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  let { clientId } = useParams();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  const success = (message: string) => {
    setSuccessMessage(message);
    setSuccessOpen(true);
  };

  const handleSuccessClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSuccessOpen(false);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Avatar>CE</Avatar>
        <Typography variant="h6" noWrap component="div">
            CuttingEdge CRM
          </Typography>
      </Toolbar>
      <Divider />
      <List>
        {topTabs.map((tab, index) => (
          <ListItem key={tab.display} disablePadding>
            <Link to={`/client-hub/${clientId}/${topTabs[index].display}`}>
            <ListItemButton>
              <ListItemIcon>
                {tab.icon}
              </ListItemIcon>
              <ListItemText primary={tab.display} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (

        <Box sx={{ display: 'flex' }}>
    
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
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
        <Toolbar />
  
        {/* body */}
          <Routes>
            <Route path="/quotes" element={<ClientHubQuotes success={success} />} />
            <Route path="/quotes/:quoteId" element={<ClientHubQuote success={success} />} />
            <Route path="*" element={<Login />} />
          </Routes>
          <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={successOpen} autoHideDuration={4000} onClose={handleSuccessClose}>
              <Alert onClose={handleSuccessClose} severity="success" sx={{ width: '100%' }}>
                {successMessage}
              </Alert>
          </Snackbar>
      </Box>
      </Box>
  );

}

export default ClientHub;