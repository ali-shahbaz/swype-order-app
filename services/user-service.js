import { apiSettings } from "../configs/api-settings";

export const LoginUser = (params) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: params
    };
    return fetch(`${apiSettings.apiUrl}orderapp/login`, requestOptions)
        .then(response => response.json())
}

export const VerifyLogin = (params) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: params
    };
    return fetch(`${apiSettings.apiUrl}orderapp/loginrequest`, requestOptions)
        .then(response => response.json())
}

export const GetUserProfile = (token) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    };
    return fetch(`${apiSettings.apiUrl}orderapp/GetProfile`, requestOptions)
        .then(response => response.json())
}

export const UploadUserImage = (formData, token) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': token
        },
        body: formData
    };
    return fetch(`${apiSettings.apiUrl}orderapp/PostUserImage`, requestOptions)
        .then(response => response.json())
}

export const UpdateProfile = (params, token) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: params
    };
    return fetch(`${apiSettings.apiUrl}orderapp/UpdateProfile`, requestOptions)
        .then(response => response.json())
}

export const GetUserReceipts = (token) => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    };
    return fetch(`${apiSettings.apiUrl}orderapp/GetReceipts`, requestOptions)
        .then(response => response.json())
}