// import { auth, currentUser } from "../auth/firebase";


async function saveImagesCloudinary(images: {url: string, file: File}[]) {
    try {
        return Promise.all(images.map(i => saveImageCloudinary(i.url)))
        .then(res => {
            return res;
        }, err => {
            throw new Error(`Error saving images to cloudinary ${err}`);
        })
    } catch (err) {
        console.error(err);
    }
}

async function updateImagesInCloudinary(images: any[], originalImages: any[]) {
    try {

        // new images will be {url: string, file: File}[]
        // original images will be {url: string, public_id: string, etc}
        // images will be combo of both

        // delete images which are in original but not in images
        // add images which are in images but not in original images
        // skip images which are in both

        // let toDelete = originalImages.filter(or => !images.find(im => im.url === or.url)).map(im => im.public_id);
        let toSave = images.filter(im => !originalImages.find(or => or.url === im.url));
        let toSkip = originalImages.filter(or => images.find(im => im.url === or.url));
        let savedPromises = toSave.map(i => saveImageCloudinary(i.url));
        
        return Promise.all(savedPromises)
        .then(res => {
            // if (toDelete.length > 0) deleteImageCloudinary(toDelete);
            return res.concat(toSkip);
        }, err => {
            throw new Error(`Error updating images in cloudinary ${err}`);
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
            return res.json().then(err => {
                console.error(`Error uploading photos: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error uploading photos`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

// async function deleteImageCloudinary(ids: string[]) {
//     try {
//     var headers: HeadersInit = {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + await currentUser.getIdToken(),
//         'tenantId': auth.tenantId as string,
//         'userId': auth.currentUser?.uid as string
//     }
//     var body = JSON.stringify({images: ids});
//     const requestOptions: RequestInit = {
//         method: 'POST',
//         headers: headers,
//         body: body
//     };
//         let url = new URL(`${process.env.REACT_APP_SERVER_URL}/images/delete-images-cloudinary`);
//         return fetch(url, requestOptions)
//         .then(res => {
//             if (res.ok) {
//                 return res.json();
//             }
//             return res.json().then(err => {
//                 console.error(`Error deleting images from cloudinary: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
//             })
//             throw new Error(`Error deleting images from cloudinary`);
//         })
//     } catch (err) {
//         console.error(err);
//     }
// }


// async function createImages(images: any[], type: string, typeId: string) {
//     try {
//     var headers: HeadersInit = {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + await currentUser.getIdToken(),
//         'tenantId': auth.tenantId as string,
//         'userId': auth.currentUser?.uid as string
//     }
//     var body = JSON.stringify({images: images, type: type, typeId: typeId});
//     const requestOptions: RequestInit = {
//         method: 'POST',
//         headers: headers,
//         body: body
//     };
//         let url = new URL(`${process.env.REACT_APP_SERVER_URL}/images/create-images`);
//         return fetch(url, requestOptions)
//         .then(res => {
//             if (res.ok) {
//                 return res.json();
//             }
//             return res.json().then(err => {
//                 console.error(`Error creating images: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
//             })
//             throw new Error(`Error creating images`);
//         })
//     } catch (err) {
//         console.error(err);
//     }
// }


export {
    saveImagesCloudinary,
    updateImagesInCloudinary
}