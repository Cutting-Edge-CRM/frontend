import React from 'react';
import {
  Box,
  BoxProps,
  Button,
  Divider,
  DividerProps,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  styled,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {
  GridToolbarContainer,
  GridToolbarContainerProps,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import {
  AddCircleOutlineOutlined,
  FileDownloadOutlined,
  FileUploadOutlined,
  ImportExport,
  WorkspacePremium,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme/theme';
import { hasMaxEmployees, isAllowed } from '../auth/FeatureGuards';

const StyledGridToolbarContainer = styled(
  GridToolbarContainer
)<GridToolbarContainerProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  margin: theme.spacing(2, 0, 2, 0),
}));

const StyledDivider = styled(Divider)<DividerProps>(({ theme }) => ({
  width: '100%',
  height: '2px',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const FilterContainer = styled(Box)<BoxProps>(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
}));

export default function CustomToolbar(props: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };
  let mobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const handleUpgrade = () => {
    navigate('/settings?tab=billing');
  }

  return (
    <StyledGridToolbarContainer>
      {props.title && (
        <>
          <Typography variant="h6" fontWeight={600}>
            {props.title}
          </Typography>
          <StyledDivider />
        </>
      )}
      <FilterContainer>
        <Stack direction={'row'} width="100%" justifyContent={"space-between"} alignItems="center" >
          <GridToolbarQuickFilter variant="outlined" size="small" />
          {isAllowed('add-resource') &&
          <Box justifyContent={'end'}>
          {props.type === 'Clients' && (
            <>
            {!mobile &&
              <Button startIcon={<ImportExport />} onClick={openMenu}>
              Import/Export
              </Button>
            }
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={closeMenu}
              >
                <MenuList>
                  <MenuItem onClick={props.onImportClick}>
                    <ListItemIcon>
                      <FileDownloadOutlined />
                    </ListItemIcon>
                    <ListItemText>Import</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={props.handleExportClients}>
                    <ListItemIcon>
                      <FileUploadOutlined />
                    </ListItemIcon>
                    <ListItemText>Export</ListItemText>
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          )}
          {props.type === 'employees' && hasMaxEmployees(props.employeeCount) ?
            <>
            <Button
            startIcon={<WorkspacePremium sx={{color: 'yellow.dark'}} />}
            sx={{marginLeft: 2}}
            variant="contained"
            color="primary"
            onClick={handleUpgrade}
            >
            </Button>
            </>
            :
            <>
            {mobile ?
            <IconButton onClick={props.handleNewOpen}>
              <AddCircleOutlineOutlined fontSize='large' color='primary' />
            </IconButton>
            :
            <Button
            onClick={props.handleNewOpen}
            startIcon={<AddCircleOutlineOutlined />}
            variant="contained"
            color="primary"
            >
              New {props.type.slice(0, -1)}
            </Button>
            }
            </>
          }
          </Box>
          }
        </Stack>
      </FilterContainer>
    </StyledGridToolbarContainer>
  );
}
