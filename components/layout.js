import { useRouter } from 'next/router';
import { MenuOutline, ChevronBackOutline, CartOutline } from 'react-ionicons'
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { cartState } from '../states/atoms';
import useSessionStorage from '../hooks/useSessionStorage';
import { useEffect } from 'react';
import { apiSettings } from '../configs/api-settings';


function Layout({ props, children, name }) {
    const router = useRouter();
    let { id } = router.query;
    const data = useSessionStorage('init_data')
    const cartCount = useRecoilValue(cartState);

    if (!id && data) {
        id = data.payload.data.id;
    }
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
    });
    let title = '';
    switch (name) {
        case 'tables':
            title = 'Select Your Section';
            break;
        case 'menu':
            title = 'Menu';
            break;
        case 'itemdetail':
            title = 'Item';
            break;
        case 'order':
            title = 'My Orders';
            break;
        case 'profile':
            title = 'My Profile';
            break;
        case 'confirmaddress':
            title = 'Confirm Your Address';
            break;
        default:
            break;
    }

    const content = <>
        {name == 'restaurant' ? (<>
            <div className="appHeader order-welcome-header">
                <div className="left">
                    <a href="#" className="headerButton" data-bs-toggle="modal" data-bs-target="#sidebarPanel">
                        <MenuOutline class="md hydrated" />
                    </a>
                </div>
            </div></>) :
            (<> <div className="appHeader">
                <div className="left">
                    <div onClick={() => router.back()} className="headerButton">
                        <ChevronBackOutline />
                    </div>
                </div>
                <div className="pageTitle">{title}</div>
                <div className="right">
                    <Link href={`/restaurant/${id}/checkout`}>
                        <a className="headerButton">
                            <CartOutline />
                            <div className="badge badge-danger">{cartCount != 0 ? cartCount : cartStorage && cartStorage.saleDetails.length}</div>
                        </a>
                    </Link>
                </div>
            </div></>)
        }
        <div id="appCapsule" className={name == 'restaurant' ? 'pt-0' : ''}>
            <script async
                src={`https://maps.googleapis.com/maps/api/js?key=${apiSettings.mapApiKey}&libraries=places`}>
            </script>
            {children}
        </div>
    </>
    return content;
}

export default Layout;