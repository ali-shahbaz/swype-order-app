import Image from 'next/image';
import Header from '../../components/head';
import React, { useEffect, useState } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import Link from 'next/link';
import useSessionStorage from '../../hooks/useSessionStorage';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Restaurant = (params) => {
    let state = useSessionStorage('init_data');
    const [orderUrl, setOrderUrl] = useState();
    const router = useRouter();
    const { id } = router.query;
    const { t } = useTranslation();

    let offers;
    if (state) {
        state = state.payload.data;
        offers = state.welcomePageVM.todaySpecials.map((value, index) => {
            const product = state.quickProducts.find(p => p.itemid == value.itemId);
            product.salesprice = value.price;
            return product;
        });
    }

    useEffect(() => {
        if (state && state.quickTables.length == 0) {
            setOrderUrl(`/restaurant/${id}/menu?type=1`);
        } else {
            setOrderUrl(`/restaurant/${id}/tables?type=3`);
        }
    }, [id, state]);

    const orderTypeChange = (event) => {
        const val = event.target.value.toLowerCase();
        if (val == 1 || val == 2 || state.quickTables.length == 0) {
            setOrderUrl(`/restaurant/${id}/menu?type=${val}`);
        } else {
            setOrderUrl(`/restaurant/${id}/tables?type=${val}`);
        }
    }

    const changeLanguage = (lngCode) => {
        router.push(`/restaurant/${id}`, `/restaurant/${id}`, { locale: lngCode });
    }

    if (!state) return <>Loading..</>
    const content = <div id="appCapsule" className="pt-0">
        <Header title={state.welcomePageVM.header}></Header>
        <div className="section full welcome-cover">
        </div>
        <div className="section full welcome-section">
            <div className="wide-block py-2">
                <div className="under-logo">
                    <Image src={state.logo} width={124} height={104} alt="under logo" />
                </div>
                <div className="welcome-txt mt-2">
                    <h2>{state.welcomePageVM.header}</h2>
                    {(state.welcomePageVM.message ?
                        <h4>{state.welcomePageVM.message}</h4> : <></>)}
                </div>
            </div>
        </div>
        <div className="preferred-lang">
            <div className="section full">
                <div className="wide-block py-2">
                    <h3>Select preferred language</h3>
                    <ul id="langFlag" className="lang-flag my-2">
                        {state.welcomePageVM.profileLanguagesVM.languages.map((item, index) => {
                            return <li key={item.languagecode} title={item.languagecode} onClick={() => changeLanguage(item.languagecode)} className="single-flag">
                                <Image src={`/images/flag/${item.name.toLowerCase()}.jpg`} width={40} height={40} alt="en" />
                            </li>
                        })}
                    </ul>
                    <p id="langNameShow">English (American) {t('welcome')}</p>
                </div>
            </div>
        </div>

        <div className="wide-block border-0">
            <div className="options content-center">
                <div className="btn-group" role="group" onChange={(e) => orderTypeChange(e)}>
                    <input type="radio" className="btn-check" value="3" name="btnRadioOrderType" id="DineIn" defaultChecked />
                    <label className="btn btn-outline-primary" htmlFor="DineIn">Dine In</label>

                    <input type="radio" className="btn-check" value="1" name="btnRadioOrderType" id="TakeAway" />
                    <label className="btn btn-outline-primary" htmlFor="TakeAway">Take Away</label>

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
                                    <Image src={item.detailimageurl} width={300} height={150} layout="responsive" className="card-Image-top" alt={item.name} />
                                    <div className="card-body">
                                        <div className="card-text">
                                            <div>
                                                <h5>{item.name}</h5>
                                                <h6>{item.description}</h6>
                                            </div>
                                            <h3>{item.salesprice}</h3>
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

export const getServerSideProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale),
    },
})

export default Restaurant;

