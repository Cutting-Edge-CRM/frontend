import React, { useEffect, useState } from 'react';
import ClientHubInvoiceDetails from './ClientHubInvoiceDetails';
import { useParams } from 'react-router-dom';
import { getInvoice } from '../../api/invoice.api';
import { Alert, CircularProgress } from '@mui/material';
import { listTaxes } from '../../api/tax.api';
import { listPayments } from '../../api/payment.api';

function ClientHubInvoice(props: any) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [invoice, setInvoice] = useState({} as any);
    const [taxes, setTaxes] = useState([] as any);
    const [payments, setPayments] = useState([] as any);
    const [reload, setReload] = useState(false);
    let { invoiceId } = useParams();
    let { clientId } = useParams();

    useEffect(() => {
        setIsLoaded(false);
        getInvoice(invoiceId)
        .then(result => {
            setInvoice(result);
            setIsLoaded(true);
        }, err => {
            setError(err.message);
            setIsLoaded(true);
        })
    }, [invoiceId])

    useEffect(() => {
        listTaxes()
        .then(res => {
            let none = {
                id: null,
                title: "No Tax",
                tax: 0
              }
              res.unshift(none);
            setTaxes(res);
        }, (err) => {
            setError(err.message);
        })
    }, [])

    useEffect(() => {
        listPayments(clientId)
        .then(res => {
            setPayments(res.filter((p: any) => p.type === 'deposit' && p.typeId === invoice.invoice?.id));
        }, (err) => {
            setError(err.message);
        })
    }, [invoice, clientId])


    if (error) {
        return (<Alert severity="error">{error}</Alert>);
        }
    if (!isLoaded) {
        return (<CircularProgress />);
        }

    return (
        <ClientHubInvoiceDetails invoice={invoice} setInvoice={setInvoice} taxes={taxes} payments={payments} success={props.success} setReload={setReload} reload={reload}/>
    )
}

export default ClientHubInvoice;