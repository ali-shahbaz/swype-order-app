import { useRouter } from 'next/router';
import { MenuOutline, ChevronBackOutline, CartOutline } from 'react-ionicons'
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { cartState } from '../states/atoms';
import useSessionStorage from '../hooks/useSessionStorage';
import React, { useEffect, useRef, useState } from 'react';
import { apiSettings } from '../configs/api-settings';
import { GetRestaurantData } from '../services/restaurant-service';


function Layout({ props, children, name }) {
    const router = useRouter();
    let { id, sidebar } = router.query;
    // const data = useSessionStorage('init_data')
    const cartCount = useRecoilValue(cartState);
    const [title, setTitle] = useState('');
    const [showCart, setShowCart] = useState(false);
    const [showBack, setShowBack] = useState(false);
    const [data, setData] = useState(null);
    let restData = useRef(null);
    const sidebarBtnRef = useRef(null);


    // if (!id && data) {
    //     id = data.payload.data.id;
    // }
    const cartStorage = useSessionStorage(`cart${id}`);
    useEffect(() => {
        // clear
        const clearInput = document.querySelectorAll(".clear-input");
        clearInput.forEach(function (el) {
            el.addEventListener("click", function () {
                const parent = this.parentElement;
                const input = parent.querySelector(".form-control");
                input.focus();
                input.value = "";
                parent.classList.remove("not-empty");
            });
        });

        // active
        const formControl = document.querySelectorAll(".form-group .form-control");
        formControl.forEach(function (el) {
            // active
            el.addEventListener("focus", () => {
                var parent = el.parentElement;
                parent.classList.add("active");
            });
            el.addEventListener("blur", () => {
                var parent = el.parentElement;
                parent.classList.remove("active");
            });
            // empty check
            el.addEventListener("keyup", log);
            function log(e) {
                var inputCheck = this.value.length;
                if (inputCheck > 0) {
                    this.parentElement.classList.add("not-empty");
                } else {
                    this.parentElement.classList.remove("not-empty");
                }
            }
        });

        console.log('component name: ' + name);
        switch (name) {
            case 'tables':
                setTitle('Select Your Section');
                setShowBack(true);
                break;
            case 'menu':
                setTitle('Menu');
                setShowBack(true);
                setShowCart(true);
                break;
            case 'itemdetail':
                setTitle('Item');
                setShowBack(true);
                setShowCart(true);
                break;
            case 'order':
                setTitle('My Orders');
                break;
            case 'profile':
                setTitle('My Profile');
                break;
            case 'confirmaddress':
                setTitle('Confirm Your Address');
                setShowBack(true);
                setShowCart(false);
                break;
            case 'deliveryaddressedit':
                setTitle('Edit');
                setShowBack(true);
                setShowCart(false);
                break;
            case 'home':
                setTitle('Restaurants');
                break;
            case 'login':
                setTitle('Login');
                break;
            case 'loginverify':
                setTitle('SMS');
                setShowBack(true);
                break;
            case 'checkout':
                setTitle('Checkout');
                setShowBack(true);
                setShowCart(false);
                break;
            case 'ordersuccess':
                setTitle('Confirmed');
                break;
            case 'orders':
                setTitle('Reciepts');
                break;
            case 'orderdetail':
                setTitle('Your Order');
                break;
            default:
                break;
        }

        const storageData = window.localStorage.getItem('init_data');
        if (!storageData || (id && JSON.parse(storageData).id != id)) {
            GetRestaurantData(id).then(data => {
                if (data.status == 1) {
                    localStorage.setItem('init_data', JSON.stringify(data.payload.data));
                    setData(data.payload.data);
                }

            });
        } else {
            const value = localStorage.getItem('init_data');
            const data = !!value ? JSON.parse(value) : undefined;
            restData.current = data;
        }

        if (sidebar == 1) {
            setTimeout(() => {
                sidebarBtnRef.current.click();
            }, 100);
        }


    }, [id, name, sidebar]);

    return <>
        {name == 'restaurant' ? (<>
            <div className="appHeader order-welcome-header">
                <div className="left">
                    <a href="#" ref={sidebarBtnRef} className="headerButton" data-bs-toggle="modal" data-bs-target="#sidebarPanel">
                        <MenuOutline class="md hydrated" />
                    </a>
                </div>
            </div></>) :
            (<div className="appHeader">

                <div className="left">
                    {showBack ? <div onClick={() => router.back()} className="headerButton">
                        <ChevronBackOutline />
                    </div> : <a href="#" id='hamburgerMenu' className="headerButton" data-bs-toggle="modal" data-bs-target="#sidebarPanel">
                        <MenuOutline class="md hydrated" />
                    </a>}
                </div>

                <div className="pageTitle">{title}</div>
                {
                    showCart && <div className="right">
                        <Link href={`/restaurant/${id}/checkout`}>
                            <a className="headerButton">
                                <CartOutline />
                                <div className="badge badge-danger">{cartCount != 0 ? cartCount : cartStorage && cartStorage.saleDetails.length}</div>
                            </a>
                        </Link>
                    </div>
                }
            </div>)
        }
        <div id="appCapsule" className={name == 'restaurant' ? 'pt-0' : ''}>
            <script async
                src={`https://maps.googleapis.com/maps/api/js?key=${apiSettings.mapApiKey}&libraries=places`}>
            </script>
            {
                React.Children.map(children, (child, i) =>
                    React.cloneElement(child, { restaurantdata: restData.current || data })
                )
            }
        </div>
    </>
}

export default Layout;