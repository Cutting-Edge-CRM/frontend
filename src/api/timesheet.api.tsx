import { auth, currentUser } from "../auth/firebase";

async function createTimesheet(timesheet: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(timesheet);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/timesheets/create-timesheet`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error creating timesheet: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error creating timesheet`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function clock(timeclock: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(timeclock);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/timesheets/clock`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error creating timeclock: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error creating timeclock`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function getClockStatus() {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: headers,
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/timesheets/get-clock-status`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error getting clock status: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error getting clock status`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function listTimesheets(date: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: headers,
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/timesheets/list-timesheets`);
        url.searchParams.set('date', `${date}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error listing timesheets: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error listing timesheets`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

export {
    createTimesheet,
    clock,
    getClockStatus,
    listTimesheets
}