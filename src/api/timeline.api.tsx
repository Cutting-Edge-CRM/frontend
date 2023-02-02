import { auth, currentUser } from "../auth/firebase";

async function createTimeline(timeline: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(timeline);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/timeline/create-timeline`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error creating timeline: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error creating timeline`);
        })
    } catch (err) {
        console.error(err);
    }
}

async function listTimeline(client?: string, resourceType?: string, resourceId?: string) {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/timeline/list-timelines`);
        if (client) url.searchParams.set('client', client);
        if (resourceType) url.searchParams.set('resourceType', resourceType);
        if (resourceId) url.searchParams.set('resourceId', resourceId);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error listing timelines: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error listing timelines`);
        })
    } catch (err) {
        console.error(err);
    }
}


export {
    listTimeline,
    createTimeline
  };