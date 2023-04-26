import { Box, Button, Card, CircularProgress, Divider, Grid, IconButton, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
  } from 'chart.js';
import { dashboard } from '../../api/reports.api';
import { ArrowBackIos, ArrowForwardIos, AttachMoneyOutlined, FormatPaintOutlined, PeopleOutline, RequestQuoteOutlined, SellOutlined } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import EmptyState from '../../shared/EmptyState';
import { theme } from '../../theme/theme';


function Dashboard(props: any) {
    const [query, setQuery] = useState({start: dayjs().startOf('month'), end: dayjs().endOf('month'), inc: '1', unit: 'day'});
    const [labels, setLabels] = useState([]);
    const [fullDataset, setFullDataset] = useState(null as any);
    const [datasets, setDatasets] = useState([]);
    const [accumulativeDatasets, setAccumulativeDatasets] = useState([]);
    const [thirdDatasets, setThirdDatasets] = useState([]);
    const [tab, setTab] = useState(2);
    const [type, setType] = useState('sales-charts');
    let mobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [loading, setLoading] = useState(true);

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Tooltip,
        Legend
      );

    const options = {
        responsive: true,
        elements: {
            line: {
                tension: 0.25
            }
        },
        plugins: {
          legend: {
            position: 'top' as const,
          },
        },
        scales: {
            num: {
              type: 'linear' as const,
              display: true,
              position: 'left' as const,
            },
            sum: {
              type: 'linear' as const,
              display: tab !== 0,
              position: 'right' as const,
            },
          },
      };


    const data = {
        labels: labels,
        datasets: datasets,
    };
    const accumulativeData = {
        labels: labels,
        datasets: accumulativeDatasets,
    };
    const thirdData = {
        labels: labels,
        datasets: thirdDatasets,
    };

    const handleChangeTab = (tab: number) => {
        setTab(tab);
        switch (tab) {
            case 0:
                setDatasets(fullDataset.clients.datasets);
                setAccumulativeDatasets(fullDataset.clients.accumulativeDatasets);
                setThirdDatasets(fullDataset.clients.thirdDataSet);
                setType('client-charts');
                break;
            case 1:
                setDatasets(fullDataset.quotes.datasets);
                setAccumulativeDatasets(fullDataset.quotes.accumulativeDatasets);
                setThirdDatasets(fullDataset.quotes.thirdDataSet);
                setType('quote-charts');
                break;
            case 2:
                setDatasets(fullDataset.sales.datasets);
                setAccumulativeDatasets(fullDataset.sales.accumulativeDatasets);
                setThirdDatasets(fullDataset.sales.thirdDataSet);
                setType('sale-charts');
                break;
            case 3:
                setDatasets(fullDataset.produced.datasets);
                setAccumulativeDatasets(fullDataset.produced.accumulativeDatasets);
                setThirdDatasets(fullDataset.produced.thirdDataSet);
                setType('job-charts');
                break;
            case 4:
                setDatasets(fullDataset.revenue.datasets);
                setAccumulativeDatasets(fullDataset.revenue.accumulativeDatasets);
                setThirdDatasets(fullDataset.revenue.thirdDataSet);
                setType('invoice-charts');
                break;
            default:
                break;
        }
    }

    const handleStartDate = (date: any) => {
        setQuery({...query, start: date})
    }

    const handleEndDate = (date: any) => {
        setQuery({...query, end: date})
    }

    const handleChangeInc = (e: any) => {
        setQuery({...query, inc: e.target.value})
    }

    const handleChangeUnit = (unit: any) => {
        setQuery({...query, unit: unit})
    }

    const handleBack = () => {
        if (query.start.date() === query.start.startOf('month').date() && query.end.date() === query.end.startOf('month').date()) {
            setQuery({...query, start: query.start.subtract(1, 'month'), end: query.end.subtract(1, 'month')});
            return;
        }
        if (query.start.date() === query.start.startOf('month').date() && query.end.date() === query.end.endOf('month').date()) {
            setQuery({...query, start: query.start.subtract(1, 'month'), end: query.end.subtract(1, 'month').endOf('month')});
            return;
        }
        setQuery({...query, start: query.start.subtract(query.end.diff(query.start, 'days'), 'days'), end: query.end.subtract(query.end.diff(query.start, 'days'), 'days')});
        return;
    }

    const handleForward = () => {
        if (query.start.date() === query.start.startOf('month').date() && query.end.date() === query.end.startOf('month').date()) {
            setQuery({...query, start: query.start.add(1, 'month'), end: query.end.add(1, 'month')});
            return;
        }
        if (query.start.date() === query.start.startOf('month').date() && query.end.date() === query.end.endOf('month').date()) {
            setQuery({...query, start: query.start.add(1, 'month'), end: query.end.add(1, 'month').endOf('month')});
            return;
        }
        setQuery({...query, start: query.start.add(query.end.diff(query.start, 'days'), 'days'), end: query.end.add(query.end.diff(query.start, 'days'), 'days')});
        return;
    }

    useEffect(() => {
        if (query.inc.length > 0) {
            dashboard(query).then(res => {
                setFullDataset(res);
                setDatasets(res.sales.datasets);
                setLabels(res.labels);
                setAccumulativeDatasets(res.sales.accumulativeDatasets);
                setThirdDatasets(res.sales.thirdDataSet);
                setLoading(false);
            })
        }
    }, [query])

    return (
        <Stack>
        <Card sx={{mb: 2, py: 2}}>
            <Stack direction={{xs: 'column', md: 'row'}} spacing={2} alignItems="center">
                <Stack direction={{xs: 'column', sm: 'row'}} alignItems="center" spacing={1}>
                    <Stack direction={'row'}>
                        <IconButton
                            onClick={handleBack}
                        >
                            <ArrowBackIos/>
                        </IconButton>
                        <IconButton
                        onClick={handleForward}
                        >
                            <ArrowForwardIos/>
                        </IconButton>
                    </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} spacing={1} alignItems="center">
                    <DatePicker
                        onChange={handleStartDate}
                        value={query.start}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <Typography fontSize={24} display={{xs: 'none', sm: 'flex'}}>-</Typography>
                    <DatePicker
                        onChange={handleEndDate}
                        value={query.end}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Stack>
                </Stack>
                <Stack direction={{xs: 'column', sm:'row'}} marginLeft={{xs: "auto", md: "auto !important"}} alignItems={'center'}>
                    <Typography fontSize={'20px'} fontWeight={500} color="#B5B7C0" marginRight={2}>Group by:</Typography>
                    <Stack direction={'row'}>
                        <TextField
                        sx={{width: '60px', '.MuiInputBase-input': {textAlign: "center"}}}
                        value={query.inc}
                        type="number"
                        onChange={handleChangeInc}
                        />
                        <Button
                        onClick={(e) => handleChangeUnit('day')}
                        color={query.unit === 'day' ? "primary" : "info"}
                        >
                            Days
                        </Button>
                        <Divider orientation="vertical"/>
                        <Button
                        color={query.unit === 'week' ? "primary" : "info"}
                        onClick={(e) => handleChangeUnit('week')}
                        >
                            Weeks
                        </Button>
                        <Divider orientation="vertical"/>
                        <Button
                        color={query.unit === 'month' ? "primary" : "info"}
                        onClick={(e) => handleChangeUnit('month')}
                        >
                            Months
                        </Button>
                        <Divider orientation="vertical"/>
                    </Stack>
                </Stack>
            </Stack>
        </Card>
        <Box overflow="scroll" maxWidth={'100vw'}>
        <Grid container sx={{mb: 2, px: 2}} columns={10} spacing={4} minWidth={'1200px'} >
        <Grid item xs={2}>
            <Card sx={{height: '100px', display: 'flex', alignItems: 'center', cursor: 'pointer', borderBottom: tab === 0 ? "5px solid #0C8BE7": 'none'}} onClick={(e) => handleChangeTab(0)}>
            <Stack direction={'row'}>
                <PeopleOutline sx={{width: '60px', height: '60px', color:"#0C8BE7", backgroundColor: "#DBEEFC", borderRadius: '7px', px: '10px'}}/>
                <Stack paddingLeft={'20px'}>
                    <Typography fontSize={'16px'} fontWeight={500} color="#B5B7C0" >Clients</Typography>
                    <Typography fontSize={'24px'} fontWeight={600} color="#5F666F" >{fullDataset?.clients?.totalClients}</Typography>
                </Stack>
            </Stack>
            </Card>
        </Grid>
        <Grid item xs={2}>
            <Card sx={{height: '100px', display: 'flex', alignItems: 'center', cursor: 'pointer', borderBottom: tab === 1 ? "5px solid #FFB427": 'none'}} onClick={(e) => handleChangeTab(1)}>
            <Stack direction={'row'}>
                <RequestQuoteOutlined sx={{width: '60px', height: '60px', color:"#FFB427", backgroundColor: "#FFF4DF", borderRadius: '7px', px: '10px'}}/>
                <Stack paddingLeft={'20px'}>
                    <Typography fontSize={'16px'} fontWeight={500} color="#B5B7C0" >Quotes</Typography>
                    <Typography fontSize={'24px'} fontWeight={600} color="#5F666F" >{fullDataset?.quotes?.totalNumQuotes}</Typography>
                </Stack>
            </Stack>
            </Card>
        </Grid>
        <Grid item xs={2}>
            <Card sx={{height: '100px', display: 'flex', alignItems: 'center', cursor: 'pointer', borderBottom: tab === 2 ? "5px solid #403DFC": 'none'}} onClick={(e) => handleChangeTab(2)}>
            <Stack direction={'row'}>
                <SellOutlined sx={{width: '60px', height: '60px', color:"#403DFC", backgroundColor: "#E3E2FF", borderRadius: '7px', px: '10px'}}/>
                <Stack paddingLeft={'20px'}>
                    <Typography fontSize={'16px'} fontWeight={500} color="#B5B7C0" >Sales</Typography>
                    <Typography fontSize={'24px'} fontWeight={600} color="#5F666F" >${fullDataset?.sales?.totalSumQuotes}</Typography>
                </Stack>
            </Stack>
            </Card>
        </Grid>
        <Grid item xs={2}>
            <Card sx={{height: '100px', display: 'flex', alignItems: 'center', cursor: 'pointer', borderBottom: tab === 3 ? "5px solid #DA001A": 'none'}} onClick={(e) => handleChangeTab(3)}>
            <Stack direction={'row'}>
                <FormatPaintOutlined sx={{width: '60px', height: '60px', color:"#DA001A", backgroundColor: "#FADADE", borderRadius: '7px', px: '10px'}}/>
                <Stack paddingLeft={'20px'}>
                    <Typography fontSize={'16px'} fontWeight={500} color="#B5B7C0" >Jobs</Typography>
                    <Typography fontSize={'24px'} fontWeight={600} color="#5F666F" >{fullDataset?.produced?.totalNumJobsComplete}</Typography>
                </Stack>
            </Stack>
            </Card>
        </Grid>
        <Grid item xs={2}>
            <Card sx={{height: '100px', display: 'flex', alignItems: 'center', cursor: 'pointer', borderBottom: tab === 4 ? "5px solid #00AC4F": 'none'}} onClick={(e) => handleChangeTab(4)}>
            <Stack direction={'row'}>
                <AttachMoneyOutlined sx={{width: '60px', height: '60px', color:"#00AC4F", backgroundColor: "#DAF3E6", borderRadius: '7px', px: '10px'}}/>
                <Stack paddingLeft={'20px'}>
                    <Typography fontSize={'16px'} fontWeight={500} color="#B5B7C0" >Revenue</Typography>
                    <Typography fontSize={'24px'} fontWeight={600} color="#5F666F" >${fullDataset?.revenue?.totalSumInvoices}</Typography>
                </Stack>
            </Stack>
            </Card>
        </Grid>
        </Grid>
        <Card sx={{mb: 2, py: 2, minWidth: "1200px", display:"flex", justifyContent:"center"}} >
            {loading ? <CircularProgress/>
            :
            <Stack direction={'row'} spacing={3} justifyContent="center" >
                {tab === 0 &&
                <>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Total Clients</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >{fullDataset?.clients?.totalClients}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >New Clients</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >{fullDataset?.clients?.timeframeClients}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Sales/Clients</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >${(+fullDataset?.clients?.totalSalesPerClient).toFixed(0)}</Typography>
                </Stack>
                </>
                }
                {tab === 1 &&
                <>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Average Quote Size</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >${(+fullDataset?.quotes?.timeframeAverageQuoteSize).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Number of Quotes</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >{(+fullDataset?.quotes?.timeframeNumQuotes).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Sum of Quotes</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >${(+fullDataset?.quotes?.timeframeSumQuotes).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Average Quote Size (All Time)</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >${(+fullDataset?.quotes?.totalAverageQuoteSize).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Number of Quotes (All Time)</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >{(+fullDataset?.quotes?.totalNumQuotes).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Sales/Quote (All Time)</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >${(+fullDataset?.quotes?.totalSalesPerQuote).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Sum of Quotes (All Time)</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >${(+fullDataset?.quotes?.totalSumQuotes).toFixed(0)}</Typography>
                </Stack>
                </>
                }
                {tab === 2 &&
                <>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Average Sale Size</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >${(+fullDataset?.sales?.timeframeAverageQuoteSize).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Number of Sales</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >{(+fullDataset?.sales?.timeframeNumQuotes).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Sum of Sales</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >${(+fullDataset?.sales?.timeframeSumQuotes).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Average Sale Size (All Time)</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >${(+fullDataset?.sales?.totalAverageQuoteSize).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Number of Sales (All Time)</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >{(+fullDataset?.sales?.totalNumQuotes).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Sum of Sales (All Time)</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >${(+fullDataset?.sales?.totalSumQuotes).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Booking Rate</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >{(+fullDataset?.sales?.timeframeBookingRate *100).toFixed(0)}%</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Booking Rate (All Time)</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >{(+fullDataset?.sales?.totalBookingRate *100).toFixed(0)}%</Typography>
                </Stack>
                </>
                }
                {tab === 3 &&
                <>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Average Completed Job Size</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >${(+fullDataset?.produced?.timeframeAverageJobsCompleteSize).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Number of Jobs Completed</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >{(+fullDataset?.produced?.timeframeNumJobsComplete).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Sum of Jobs Completed</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >${(+fullDataset?.produced?.timeframeSumJobsComplete).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Average Completed Job Size (All Time)</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >${(+fullDataset?.produced?.totalAverageJobsCompleteSize).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Number of Jobs Completed (All Time)</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >{(+fullDataset?.produced?.totalNumJobsComplete).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Sum of Jobs Completed (All Time)</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >${(+fullDataset?.produced?.totalSumJobsComplete).toFixed(0)}</Typography>
                </Stack>
                </>
                }
                {tab === 4 &&
                <>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Average Invoice Size</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >${(+fullDataset?.revenue?.timeframeAverageInvoicesSize).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Number of Paid Invoices</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >{(+fullDataset?.revenue?.timeframeNumInvoices).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Sum of Paid Invoices</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >${(+fullDataset?.revenue?.timeframeSumInvoices).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Average Invoice Size (All Time)</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >${(+fullDataset?.revenue?.totalAverageInvoicesSize).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Number of Paid Invoices (All Time)</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >{(+fullDataset?.revenue?.totalNumInvoices).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Sum of Paid Invoices (All Time)</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >${(+fullDataset?.revenue?.totalSumInvoices).toFixed(0)}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography fontSize={'14px'} fontWeight={500} color="#B5B7C0" textAlign="center" >Sum of Open Invoices (Current)</Typography>
                    <Typography fontSize={'20px'} fontWeight={600} color="#5F666F" >${(+fullDataset?.revenue?.totalOpenInvoices).toFixed(0)}</Typography>
                </Stack>
                </>
                }
            </Stack>
            }
        </Card>
        </Box>
        <Card sx={{py: 2}} >
            <Stack spacing={5}>
            {accumulativeData.datasets?.length > 0 ?
                <Line
                height={mobile ? '300vh' : '50vh'}
                options={options}
                data={accumulativeData}
                />
                :
                <EmptyState type={type} />
            }
            {data.datasets?.length > 0 ?
                <Line
                height={mobile ? '300vh' : '50vh'}
                options={options}
                data={data}
                />
                :
                <EmptyState type={type} />
            }
            {thirdData.datasets?.length > 0 &&
                <Line
                height={mobile ? '300vh' : '50vh'}
                options={options}
                data={thirdData}
                />
            }
            </Stack>
        </Card>
        </Stack>
    );

}

export default Dashboard;
