import Image from 'next/image';
import Header from '../../components/head';
import React, { useCallback, useEffect, useState } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useLocalStorage from '../../hooks/useLocalStorage';

const Restaurant = ({ restaurantdata }) => {
    const [offers, setOffers] = useState([]);
    const userLoggedIn = useLocalStorage('logged_in_user');
    const router = useRouter();
    const { query, locale } = router;
    const { id } = query;
    const [orderUrl, setOrderUrl] = useState(`/restaurant/${id}/menu`);
    const { t } = useTranslation();
    const cartName = `cart${id}`;
    const [selectedLanguage, setSelectedLanguage] = useState('');

    const startWithOrderType = useCallback((orderType) => {
        orderType = parseInt(orderType);
        let cart = sessionStorage.getItem(cartName);
        if (cart) {
            cart = { ...JSON.parse(cart), ...{ onlineOrderType: orderType } };
            sessionStorage.setItem(cartName, JSON.stringify(cart));
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
                salePayments: [{
                    paymentMethodId: 0,
                    paymentTypeId: 0,
                    amount: 0
                }],
                onlineOrderType: orderType,
                verifyfullname: userFullName,
                verifymobile: userNumber

            }
            sessionStorage.setItem(cartName, JSON.stringify(orderObj));
        }
    }, [cartName, userLoggedIn]);

    useEffect(() => {
        startWithOrderType(1);
        if (restaurantdata) {
            const lng = restaurantdata.welcomePageVM.profileLanguagesVM.languages.find(p => p.languagecode == locale);
            setSelectedLanguage(lng.name);
            setOffersData(restaurantdata);
        }

    }, [locale, id, restaurantdata, startWithOrderType]);

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
        if (val == 1 || (restaurantdata.quickTables.length == 0 && val != 2)) {
            setOrderUrl(`/restaurant/${id}/menu`);
        } else if (val == 3) {
            setOrderUrl(`/restaurant/${id}/tables`);
        } else {
            setOrderUrl(`/restaurant/${id}/confirm-address`);
        }
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
                    <Image src={restaurantdata.logo} width={124} height={104} alt="under logo" />
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

        <div className="wide-block border-0">
            <div className="options content-center">
                <div className="btn-group" role="group" onChange={(e) => orderTypeChange(e)}>
                    <input type="radio" className="btn-check" value="1" name="btnRadioOrderType" id="TakeAway" defaultChecked />
                    <label className="btn btn-outline-primary" htmlFor="TakeAway">Take Away</label>

                    <input type="radio" className="btn-check" value="3" name="btnRadioOrderType" id="DineIn" />
                    <label className="btn btn-outline-primary" htmlFor="DineIn">Dine In</label>

                    <input type="radio" className="btn-check" value="2" name="btnRadioOrderType" id="Delivery" />
                    <label className="btn btn-outline-primary" htmlFor="Delivery">Delivery</label>
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
                                    <Image src={item.detailimageurl} width={300} height={150} layout="responsive" className="card-img-top" alt={item.name} />
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

