import { apiSettings } from "../configs/api-settings";

export const loginUser = (params) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: params
    };
    return fetch(`${apiSettings.apiUrl}/orderapp/login`, requestOptions)
        .then(response => response.json())
}

export const loginVerify = (params) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: params
    };
    return fetch(`${apiSettings.apiUrl}/orderapp/loginrequest`, requestOptions)
        .then(response => response.json())
}