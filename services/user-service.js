import { apiSettings } from "../configs/api-settings";

export const loginUser = (params) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: params
    };
    return fetch(`${apiSettings.apiUrl}orderapp/login`, requestOptions)
        .then(response => response.json())
}

export const loginVerify = (params) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: params
    };
    return fetch(`${apiSettings.apiUrl}orderapp/loginrequest`, requestOptions)
        .then(response => response.json())
}

export const getUserProfile = (token) => {
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

export const uploadUserImage = (formData, token) => {
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

export const updateProfile = (params, token) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: params
    };
    return fetch(`${apiSettings.apiUrl}orderapp/UpdateProfile`, requestOptions)
        .then(response => response.json())
}

export const getUserReceipts = (token) => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    };
    return fetch(`${apiSettings.apiUrl}orderapp/GetReceipts`, requestOptions)
        .then(response => response.json())
}