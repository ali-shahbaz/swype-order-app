import Image from 'next/image';
import useSessionStorage from '../../../hooks/useSessionStorage';
import { useRouter } from 'next/router';
import { PlaceOrder } from '../../../services/restaurant-service';
import { useLayoutEffect, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { toast } from 'react-toastify';
import Header from '../../../components/head';
import { loadStripe } from '@stripe/stripe-js';

const Checkout = () => {
    const router = useRouter();
    const { id, status } = router.query;
    const cart = useSessionStorage(`cart${id}`);
    const loggedInUser = useSessionStorage('logged_in_user');
    const ref = useRef(null);

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

    return <div className="order-checkout">
        <LoadingBar color='#3b3a3a' ref={ref} />
        <Header title="Checkout"></Header>
        <div className="section">
            <div className="row checkout-item">
                {cart && cart.saleDetails.map((item, i) => {
                    return <div key={i} className="col-4 mt-2">
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
                    <h4>{cart && cart.saleDetails.length}</h4>
                </div>
                <div className="total-amount">
                    <h4>Total Amount</h4>
                    <h4>{cart && cart.saleDetails.reduce((a, b) => { return a + b.total }, 0).toFixed(2)}</h4>
                </div>
            </div>
        </div>

        <div className="section mt-4">
            <button className="btn btn-primary btn-shadow btn-lg btn-block mt-2" onClick={(e) => payNow(e)}>Pay Now</button>
        </div>
    </div>
}

export default Checkout;