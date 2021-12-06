import { useRouter } from 'next/router';
import { MenuOutline, ChevronBackOutline, CartOutline } from 'react-ionicons'
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { cartState } from '../states/atoms';
import useSessionStorage from '../hooks/useSessionStorage';
import { useEffect } from 'react';


function Layout({ props, children, name }) {
    const router = useRouter();
    const cartCount = useRecoilValue(cartState);
    const cartStorage = useSessionStorage('cart');
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
                    <Link href="/checkout">
                        <a className="headerButton">
                            <CartOutline />
                            <div className="badge badge-danger">{cartCount != 0 ? cartCount : cartStorage && cartStorage.length}</div>
                        </a>
                    </Link>
                </div>
            </div></>)}
        <div id="appCapsule" className={name == 'restaurant' ? 'pt-0' : ''}>
            {children}
        </div>
    </>
    return content;
}

export default Layout;