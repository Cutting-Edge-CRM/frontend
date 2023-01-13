import { auth, currentUser } from "../auth/firebase";

async function saveImages(images: {url: string, file: File}[], type: string, typeId: string) {
    try {
        return Promise.all(images.map(i => saveImageCloudinary(i.url)))
        .then(res => {
            return createImages(res, type, typeId);
        })
    } catch (err) {
        console.error(err);
    }
}

async function createImages(images: any[], type: string, typeId: string) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify({images: images, type: type, typeId: typeId});
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`http://localhost:3000/images/create-images`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error creating images: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error creating images`);
        })
    } catch (err) {
        console.error(err);
    }
}

async function saveImageCloudinary(image: string) {
    let cloudName = 'dtjqpussy';
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
    }
    var body = JSON.stringify({file: image, upload_preset: 'standard'});
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`https://api.cloudinary.com/v1_1/${cloudName}/upload`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error uploading photos: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error uploading photos`);
        })
    } catch (err) {
        console.error(err);
    }
}


export {
    saveImages
}