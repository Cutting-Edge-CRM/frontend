import { auth, currentUser } from "../auth/firebase";

async function listJobs(client?: string) {
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
        let url = new URL('http://localhost:3000/jobs/list-jobs');
        if (client) url.searchParams.set('client', client);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error listing jobs: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error listing jobs`);
        })
    } catch (err) {
        console.error(err);
    }
}


export {
    listJobs
  };