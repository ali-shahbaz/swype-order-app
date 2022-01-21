import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CloseOutline, CartOutline, PricetagsOutline, ReceiptOutline, PersonOutline } from 'react-ionicons';
import { useEffect, useRef, useState } from 'react';
import { userLoggedInState } from '../states/atoms';
import { useRecoilValue } from 'recoil';
import useLocalStorage from '../hooks/useLocalStorage';
import { GetCurrentOrder } from '../services/restaurant-service';
import { RestaurantOutline } from 'react-ionicons';
import { KEY_LOGGED_IN_USER, KEY_RESTAURANT_DATA } from '../constants';
import { LocalStorageHelper } from '../helpers/local-storage-helper';


function Sidebar({ props, restaurantdata, sidebarclickedcount }) {
    const router = useRouter();
    const { query, locale } = router;
    const loggedInUserKey = KEY_LOGGED_IN_USER;
    const loggedInUser = useLocalStorage(loggedInUserKey);
    const closeRef = useRef(null);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const loggedIn = useRecoilValue(userLoggedInState);
    const [profileUrl, setProfileUrl] = useState('/user/profile');
    const [ordersUrl, setOrdersUrl] = useState('/orders');
    const [isDarkModeOn, setIsDarkModeOn] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [restaurantId, setRestaurantId] = useState();
    const sidebarPanel = useRef(null);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [currentOrderURL, setCurrentOrderURL] = useState('/');
    const [restaurantMenuUrl, setRestaurantMenuUrl] = useState('/');
    const [userData, setUserData] = useState({});
    const storedData = useLocalStorage(KEY_RESTAURANT_DATA);
    const ref = useRef();

    useEffect(() => {
        const handleRouteChange = (url, { shallow }) => {
            if (closeRef && closeRef.current)
                closeRef.current.click();
        }
        router.events.on('routeChangeStart', handleRouteChange);
        if (loggedInUser || loggedIn) {
            setProfileUrl('/user/profile');
            setOrdersUrl('/orders');
            setIsUserLoggedIn(true);
            setUserData(LocalStorageHelper.load(loggedInUserKey));

        } else {
            setProfileUrl('/user/login');
            setOrdersUrl('/user/login')
        }

        const outsideRestaurantPages = ['Profile', 'Login', 'LoginVerify', 'Orders'];

        if (outsideRestaurantPages.indexOf(props.name) >= 0) {
            ref.current = storedData;
        } else {
            ref.current = restaurantdata;
        }

        if (ref.current) {
            const lng = ref.current.welcomePageVM.profileLanguagesVM.languages.find(p => p.languagecode == locale);
            setSelectedLanguage(lng.name);

            setRestaurantId(ref.current.id);
            setCurrentOrderURL(`/restaurant/${ref.current.id}/checkout`);
            setRestaurantMenuUrl(`/restaurant/${ref.current.id}/menu`);
        }

        if (loggedInUser && sidebarclickedcount && sidebarclickedcount > 0 && loggedInUser) {
            setUserData(LocalStorageHelper.load(KEY_LOGGED_IN_USER));
            GetCurrentOrder(loggedInUser.token).then(data => {
                if (data.status == 1 && data.payload.currentorder) {
                    setCurrentOrder(data.payload.currentorder);
                    setCurrentOrderURL(`/restaurant/${ref.current.id}/order-detail/${data.payload.currentorder.orderId}`);
                }
            });
        }

        // set for dark mode
        if (!'dark-mode' in localStorage) {
            localStorage.setItem('dark-mode', false);
        } else {
            setDarkMode(JSON.parse(localStorage.getItem('dark-mode')));
        }


    }, [locale, loggedIn, loggedInUser, loggedInUserKey, props, router.events, sidebarclickedcount, storedData])

    const logout = () => {
        localStorage.removeItem(KEY_LOGGED_IN_USER);
        setIsUserLoggedIn(false);
    }

    const changeDarkMode = (event) => {
        localStorage.setItem('dark-mode', event.target.checked);
        setDarkMode(event.target.checked);
    }

    const setDarkMode = (isDarkMode) => {
        setIsDarkModeOn(isDarkMode);
        const pageBody = document.querySelector("body");
        pageBody.classList.remove('dark-mode');
        if (isDarkMode) pageBody.classList.add('dark-mode')
    }

    const changeLanguage = (lngCode) => {
        router.push(`/restaurant/${ref.current.id}`, `/restaurant/${ref.current.id}`, { locale: lngCode });
    }

    const content = <div className="modal fade panelbox panelbox-left order-sidebar" id="sidebarPanel" ref={sidebarPanel} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-body p-0">
                    <div className="profileBox pt-2 pb-2">
                        <Link href={profileUrl}>
                            <a className="user-info">
                                {
                                    userData && userData.user && userData.user.name ? <>
                                        <div className="image-wrapper">
                                            <Image src={userData.user.imageUrl ? userData.user.imageUrl : '/images/profile/profile.png'} width={56} height={56} objectFit='cover' alt="image" className="imaged" />
                                        </div>
                                        <div className="in">
                                            <strong>{userData.user.name}</strong>
                                        </div> </> : <h2 className="mb-0">Set Up Your Profile</h2>
                                }
                            </a>
                        </Link>
                        <a href="#" ref={closeRef} className="btn btn-link btn-icon sidebar-close" data-bs-dismiss="modal">
                            <CloseOutline className="switchSVGColor" />
                        </a>
                    </div>
                    <div className="bg-primary">
                        {
                            (currentOrder) ? <div className="sidebar-balance">
                                <div className="title-wrapper">
                                    <div className="order-id">Current Order Id: #{currentOrder?.orderNumber}</div>
                                    <span className="order-date text-muted">Placed {currentOrder?.dateLabel}</span>
                                </div>
                                <div className="in mt-2">
                                    <h1 className="amount">{currentOrder?.amount.toFixed(2)}</h1>
                                    <span className="text-success">{currentOrder?.paymentStatus}</span>
                                </div>

                                <div className="section full mt-1">
                                    <div className="wide-block p-0">

                                        <div className="input-list">
                                            <div className="form-check">

                                                <input type="checkbox" className="form-check-input" id="orderConfirmed"
                                                    checked={currentOrder && currentOrder?.orderStatusDone.indexOf('OrderConfirmed') > -1}
                                                    disabled={true}
                                                />
                                                <label className="form-check-label" htmlFor="orderConfirmed">Order Confirmed</label>
                                            </div>
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="preparingOrder"
                                                    disabled={true}
                                                    checked={currentOrder && currentOrder?.orderStatusDone.indexOf('InProgress') > -1}
                                                />
                                                <label className="form-check-label" htmlFor="preparingOrder">We are preparing your
                                                    order</label>
                                            </div>
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="EnjoyOrder"
                                                    disabled={true}
                                                    checked={currentOrder && currentOrder?.orderStatusDone.indexOf('Completed') > -1}

                                                />
                                                <label className="form-check-label" htmlFor="EnjoyOrder">Enjoy</label>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                                :
                                <div className="bg-primary">
                                    <div className="sidebar-balance py-4">
                                        <strong>Start Your Order Here</strong>
                                    </div>
                                </div>
                        }

                    </div>
                    <ul className="listview flush transparent no-line image-listview">
                        <li>
                            <Link href={currentOrderURL}>
                                <a className="item">
                                    <div className="icon-box bg-primary card-border">
                                        <CartOutline color="#FFF" />
                                    </div>
                                    <div className="in">
                                        My Current Order
                                    </div>
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href={restaurantMenuUrl}>
                                <a className="item">
                                    <div className="icon-box bg-primary card-border">
                                        <PricetagsOutline color="#FFF" />
                                    </div>
                                    <div className="in">
                                        Menu
                                    </div>
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href={ordersUrl}>
                                <a className="item">
                                    <div className="icon-box bg-primary card-border">
                                        <ReceiptOutline color="#FFF" />
                                    </div>
                                    <div className="in">
                                        Receipts
                                    </div>
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href={profileUrl}>
                                <a className="item">
                                    <div className="icon-box bg-primary card-border">
                                        <PersonOutline color="#FFF" />
                                    </div>
                                    <div className="in">
                                        My Profile
                                    </div>
                                </a>
                            </Link>
                        </li>
                    </ul>
                    <div className="sidebar-preferred-lang mt-2">
                        <div className="section full">
                            <div className="wide-block py-2">
                                <h4>Select preferred language</h4>
                                <ul id="sidebarLangFlag" className="sidebar-lang-flag my-2">
                                    {ref.current && ref.current.welcomePageVM.profileLanguagesVM.languages.map((item, index) => {
                                        return <li key={item.languagecode} title={item.languagecode} onClick={() => changeLanguage(item.languagecode)} className={locale == item.languagecode ? 'sidebar-single-flag sidebar-flag-active' : 'sidebar-single-flag'}>
                                            <Image src={`/images/flag/${item.name.toLowerCase()}.jpg`} width={40} height={40} objectFit='' alt={item.languagecode} />
                                        </li>
                                    })}
                                </ul>
                                <p id="sidebarLangNameShow">{selectedLanguage}</p>
                            </div>
                        </div>
                    </div>
                    <ul className="listview darkmode-switcher image-listview text inset no-line mt-2">
                        <li>
                            <div className="item">
                                <div className="in">
                                    <div className="form-check form-switch me-2">
                                        <input checked={isDarkModeOn ? true : false} onChange={(e) => changeDarkMode(e)} className="form-check-input dark-mode-switch" type="checkbox"
                                            id="darkmodeSwitch" />
                                        <label className="form-check-label" htmlFor="darkmodeSwitch"></label>
                                    </div>
                                    <div>
                                        Dark Mode
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div className="section log-out-btn mt-3">
                        {isUserLoggedIn ? (<button className="btn bg-primary btn-shadow btn-lg" onClick={logout}>Logout</button>) :
                            <Link href="/user/login">
                                <a className="btn bg-primary btn-shadow btn-lg">Login</a>
                            </Link>
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>

    return content;
}

export default Sidebar;