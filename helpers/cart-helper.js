import useSessionStorage from "../hooks/useSessionStorage";

const AddToOrder = (params) => {
    let state = useSessionStorage('init_data');
    let cart = useSessionStorage('cart');

    if (state) {
        state = state.payload.data;
        if (cart) {
            cart = JSON.parse(cart);
            cart.items.push(params);
        } else {
            const product = state.quickProducts.find(p => p.itemid == params.itemid);
            const addToCart = {
                totalAmount: product.salesprice,
                items: [
                    params
                ]
            }

            localStorage.setItem('cart', JSON.stringify(addToCart));
        }
    }

}
export default AddToOrder;