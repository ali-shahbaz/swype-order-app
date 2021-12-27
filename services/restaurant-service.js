import { apiSettings } from "../configs/api-settings";

export const GetRestaurantData = (restaurantId) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return fetch(`${apiSettings.apiUrl}orderapp/getmenu/${restaurantId}`, requestOptions)
        .then(response => response.json())
}

export const PlaceOrder = (data, restaurantId, orderType) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    };
    return fetch(`${apiSettings.apiUrl}orderapp/NewSale2?id=${restaurantId}&ordertype=${orderType}`, requestOptions)
        .then(response => response.json())
}

export const GetOrderDetail = (token, orderId) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    };
    return fetch(`${apiSettings.apiUrl}orderapp/GetOrderDetail/${orderId}`, requestOptions)
        .then(response => response.json())
}