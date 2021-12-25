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
    return fetch(`${apiSettings.apiUrl}orderapp/NewSale?id=${restaurantId}&ordertype=${orderType}`, requestOptions)
        .then(response => response.json())
}