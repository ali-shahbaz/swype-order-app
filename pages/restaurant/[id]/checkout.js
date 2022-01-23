import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PlaceOrder } from '../../../services/restaurant-service';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { toast } from 'react-toastify';
import Header from '../../../components/head';
import { loadStripe } from '@stripe/stripe-js';
import { CloseCircleOutline, CloseOutline, RemoveCircle, AddCircle } from 'react-ionicons';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { useRecoilState } from 'recoil';
import { cartState } from '../../../states/atoms';
import { LocalStorageHelper } from '../../../helpers/local-storage-helper';
import { KEY_CART, KEY_LOCATION, KEY_LOGGED_IN_USER } from '../../../constants';

const Checkout = () => {
    const router = useRouter();
    const { id, status } = router.query;
    const cartKey = `${KEY_CART}-${id}`;
    const cartStorage = useLocalStorage(cartKey);
    const loggedInUser = useLocalStorage(KEY_LOGGED_IN_USER);
    const ref = useRef(null);
    const [saleItems, setSaleItems] = useState([]);
    const [cartData, setCartData] = useState(null);

    const [cartCount, setCartCount] = useRecoilState(cartState);

    const payNow = (event) => {
        if (loggedInUser) {
            const cart = LocalStorageHelper.load(cartKey);
            event.target.disabled = true;
            ref.current.continuousStart();

            const taxAmount = cart.saleDetails.reduce((a, b) => {
                return a + b.taxAmount + (b.variationName ? b.variations.find(p => p.name == b.variationName).taxamount : 0)
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
                newCart['deliveryAddress'] = LocalStorageHelper.load(KEY_LOCATION);
            }


            PlaceOrder(JSON.stringify(newCart), id, newCart.onlineOrderType, loggedInUser.token).then(response => {
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
                    } else {
                        event.target.disabled = false;
                        ref.current.complete();
                    }

                } else {
                    event.target.disabled = false;
                    ref.current.complete();
                    toast.error(response.error || response.message);
                }
            })
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
        if (cartStorage) {
            const newCart = [];
            cartStorage.saleDetails.map((val, i) => {
                const index = newCart && newCart.findIndex(p => p.itemid == val.itemid);
                if (index >= 0) {
                    newCart[index].quantity += 1;
                    newCart[index].total += val.total;
                } else {
                    val.total = val.total * val.quantity;
                    newCart.push(val);
                }
            });
            // for (let i = 0; i < cartStorage.saleDetails.length; i++) {
            //     const items = cartStorage.saleDetails.filter(p => p.itemid == cartStorage.saleDetails[i].itemid);
            //     if (newCart.findIndex(p => p.itemid == cartStorage.saleDetails[i].itemid) < 0) {
            //         items[0].count = items.length;
            //         newCart.push(items[0]);
            //     }
            // }
            setSaleItems(newCart);
            setCartData(cartStorage);
        }
    }, [cartStorage]);

    const removeItem = (itemId) => {
        setSaleItems(items => items = items.filter(p => p.itemid != itemId));

        if (cartStorage) {
            const saleDetails = cartData.saleDetails.filter(p => p.itemid != itemId);
            cartStorage = { ...cartStorage, ...{ saleDetails } };
            LocalStorageHelper.store(cartKey, cartStorage);
            setCartData(cartStorage);
            setCartCount(cartStorage.saleDetails.reduce((prev, curr) => { return prev + curr.quantity }, 0));
        }
    }

    const addItemQty = (itemId) => {
        const item = cartData.saleDetails.find(p => p.itemid == itemId);
        if (item.variations.length == 0 && item.modifiers.length == 0) {
            item.quantity += 1;

            // update cart storage and cart count
            cartStorage = { ...cartStorage, ...{ saleDetails: cartData.saleDetails } };
            LocalStorageHelper.store(cartKey, cartStorage);
            setCartData(cartStorage);
            setCartCount(cartStorage.saleDetails.reduce((prev, curr) => { return prev + curr.quantity }, 0));

            // now update page items
            // const saleItem = saleItems.find(p => p.itemid == itemId);
            // saleItem.quantity += 1;
            // saleItem.total += item.total;

            // setSaleItems(items => items = saleItems);
        }
    }


    return <div className="order-checkout">
        <LoadingBar color='#F07D00' ref={ref} />
        <Header title="Checkout"></Header>
        <ul className="listview separate-list image-listview inset no-line no-arrow">
            {saleItems.map((item, i) => {
                return <li key={i} className="items-card card card-border">
                    <div className="item">
                        {item.detailimageurl && <Image src={item.detailimageurl} width={250} height={250} objectFit="cover" priority={true} className="image" alt="image" />}
                        <div className="in">
                            <div>
                                <h4>{item.itemName}</h4>
                                <p>{item.description}</p>
                                <div className="item-price-qnt">
                                    <h5>{item.total.toFixed(2)}</h5>
                                    <div className="qnt-incre-decre">
                                        <div className="qnt-incre-decre-bg"></div>
                                        <div className="delete-checkout-modal"></div>
                                        <div className="hide-incre-decre" onClick={() => removeItemQty(item.itemid)}>
                                            <RemoveCircle cssClasses="ion-icon" />
                                        </div>
                                        <input type="text" value={item.quantity} />
                                        <div className="show-incre-decre" onClick={() => addItemQty(item.itemid)}>
                                            <AddCircle cssClasses="ion-icon" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="delete-item-card" onClick={() => removeItem(item.itemid)}>
                        <CloseOutline />
                    </div>
                    <div className="delete-item-card-holder"></div>
                </li>

                // return <div key={i} className="col-4 mt-2 cart-item">
                //     <div title="Remove from cart" onClick={() => removeItem(item.itemid)} className="remove-cart-item"><CloseCircleOutline className="" /></div>
                //     <div className="count-cart-item" title={`${item.count} item(s)`}>{item.count}</div>
                //     <div className="card item-card card-border p-0">
                //         <Link href={`/restaurant/${id}/item-detail/${item.itemid}`}>
                //             <a>
                //                 <Image src={item.detailimageurl ? item.detailimageurl : '/images/food/wide1.jpg'} width={250} height={250} objectFit="cover" priority={true} className="card-img-top" alt="image" />
                //                 <h4 className='mt-0'>{item.itemName}</h4>
                //             </a>
                //         </Link>
                //     </div>
                // </div>
            })}
        </ul>
        {
            saleItems.length > 0 ? <>
                <div className="section mt-2">
                    <div className="grand-total-count">
                        <div className="card card-border">
                            <div className="card-body">
                                <div className="single-data">
                                    <h3>Net Total</h3>
                                    <h3>{saleItems.reduce((a, b) => { return a + b.total }, 0).toFixed(2)}</h3>
                                </div>
                                <div className="single-data">
                                    <h4>Total items</h4>
                                    <p>{saleItems.reduce((prev, curr) => { return prev + curr.quantity }, 0)}</p>
                                </div>
                                <div className="single-data">
                                    <h4>Tip</h4>
                                    <a href="#">Add</a>
                                </div>
                                <div className="single-data">
                                    <h4>Tax #1 (12%)</h4>
                                    <p>12</p>
                                </div>
                                <div className="single-data">
                                    <h4>Tax #1 (25%)</h4>
                                    <p>Add</p>
                                </div>
                                <div className="single-data">
                                    <h3>Grand Total</h3>
                                    <h3>{saleItems.reduce((a, b) => { return a + b.total }, 0).toFixed(2)}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className='mt-2'>
                        <div className="total-item">
                            <h4>Order Type</h4>
                            <h4 className='fw-normal'>{cartData && cartData.onlineOrderTypeName}</h4>
                        </div>
                        {
                            cartData.onlineOrderType == 3 && cartData.tableId != 0 && <>
                                <div className="total-item">
                                    <h4>Table Name</h4>
                                    <h4 className='fw-normal'>{cartData && cartData.tableName}</h4>
                                </div>
                            </>
                        }
                        {
                            cartData.onlineOrderType == 2 && cartData.DeliveryAddress.address && <>
                                <div className="total-item">
                                    <h4>Delivery Address</h4>
                                    <h4 className='fw-normal'>{cartData.DeliveryAddress.address}{cartData.DeliveryAddress.postalCode ? `, ${cartData.DeliveryAddress.postalCode}` : ''}
                                        {cartData.DeliveryAddress.city ? `, ${cartData.DeliveryAddress.city}` : ''}</h4>
                                </div>
                                {cartData.DeliveryAddress.notes && <>
                                    <div className="total-item">
                                        <h4>Notes</h4>
                                        <h4 className='fw-normal'>{cartData.DeliveryAddress.notes}</h4>
                                    </div>
                                </>}
                            </>
                        }
                    </div>
                </div>
                <div className="section mt-4">
                    <button className="btn btn-primary btn-shadow btn-lg btn-block mt-2" onClick={(e) => payNow(e)}>Pay Now</button>
                </div>
            </> : <>
                <div className="section mt-4">
                    <p className='text-center'>There are no items in this cart</p>
                    <Link href={`/restaurant/${id}/menu`}>
                        <a className="btn btn-primary btn-shadow btn-lg btn-block mt-2">Start Your Order</a>
                    </Link>
                </div>
            </>
        }
    </div>
}

Checkout.defaultProps = {
    name: 'Checkout',
    title: 'Checkout',
    showBack: true,
    showCart: false
}

export default Checkout;