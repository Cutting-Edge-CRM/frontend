import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { AttachMoney, FormatPaintOutlined, PeopleOutlineOutlined, CalendarMonthOutlined, TrendingUpOutlined, SellOutlined, AccessTimeOutlined, SummarizeOutlined, SettingsOutlined } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Avatar, ListItemButton, Menu, MenuItem } from '@mui/material';
import { Logout, Settings } from '@mui/icons-material';
import Dashboard from '../dashboard/Dashboard';
import { Link, Route, Routes } from 'react-router-dom';
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

const drawerWidth = 240;
const topTabs = [{display: 'Dashboard', icon: <TrendingUpOutlined/>}, {display: 'Schedule', icon: <CalendarMonthOutlined/>}, {display: 'Clients', icon: <PeopleOutlineOutlined/>}, {display: 'Quotes', icon: <SellOutlined/>}, {display: 'Jobs', icon: <FormatPaintOutlined/>}, {display: 'Invoices', icon: <AttachMoney/>}];
const bottomTabs = [{display: 'Timesheets', icon: <AccessTimeOutlined/>}, {display: 'Reports', icon: <SummarizeOutlined/>}, {display: 'Settings', icon: <SettingsOutlined/>}];

function Shell() {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
            <Link to={topTabs[index].display}>
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
      <Divider />
      <List>
        {bottomTabs.map((tab, index) => (
          <ListItem key={tab.display} disablePadding>
            <Link to={bottomTabs[index].display}>
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

    // toolbar

    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            White Mountain Painting
          </Typography>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
          >
            <Avatar>NW</Avatar>
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
            <Settings fontSize="small" />
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
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/schedule" element={<Schedule />}/>
            <Route path="/clients" element={<Clients />}/>
            <Route path="/clients/:id" element={<Client />}/>
            <Route path="/quotes" element={<Quotes />}/>
            <Route path="/quotes/:id" element={<Quote />}/>
            <Route path="/jobs" element={<Jobs />}/>
            <Route path="/jobs/:id" element={<Job />}/>
            <Route path="/invoices" element={<Invoices />}/>
            <Route path="/invoices/:id" element={<Invoice />}/>
            <Route path="/settings" element={<Settings />}/>
            <Route path="/" element={<Dashboard />}/>
        </Routes>

    </Box>
    </Box>
  );

}

export default Shell;
