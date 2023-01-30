import { auth, currentUser } from "../auth/firebase";

async function sendSMS(sms: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(sms);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/sms/send-sms`);
        return fetch(url, requestOptions)
        .then(res => {
            console.log(res);
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error sending sms: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error sending sms: ${err.message}`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

export {
    sendSMS
}