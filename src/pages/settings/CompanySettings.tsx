import { Box, Card, CardHeader, Stack, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getCompany } from '../../api/company.api';
import { getSettings } from '../../api/settings.api';
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
    // const [error, setError] = useState(null);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
      };

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
        getCompany()
        .then((result) => {
            // setLoading(false);
            setCompany(result);
        }, (err) => {
            // setLoading(false);
            // setError(err.message);
        })
        }, []);

    return (
        <Stack spacing={2}>
            <Card sx={{ pb: 4, pt: 1 }}>
                <CardHeader title="Company Settings" />
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Personal Details" id="personalDetails" />
                        <Tab label="Company Details" id="companyDetails" />
                        <Tab label="Employees" id="employees" />
                        <Tab label="Email & SMS" id="emailAndSms" />
                        <Tab label="Payments" id="payments" />
                        <Tab label="Billing" id="billing" />
                    </Tabs>
                </Box>
            </Card>
            {value === 0 && <PersonalInformation success={props.success}/>}
            {value === 1 && <CompanyInformation company={company} setCompany={setCompany} success={props.success}/>}
            {value === 2 && <Employees success={props.success}/>}
            {value === 3 && <EmailSmsSettings settings={settings} setSettings={setSettings} success={props.success}/>}
            {value === 4 && <Payments/>}
        </Stack>
    )
}

export default CompanySettings;