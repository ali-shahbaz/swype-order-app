import { useLayoutEffect, useState } from 'react';
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import { LoginUser } from '../../services/user-service';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';
import Header from '../../components/head';
import { KEY_USER_NUMBER, KEY_LOCATION, KEY_RESTAURANT_DATA, KEY_CART } from '../../constants';
import { LocalStorageHelper } from '../../helpers/local-storage-helper';
import { PlaceOrder } from '../../services/restaurant-service';
import { loadStripe } from '@stripe/stripe-js';

const Login = () => {
    const [number, setNumber] = useState(null);
    const router = useRouter();
    const { nav } = router.query;
    const ref = useRef(null);

    useLayoutEffect(() => {
        if (document) {
            const element = document.getElementById('phoneNumber');
            if (element) {
                element.addEventListener('keypress', (evt) => {
                    evt = (evt) ? evt : window.event;
                    var charCode = (evt.which) ? evt.which : evt.keyCode;
                    if (charCode != 43 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                        evt.preventDefault();
                    }
                    return true;
                })
            }
        }
    }, [])

    const singin = (event) => {
        if (number && number.isValid) {
            event.target.disabled = true;
            ref.current.continuousStart();

            number.MobileNumber = number.MobileNumber.replace(new RegExp(' ', 'g'), '').replace(new RegExp('-', 'g'), ''); //remove all spaces in number
            setNumber(number);
            LoginUser(JSON.stringify(number))
                .then(data => {
                    event.target.disabled = false;
                    ref.current.complete();
                    if (data.status == 1) {
                        LocalStorageHelper.store(KEY_USER_NUMBER, number);
                        router.push('/user/login-verify');
                    } else {
                        ref.current.complete();
                    }

                });
        } else {
            toast.error("Phone number is not valid");
        }

    }

    const changeHandler = (isValid, value, selectedCountryData, fullNumber, extension) => {
        setNumber({
            MobileNumber: fullNumber,
            isValid
        });
    }

    const payNow = (event) => {
        const storageData = LocalStorageHelper.load(KEY_RESTAURANT_DATA);
        const id = storageData.id;
        const cartKey = `${KEY_CART}-${id}`;
        const cart = LocalStorageHelper.load(cartKey);

        event.target.disabled = true;
        ref.current.continuousStart();

        const taxAmount = cart.saleDetails.reduce((a, b) => {
            return a + (b.taxAmount * b.quantity) + (b.variationName ? b.variations.find(p => p.name == b.variationName).taxamount : 0)
        }, 0).toFixed(2);

        const netTotal = cart.saleDetails.reduce((a, b) => {
            return a + (b.retailprice * b.quantity) + (b.variationName ? b.variations.find(p => p.name == b.variationName).retailprice : 0)
                + (b.selectedModifiers.length > 0 ? b.selectedModifiers.reduce((x, y) => { return x + y.price }, 0) : 0)
        }, 0).toFixed(2);

        let grandTotal = cart.saleDetails.reduce((a, b) => {
            return a + (b.total * b.quantity)
        }, 0).toFixed(2);

        grandTotal = (parseFloat(grandTotal) + (cart.tipAmount ? parseFloat(cart.tipAmount) : 0)).toFixed(2);

        const newCart = { ...cart, ...{ netTotal, taxAmount, grandTotal, amount: grandTotal } }
        newCart.salePayments[0].amount = grandTotal;
        newCart.salePayments[0].paymentTypeId = 2;

        if (newCart.onlineOrderType == 2) {
            newCart['deliveryAddress'] = LocalStorageHelper.load(KEY_LOCATION);
        }

        PlaceOrder(JSON.stringify(newCart), id, newCart.onlineOrderType, '').then(response => {
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
                else if (response.payload.paymentProvider == 'none') {
                    window.location.assign(response.payload.successURL);
                }
                else {
                    event.target.disabled = false;
                    ref.current.complete();
                }

            } else {
                event.target.disabled = false;
                ref.current.complete();
                toast.error(response.error || response.message);
            }
        })
    }

    return <div className="section">
        <Header title="Login"></Header>
        <LoadingBar color='#F07D00' ref={ref} />
        {nav && <p>We wish to notify
            you, when your order is
            ready. Please confirm
            your number below.</p>}
        <div className="card card-border mt-2">
            <div className="card-body">
                <form>
                    <div className="form-group flag-mbl-input basic">
                        <div className="input-wrapper">
                            <label className="label" htmlFor="phone">Mobile</label>
                            <IntlTelInput fieldId="phoneNumber" onPhoneNumberChange={changeHandler}
                                fieldName="phone" preferredCountries={['us', 'gb', 'es', 'se']}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div className="mt-4">
            <button className="btn btn-primary btn-shadow btn-lg btn-block mt-2" onClick={(e) => singin(e)}>{`Let's go`}</button>
        </div>
        {nav && <div className="mt-0">
            <button className="btn btn-primary btn-shadow btn-lg btn-block mt-2" onClick={(e) => payNow(e)}>{`Skip this step`}</button>
        </div>}
    </div>
}

Login.defaultProps = {
    name: 'Login',
    title: 'Add Your Number',
    showBack: true,
    showCart: false
}

export default Login;