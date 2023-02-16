import { auth, currentUser } from "../auth/firebase";

async function createJob(job: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(job);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/jobs/create-job`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error creating job: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error creating job`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}


async function getJob(id?: string) {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/jobs/get-job/${id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error getting job: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error getting job`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function updateJob(job: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(job);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/jobs/update-job/${job.job.id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error updating job: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error updating job`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function deleteJob(id: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/jobs/delete-job/${id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error deleting job: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error deleting job`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function listJobs(client?: string, query?: string, page?: number, pageSize?: number) {
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
    let url = new URL(`${process.env.REACT_APP_SERVER_URL}/jobs/list-jobs`);
    if (page) url.searchParams.set('page', `${page}`);
    if (client) url.searchParams.set('client', client);
    if (pageSize) url.searchParams.set('pageSize', `${pageSize}`);
    if (query) url.searchParams.set('query', query);
    return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error listing jobs: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error listing jobs`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}


export {
    listJobs,
    getJob,
    updateJob,
    createJob,
    deleteJob
  };