import { Chip, Typography } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import dayjs from "dayjs";
import React from "react";

const clientColumns: GridColDef[] = [
    { 
        field: 'name',
        headerName: 'Name',
        flex: 1 
      },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
    },
    {
      field: 'contact',
      headerName: 'Contact',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params: GridRenderCellParams<string>) => {    
        return (
          <Chip label={params.value} color="success" />
        );
      }
    },
    {
      field: 'created',
      headerName: 'Created',
      flex: 1,
      renderCell: (params: GridRenderCellParams<string>) => {    
        return (
          <Typography>{dayjs(params.value).format('MM/DD/YYYY')}</Typography>
        );
      }
    },
  ];

const quoteColumns: GridColDef[] = [
    { 
      field: 'clientName',
      headerName: 'Client',
      flex: 1 },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params: GridRenderCellParams<string>) => {    
        return (
          <Chip label={params.value} color="success" />
        );
      }
    },
    {
      field: 'created',
      headerName: 'Created',
      flex: 1,
      renderCell: (params: GridRenderCellParams<string>) => {    
        return (
          <Typography>{dayjs(params.value).format('MM/DD/YYYY')}</Typography>
        );
      }
    },
  ];

const jobColumns: GridColDef[] = [
    { 
      field: 'clientName',
      headerName: 'Client',
      flex: 1 ,
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params: GridRenderCellParams<string>) => {    
        return (
          <Chip label={params.value} color="success" />
        );
      }
    },
    {
      field: 'created',
      headerName: 'Created',
      flex: 1,
      renderCell: (params: GridRenderCellParams<string>) => {    
        return (
          <Typography>{dayjs(params.value).format('MM/DD/YYYY')}</Typography>
        );
      }
    },
  ];

const invoiceColumns: GridColDef[] = [
    { 
        field: 'clientName',
        headerName: 'Client',
        flex: 1 
      },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
    },
    {
      field: 'balance',
      headerName: 'Balance',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params: GridRenderCellParams<string>) => {    
        return (
          <Chip label={params.value} color="success" />
        );
      }
    },
    {
      field: 'created',
      headerName: 'Created',
      flex: 1,
      renderCell: (params: GridRenderCellParams<string>) => {    
        return (
          <Typography>{dayjs(params.value).format('MM/DD/YYYY')}</Typography>
        );
      }
    },
  ];

  const employeeColumns: GridColDef[] = [
    { 
        field: 'name',
        headerName: 'Name',
        flex: 1 },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
    },
    {
      field: 'created',
      headerName: 'Created',
      flex: 1,
      renderCell: (params: GridRenderCellParams<string>) => {    
        return (
          <Typography>{dayjs(params.value).format('MM/DD/YYYY')}</Typography>
        );
      }
    },
  ];

export {
    clientColumns,
    jobColumns,
    invoiceColumns,
    quoteColumns,
    employeeColumns
}