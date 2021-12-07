import { atom } from "recoil";

export const cartState = atom({
    key: 'cart',
    default: 0
});

export const menuTabState = atom({
    key: 'menuTab',
    default: null
});