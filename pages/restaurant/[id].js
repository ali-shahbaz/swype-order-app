import Image from 'next/image';
import Header from '../../components/head';
import React, { useCallback, useEffect, useState } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useLocalStorage from '../../hooks/useLocalStorage';
import { LocalStorageHelper } from '../../helpers/local-storage-helper';
import { KEY_CART, KEY_LOGGED_IN_USER, KEY_SELECTED_MENU, KEY_SELECTED_ORDER_TYPE } from '../../constants';

const Restaurant = ({ restaurantdata }) => {
    const [offers, setOffers] = useState([]);
    const userLoggedIn = useLocalStorage(KEY_LOGGED_IN_USER);
    const router = useRouter();
    const { query, locale } = router;
    const { id } = query;
    const [orderUrl, setOrderUrl] = useState(`/restaurant/${id}/menu`);
    const { t } = useTranslation();
    const cartKay = `${KEY_CART}-${id}`;
    const selectedMenuTabKey = `${KEY_SELECTED_MENU}-${id}`;
    const selectedOrderTypeKey = `${KEY_SELECTED_ORDER_TYPE}-${id}`;

    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [orderType, setOrderType] = useState(null);
    const selectedTabIndex = useLocalStorage(selectedMenuTabKey);
    const selectedOrderType = useLocalStorage(selectedOrderTypeKey);

    const startWithOrderType = useCallback((orderType) => {
        orderType = parseInt(orderType);
        let cart = LocalStorageHelper.load(cartKay);
        let onlineOrderTypeName = 'Take Away';
        if (orderType == 2) {
            onlineOrderTypeName = 'Delivery';
        }
        else if (orderType == 3) {
            onlineOrderTypeName = 'Dine In';
        }

        if (cart) {
            cart = { ...cart, ...{ onlineOrderType: orderType, onlineOrderTypeName } };
            LocalStorageHelper.store(cartKay, cart);
        } else {
            const userNumber = userLoggedIn ? userLoggedIn.user.mobileNumber : '';
            const userFullName = userLoggedIn ? userLoggedIn.user.name : '';
            const orderObj = {
                status: 1,
                saleDetails: [],
                label: 'Online Sales',
                isSplitCheck: false,
                equitySplitCount: 0,
                parkSplitSale: null,
                netTotal: 0,
                taxAmount: 0,
                tableId: 0,
                tableName: null,
                amount: 0,
                grandTotal: 0,
                discount: 0,
                discountAmount: 0,
                tipAmount: 0,
                tipType: 'amount',
                salePayments: [{
                    paymentMethodId: 0,
                    paymentTypeId: 0,
                    amount: 0
                }],
                onlineOrderType: orderType,
                verifyfullname: userFullName,
                verifymobile: userNumber,
                DeliveryAddress: {}
            }
            LocalStorageHelper.store(cartKay, orderObj);
        }
    }, [cartKay, userLoggedIn]);

    const setStartOrderUrl = useCallback((val) => {
        if (val == 1 || (restaurantdata && restaurantdata.quickTables.length == 0 && val != 2)) {
            setOrderUrl(`/restaurant/${id}/menu`);
        } else if (val == 3) {
            setOrderUrl(`/restaurant/${id}/tables`);
        } else {
            setOrderUrl(`/restaurant/${id}/confirm-address`);
        }
    }, [id, restaurantdata]);

    useEffect(() => {
        if (selectedTabIndex === undefined) {
            LocalStorageHelper.store(selectedMenuTabKey, 0);
        }

        if (selectedOrderType == null) {
            LocalStorageHelper.store(selectedOrderTypeKey, 1);
            setOrderType(1);
            setStartOrderUrl(1);
            startWithOrderType(1);
        } else {
            LocalStorageHelper.store(selectedOrderTypeKey, selectedOrderType);
            setOrderType(selectedOrderType);
            setStartOrderUrl(selectedOrderType);
            startWithOrderType(selectedOrderType);
        }

        if (restaurantdata) {
            const lng = restaurantdata.welcomePageVM.profileLanguagesVM.languages.find(p => p.languagecode == locale);
            setSelectedLanguage(lng.name);
            setOffersData(restaurantdata);
        }

    }, [locale, restaurantdata, selectedMenuTabKey, selectedOrderType, selectedOrderTypeKey, selectedTabIndex, setStartOrderUrl, startWithOrderType]);

    const setOffersData = (data) => {
        const offers = data.welcomePageVM.todaySpecials.map((value, index) => {
            const product = data.quickProducts.find(p => p.itemid == value.itemId);
            product.salesprice = value.price;
            return product;
        });
        setOffers(offers);
    }

    const orderTypeChange = (event) => {
        const val = event.target.value.toLowerCase();
        startWithOrderType(val);
        LocalStorageHelper.store(selectedOrderTypeKey, val);
        setOrderType(val);
        setStartOrderUrl(val);
    }

    const changeLanguage = (lngCode) => {
        router.push(`/restaurant/${id}`, `/restaurant/${id}`, { locale: lngCode });
    }

    if (!restaurantdata) return <></>
    const content = <div id="appCapsule" className="pt-0">
        <Header title={restaurantdata.welcomePageVM.header}></Header>
        <div className="section full welcome-cover">
        </div>
        <div className="section full welcome-section">
            <div className="wide-block py-2">
                <div className="under-logo">
                    <Image src={restaurantdata.logo} width={124} height={104} alt="logo" className='welcomeLogo' />
                </div>
                <div className="welcome-txt mt-2">
                    <h2>{restaurantdata.welcomePageVM.header}</h2>
                    {(restaurantdata.welcomePageVM.message ?
                        <h4>{restaurantdata.welcomePageVM.message}</h4> : <></>)}
                </div>
            </div>
        </div>
        <div className="preferred-lang">
            <div className="section full">
                <div className="wide-block py-2">
                    <h3>Select preferred language</h3>
                    <ul id="langFlag" className="lang-flag my-2">
                        {restaurantdata.welcomePageVM.profileLanguagesVM.languages.map((item, index) => {
                            return <li key={item.languagecode} title={item.languagecode} onClick={() => changeLanguage(item.languagecode)} className={locale == item.languagecode ? 'single-flag flag-active' : 'single-flag'}>
                                <Image src={`/images/flag/${item.name.toLowerCase()}.jpg`} width={40} height={40} objectFit='' alt={item.languagecode} />
                            </li>
                        })}
                    </ul>
                    <p id="langNameShow">{selectedLanguage}</p>
                </div>
            </div>
        </div>

        <div className="section d-flex justify-content-center">
            <div className="options mt-3">
                <div className="btn-group" role="group">
                    <input type="radio" className="btn-check" onChange={(e) => orderTypeChange(e)} value="1" name="btnRadioOrderType" id="TakeAway" checked={orderType == 1} />
                    <label className="btn btn-outline-primary" htmlFor="TakeAway">Take Away</label>

                    <input type="radio" className="btn-check" onChange={(e) => orderTypeChange(e)} value="3" name="btnRadioOrderType" id="DineIn" checked={orderType == 3} />
                    <label className="btn btn-outline-primary" htmlFor="DineIn">Dine In</label>

                    <input type="radio" className="btn-check" onChange={(e) => orderTypeChange(e)} value="2" name="btnRadioOrderType" id="Delivery" checked={orderType == 2} />
                    <label className="btn btn-outline-primary myDeliveryButton" htmlFor="Delivery">Delivery</label>
                </div>
            </div>
        </div>
        <h3 className="section card-title mt-3">Special Offers!</h3>

        <Splide options={{
            perPage: 2,
            rewind: true,
            gap: 16,
            padding: 16,
            arrows: false,
            pagination: false,
            breakpoints: {
                768: {
                    perPage: 2,
                },
                991: {
                    perPage: 3,
                },
            }
        }} onMoved={(splide, newIndex) => {
            console.log("moved", newIndex);
        }} className="carousel-multiple special-offer">
            {
                offers.map((item, i) => {
                    return <SplideSlide key={item.itemid.toString()}>
                        <div className="card card-border">
                            <Link href={`/restaurant/${id}/item-detail/${item.itemid}`}>
                                <a>
                                    <Image src={item.detailimageurl} width={150} height={150} layout="responsive" className="card-img-top" alt={item.name} />
                                    <div className="card-body">
                                        <div className="card-text">
                                            <div>
                                                <h5>{item.name}</h5>
                                                <h6>{item.description}</h6>
                                            </div>
                                            <h3>{item.salesprice.toFixed(2)}</h3>
                                        </div>
                                    </div>
                                </a>
                            </Link>
                        </div>
                    </SplideSlide>
                })
            }
        </Splide>

        {/* <div className="modal fade dialogbox" id="StartOrderChoose" data-bs-backdrop="static" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="text-center p-4">What Type of Order</h2>
                    </div>
                    <div className="modal-footer">
                        <div className="btn-inline">
                            <Link href={`/restaurant/1/tables`} >
                                <a className="btn btn-text-Primary">Dine In</a>
                            </Link>
                            <Link href={`/restaurant/1/menu`} >
                                <a className="btn btn-text-primary">Take Away</a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div> */}
        <div className="section next-button mt-3">
            <Link href={orderUrl}>
                <a className="btn btn-primary btn-shadow btn-lg btn-block">Start Your Order</a>
            </Link>
        </div>
    </div >

    return content;
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common'])
        }
    }
}

Restaurant.defaultProps = {
    name: 'Restaurant',
    title: '',
    showBack: false,
    showCart: false
}

export default Restaurant;

