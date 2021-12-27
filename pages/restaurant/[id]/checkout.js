import Image from 'next/image';
import useSessionStorage from '../../../hooks/useSessionStorage';
import { useRouter } from 'next/router';
import { PlaceOrder } from '../../../services/restaurant-service';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { toast } from 'react-toastify';
import Header from '../../../components/head';
import { loadStripe } from '@stripe/stripe-js';
import { CloseCircleOutline } from 'react-ionicons';

const Checkout = () => {
    const router = useRouter();
    const { id, status } = router.query;
    const cart = useSessionStorage(`cart${id}`);
    const loggedInUser = useSessionStorage('logged_in_user');
    const ref = useRef(null);
    const [saleItems, setSaleItems] = useState([]);
    const [cartData, setCartData] = useState(null);
    const cartName = `cart${id}`;

    const payNow = (event) => {
        if (loggedInUser) {
            if (cart) {
                event.target.disabled = true;
                ref.current.continuousStart();

                const taxAmount = cart.saleDetails.reduce((a, b) => {
                    return a + b.taxamount + (b.variationName ? b.variations.find(p => p.name == b.variationName).taxamount : 0)
                }, 0).toFixed(2);

                const netTotal = cart.saleDetails.reduce((a, b) => {
                    return a + b.retailprice + (b.variationName ? b.variations.find(p => p.name == b.variationName).retailprice : 0)
                        + (b.selectedModifiers.length > 0 ? b.selectedModifiers.reduce((x, y) => { return x + y.price }, 0) : 0)
                }, 0).toFixed(2);

                const grandTotal = cart.saleDetails.reduce((a, b) => {
                    return a + b.total
                }, 0).toFixed(2);

                const newCart = { ...cart, ...{ netTotal, taxAmount, grandTotal, amount: grandTotal } }
                newCart.salePayments[0].amount = grandTotal;
                newCart.salePayments[0].paymentTypeId = 2;

                if (newCart.onlineOrderType == 2) {
                    newCart['deliveryAddress'] = JSON.parse(localStorage.getItem('location'));
                }


                PlaceOrder(JSON.stringify(newCart), id, newCart.onlineOrderType).then(response => {
                    if (response.status == 1) {
                        if (response.payload.paymentProvider == 'stripe') {
                            const stripePromise = loadStripe(response.payload.stripePublicKey, {
                                stripeAccount: response.payload.accountId
                            });
                            stripePromise.then(stripe => {
                                event.target.disabled = false;
                                ref.current.complete();
                                stripe.redirectToCheckout({
                                    sessionId: response.payload.sessionId
                                }).then(function (result) {
                                    // If `redirectToCheckout` fails due to a browser or network
                                    // error, display the localized error message to your customer
                                    // using `result.error.message`.
                                    toast.error(result.error.message);
                                });
                            });
                        }

                    } else {
                        toast.error(response.message);
                    }
                })
            } else {

            }
        } else {
            router.push('/user/login')
        }
    }

    useLayoutEffect(() => {
        if (status == 'failed') {
            toast.error('Something went wrong while processing payment.');
        }
    }, [status]);

    useEffect(() => {
        if (cart) {
            const newCart = [];
            for (let i = 0; i < cart.saleDetails.length; i++) {
                const items = cart.saleDetails.filter(p => p.itemid == cart.saleDetails[i].itemid);
                if (newCart.findIndex(p => p.itemid == cart.saleDetails[i].itemid) < 0) {
                    items[0].count = items.length;
                    newCart.push(items[0]);
                }
            }
            setSaleItems(newCart);
            setCartData(cart);
        }
    }, [cart]);

    const removeItem = (itemId) => {
        setSaleItems(items => items = items.filter(p => p.itemid != itemId));

        let myCart = sessionStorage.getItem(cartName);
        if (myCart) {
            const saleDetails = cart.saleDetails.filter(p => p.itemid != itemId);
            myCart = { ...JSON.parse(myCart), ...{ saleDetails } };
            sessionStorage.setItem(cartName, JSON.stringify(myCart));
            setCartData(myCart);
        }
    }

    return <div className="order-checkout">
        <LoadingBar color='#3b3a3a' ref={ref} />
        <Header title="Checkout"></Header>
        <div className="section">
            <div className="row checkout-item">
                {saleItems.map((item, i) => {
                    return <div key={i} className="col-4 mt-2 cart-item">
                        <div onClick={() => removeItem(item.itemid)} className="remove-cart-item"><CloseCircleOutline className="" /></div>
                        <div className="count-cart-item">{item.count}</div>
                        <div className="card item-card card-border p-0">
                            <Image src={item.detailimageurl ? item.detailimageurl : '/images/food/wide1.jpg'} width={250} height={250} objectFit="cover" priority={true} className="card-img-top" alt="image" />
                            <h4>{item.name}</h4>
                        </div>
                    </div>
                })}
            </div>
        </div>
        <div className="section mt-3">
            <div className="border-bottom">
                <div className="total-item">
                    <h4>Total Items</h4>
                    <h4>{cartData && cartData.saleDetails.length}</h4>
                </div>
                <div className="total-amount">
                    <h4>Total Amount</h4>
                    <h4>{cartData && cartData.saleDetails.reduce((a, b) => { return a + b.total }, 0).toFixed(2)}</h4>
                </div>
            </div>
        </div>

        <div className="section mt-4">
            <button className="btn btn-primary btn-shadow btn-lg btn-block mt-2" onClick={(e) => payNow(e)}>Pay Now</button>
        </div>
    </div>
}

Checkout.defaultProps = {
    name: 'Checkout',
    title: 'Checkout',
    showBack: true,
    showCart: false
}

export default Checkout;