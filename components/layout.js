import { useRouter } from 'next/router';
import { MenuOutline, ChevronBackOutline, CartOutline } from 'react-ionicons'
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { cartState } from '../states/atoms';
import useSessionStorage from '../hooks/useSessionStorage';
import React, { useEffect, useRef, useState } from 'react';
import { apiSettings } from '../configs/api-settings';
import { GetRestaurantData } from '../services/restaurant-service';
import { LocalStorageHelper } from '../helpers/local-storage-helper';
import { KEY_CART, KEY_RESTAURANT_DATA, KEY_LAST_VISITED_ITEM } from '../constants';


function Layout({ props = {}, children }) {
    const router = useRouter();
    let { id, sidebar } = router.query;
    const { push, asPath } = useRouter()
    const cartCount = useRecoilValue(cartState);
    const [data, setData] = useState(null);
    let restData = useRef(null);
    const sidebarBtnRef = useRef(null);
    const cartKey = `${KEY_CART}-${id}`;
    const cartStorage = useSessionStorage(cartKey);
    const [sidebarclickedcount, setSidebarClickedCount] = useState(0);

    useEffect(() => {
        // clear
        setTimeout(() => {
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
        }, 100);


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

        const storageData = LocalStorageHelper.load(KEY_RESTAURANT_DATA);
        if (id) {
            if (!storageData || storageData.id != id) {
                GetRestaurantData(id).then(response => {
                    if (response.status == 1) {
                        LocalStorageHelper.store(KEY_RESTAURANT_DATA, response.payload.data);
                        setData(response.payload.data);
                    }

                });
            } else {
                restData.current = LocalStorageHelper.load(KEY_RESTAURANT_DATA);
                // setTimeout(() => {
                //     GetRestaurantData(data.id).then(response => {
                //         if (response.status == 1) {
                //             localStorage.setItem('init_data', JSON.stringify(response.payload.data));
                //         }

                //     });
                // }, 1000);
            }
        }


        function delQuery(asPath) {
            return asPath.split('?')[0]
        }

        if (sidebar == 1) {
            push(delQuery(asPath));
            setTimeout(() => {
                sidebarBtnRef.current.click();
            }, 100);
        }


    }, [asPath, id, push, sidebar]);

    function SidebarClickedEvent(event) {
        setSidebarClickedCount(++sidebarclickedcount);
        return false;
    }

    const goBack = (e) => {
        const restaurantId = id || LocalStorageHelper.load(KEY_RESTAURANT_DATA).id;
        if (props.name == 'Checkout') {
            router.push(`/restaurant/${restaurantId}/menu`);
        } else if (props.name == 'ItemDetail') {
            router.push(`/restaurant/${restaurantId}/menu`);
        } else if (props.name == 'Menu' || props.name == 'ConfirmAddress') {
            router.push(`/restaurant/${restaurantId}`);
        } else if (props.name == 'DeliveryAddressEdit') {
            router.push(`/restaurant/${restaurantId}/confirm-address`);
        } else {
            router.back();
        }
    }

    return <>
        {props.name == 'Restaurant' ? (<>
            <div className="appHeader order-welcome-header">
                <div className="left">
                    <a ref={sidebarBtnRef} onClick={SidebarClickedEvent} className="headerButton" data-bs-toggle="modal" data-bs-target="#sidebarPanel">
                        <MenuOutline className="md hydrated switchSVGColor" />
                    </a>
                </div>
            </div></>) :
            (<div className="appHeader">

                <div className="left">
                    {props.showBack ? <div onClick={(e) => goBack(e)} className="headerButton">
                        <ChevronBackOutline className="switchSVGColor" />
                    </div> : <a href="#" id='hamburgerMenu' onClick={SidebarClickedEvent} className="headerButton" data-bs-toggle="modal" data-bs-target="#sidebarPanel">
                        <MenuOutline className="md hydrated switchSVGColor" />
                    </a>}
                </div>

                <div className="pageTitle">{props.title}</div>
                {
                    props.showCart && <div className="right">
                        <Link href={`/restaurant/${id}/checkout`}>
                            <a className="headerButton">
                                <CartOutline className="switchSVGColor" />
                                <div className="badge badge-danger">{cartCount != 0 ? cartCount : cartStorage && cartStorage.saleDetails.length}</div>
                            </a>
                        </Link>
                    </div>
                }
            </div>)
        }
        <div id="appCapsule" className={props.name == 'Restaurant' ? 'pt-0' : ''}>
            <script async
                src={`https://maps.googleapis.com/maps/api/js?key=${apiSettings.mapApiKey}&libraries=places`}>
            </script>
            {
                React.Children.map(children, (child, i) =>
                    React.cloneElement(child, { restaurantdata: restData.current || data, sidebarclickedcount: sidebarclickedcount || null })
                )
            }
        </div>
    </>
}

export default Layout;