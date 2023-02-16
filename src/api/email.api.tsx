import { auth, currentUser } from "../auth/firebase";

async function sendEmail(email: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(email);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/emails/send-email`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error sending email: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error sending email`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

export {
    sendEmail
}