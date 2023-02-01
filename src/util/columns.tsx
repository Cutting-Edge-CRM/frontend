import { Chip, Typography } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import dayjs from "dayjs";
import React from "react";

const clientColumns: GridColDef[] = [
    { 
        field: 'name',
        headerName: 'Name',
        width: 150 },
    {
      field: 'address',
      headerName: 'Address',
      width: 150,
    },
    {
      field: 'contact',
      headerName: 'Contact',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params: GridRenderCellParams<string>) => {    
        return (
          <Chip label={params.value} color="success" />
        );
      }
    },
    {
      field: 'created',
      headerName: 'Created',
      width: 150,
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
      width: 150 },
    {
      field: 'address',
      headerName: 'Address',
      width: 150,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params: GridRenderCellParams<string>) => {    
        return (
          <Chip label={params.value} color="success" />
        );
      }
    },
    {
      field: 'created',
      headerName: 'Created',
      width: 150,
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
      width: 150 ,
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 150,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params: GridRenderCellParams<string>) => {    
        return (
          <Chip label={params.value} color="success" />
        );
      }
    },
    {
      field: 'created',
      headerName: 'Created',
      width: 150,
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
        width: 150 },
    {
      field: 'price',
      headerName: 'Price',
      width: 150,
    },
    {
      field: 'balance',
      headerName: 'Balance',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params: GridRenderCellParams<string>) => {    
        return (
          <Chip label={params.value} color="success" />
        );
      }
    },
    {
      field: 'created',
      headerName: 'Created',
      width: 150,
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
    quoteColumns
}