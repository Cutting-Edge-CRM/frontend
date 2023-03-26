import { Box, Card, CardHeader, Stack, Tab, Tabs, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getCompany } from '../../api/company.api';
import { getSettings } from '../../api/settings.api';
import { listTaxes } from '../../api/tax.api';
import { isAllowed } from '../../auth/FeatureGuards';
import { theme } from '../../theme/theme';
import Billing from './Billing';
import CompanyInformation from './CompanyInformation';
import EmailSmsSettings from './EmailSmsSettings';
import Employees from './Employees';
import Payments from './Payments';
import PersonalInformation from './PersonalInformation';

function CompanySettings(props: any) {
    const [value, setValue] = useState(0);
    // const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({} as any);
    const [company, setCompany] = useState({} as any);
    const [logoUrl, setLogoUrl] = useState([] as any);
    const [taxes, setTaxes] = useState({} as any);
    const location = useLocation();
    let mobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        let param = '';
        switch (newValue) {
            case 0:
                param = "personal-details";
                break;
            case 1:
                param = "company-info";
                break;
            case 2:
                param = "employees";
                break;
            case 3:
                param = "email-sms";
                break;
            case 4:
                param = "payments";
                break;
            case 5:
                param = "billing";
                break;
          }
        window.history.replaceState(null, '', `?tab=${param}`);
        setValue(newValue);
      };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tab = queryParams.get('tab');
        switch (tab) {
            case "personal-details":
                setValue(0);
                break;
            case "company-info":
                setValue(1);
                break;
            case "employees":
                setValue(2);
                break;
            case "email-sms":
                setValue(3);
                break;
            case "payments":
                setValue(4);
                break;
            case "billing":
                setValue(5);
                break;
            default:
                setValue(0);
                break;
          }

    }, [location.search])

    useEffect(() => {
    getSettings()
    .then((result) => {
        // setLoading(false);
        setSettings(result);
    }, (err) => {
        // setLoading(false);
        // setError(err.message);
    })
    }, []);

    useEffect(() => {
        listTaxes()
        .then((result) => {
            // setLoading(false);
            setTaxes({taxes: result.map((r: any) => {
                return {
                    ...r,
                    tax: (r.tax*100).toFixed(2)
                }
            })});
        }, (err) => {
            // setLoading(false);
            // setError(err.message);
        })
        }, []);

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

    return (
        <Stack spacing={2}>
            <Card sx={{ pb: 4, pt: 1, width: mobile ? "100vw" : '100%' }}>
                <CardHeader title="Company Settings" />
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} sx={{'.MuiTabs-scroller': {overflowX: 'scroll !important', '::-webkit-scrollbar': {display: 'none'}}}} >
                        <Tab label="Personal Details" id="personalDetails" />
                        {isAllowed('view-company-settings') && <Tab label="Company Details" id="companyDetails" />}
                        {isAllowed('view-employee-settings') && <Tab label="Employees" id="employees" />}
                        {isAllowed('view-emailsms-settings') && <Tab label="Email & SMS" id="emailAndSms" />}
                        {isAllowed('view-payment-settings') && <Tab label="Payments" id="payments" />}
                        {isAllowed('view-billing-settings') && <Tab label="Billing" id="billing" />}
                    </Tabs>
                </Box>
            </Card>
            {value === 0 && <PersonalInformation success={props.success}/>}
            {isAllowed('view-company-settings') && value === 1 && <CompanyInformation company={company} setCompany={setCompany} success={props.success} fileURLs={logoUrl} setFileURLs={setLogoUrl} />}
            {isAllowed('view-employee-settings') && value === 2 && <Employees success={props.success} subscription={props.subscription}/>}
            {isAllowed('view-emailsms-settings') && value === 3 && <EmailSmsSettings settings={settings} setSettings={setSettings} success={props.success}/>}
            {isAllowed('view-payment-settings') && value === 4 && <Payments settings={settings} setSettings={setSettings} taxes={taxes} setTaxes={setTaxes} success={props.success} />}
            {isAllowed('view-billing-settings') && value === 5 && <Billing success={props.success} subscription={props.subscription}/>}
        </Stack>
    )
}

export default CompanySettings;