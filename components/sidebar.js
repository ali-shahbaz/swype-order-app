import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CloseOutline, CartOutline, PricetagsOutline, ReceiptOutline, PersonOutline } from 'react-ionicons';
import { useEffect, useRef, useState } from 'react';
import { userLoggedInState } from '../states/atoms';
import { useRecoilValue } from 'recoil';
import useLocalStorage from '../hooks/useLocalStorage';


function Sidebar({ restaurantdata }) {
    const router = useRouter();
    const { query, locale } = router;
    const { id } = query;
    const loggedInUser = useLocalStorage('logged_in_user');
    const closeRef = useRef(null);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const loggedIn = useRecoilValue(userLoggedInState);
    const [profileUrl, setProfileUrl] = useState('/user/profile');
    const darkModeName = `dark-mode-${id}`;
    const [isDarkModeOn, setIsDarkModeOn] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('');

    useEffect(() => {
        const handleRouteChange = (url, { shallow }) => {
            if (closeRef && closeRef.current)
                closeRef.current.click();
        }
        router.events.on('routeChangeStart', handleRouteChange);
        if (loggedInUser || loggedIn) {
            setProfileUrl('/user/profile');
            setIsUserLoggedIn(true);
        } else {
            setProfileUrl('/user/login');
        }

        // set for dark mode
        if (!darkModeName in localStorage) {
            localStorage.setItem(darkModeName, false);
        } else {
            setDarkMode(JSON.parse(localStorage.getItem(darkModeName)));
        }

        if (restaurantdata) {
            const lng = restaurantdata.welcomePageVM.profileLanguagesVM.languages.find(p => p.languagecode == locale);
            setSelectedLanguage(lng.name);
        }

    }, [darkModeName, locale, loggedIn, loggedInUser, restaurantdata, router.events])

    const logout = () => {
        sessionStorage.removeItem('logged_in_user');
        setIsUserLoggedIn(false);
    }

    const changeDarkMode = (event) => {
        localStorage.setItem(darkModeName, event.target.checked);
        setDarkMode(event.target.checked);
    }

    const setDarkMode = (isDarkMode) => {
        setIsDarkModeOn(isDarkMode);
        const pageBody = document.querySelector("body");
        pageBody.classList.remove('dark-mode');
        if (isDarkMode) pageBody.classList.add('dark-mode')
    }

    const changeLanguage = (lngCode) => {
        router.push(`/restaurant/${id}`, `/restaurant/${id}`, { locale: lngCode });
    }

    const content = <div className="modal fade panelbox panelbox-left order-sidebar" id="sidebarPanel" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-body p-0">
                    <div className="profileBox pt-2 pb-2">
                        <Link href={profileUrl}>
                            <a className="user-info">
                                {
                                    loggedInUser && loggedInUser.user.name ? <>
                                        <div className="image-wrapper">
                                            <Image src={loggedInUser.user.imageUrl ? loggedInUser.user.imageUrl : '/images/profile/profile.png'} width={36} height={36} objectFit='cover' alt="image" className="imaged w36" />
                                        </div>
                                        <div className="in">
                                            <strong>{loggedInUser.user.name}</strong>
                                        </div> </> : <h2 className="mb-0">Set Up Your Profile</h2>
                                }
                            </a>
                        </Link>
                        <a href="#" ref={closeRef} className="btn btn-link btn-icon sidebar-close" data-bs-dismiss="modal">
                            <CloseOutline className="switchSVGColor" />
                        </a>
                    </div>
                    <div className="bg-primary">
                        <div className="sidebar-balance">
                            <div className="title-wrapper">
                                <div className="order-id">Current Order Id: #1020</div>
                                <span className="order-date text-muted">Placed Today 08:20 PM</span>
                            </div>
                            <div className="in mt-2">
                                <h1 className="amount">17.00</h1>
                                <span className="text-success">Paid</span>
                            </div>

                            <div className="section full mt-1">
                                <div className="wide-block p-0">

                                    <div className="input-list">
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="orderConfirmed" />
                                            <label className="form-check-label" htmlFor="orderConfirmed">Order Confirmed</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="preparingOrder" />
                                            <label className="form-check-label" htmlFor="preparingOrder">We are preparing your
                                                order</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="EnjoyOrder" />
                                            <label className="form-check-label" htmlFor="EnjoyOrder">Enjoy</label>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <ul className="listview flush transparent no-line image-listview">
                        <li>
                            <Link href={`/restaurant/${id}/menu`}>
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
                            <Link href={`/restaurant/${id}/menu`}>
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
                            <Link href="/orders">
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
                            <Link href="/user/profile">
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
                                    {restaurantdata && restaurantdata.welcomePageVM.profileLanguagesVM.languages.map((item, index) => {
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
                            <div className="item darkMode">
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