import { atom } from "recoil";

export const cartState = atom({
    key: 'cart',
    default: -1
});

export const menuTabState = atom({
    key: 'menuTab',
    default: null
});

export const userLoggedInState = atom({
    key: 'userLoggedIn',
    default: false
});