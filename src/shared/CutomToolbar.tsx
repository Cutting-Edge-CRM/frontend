import React from 'react';
import {
  Box,
  BoxProps,
  Button,
  Divider,
  DividerProps,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  styled,
  Typography,
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
} from '@mui/icons-material';

type CustomToolbarProps = {
  title?: string;
  type: string;
  handleNewOpen: () => void;
  onImportClick?: () => void;
  handleExportClients?: () => void;
};

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

export default function CustomToolbar(props: CustomToolbarProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

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
        <>
          <GridToolbarQuickFilter variant="outlined" size="small" />
          {props.type === 'Clients' && (
            <>
              <Button startIcon={<ImportExport />} onClick={openMenu}>
                Import/Export
              </Button>
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
          <Button
            onClick={props.handleNewOpen}
            startIcon={<AddCircleOutlineOutlined />}
            variant="contained"
            color="primary"
          >
            New {props.type.slice(0, -1)}
          </Button>
        </>
      </FilterContainer>
    </StyledGridToolbarContainer>
  );
}