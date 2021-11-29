import { useRouter } from 'next/router';
import { MenuOutline, ChevronBackOutline } from 'react-ionicons'


function Layout({ props, children, name }) {
    const router = useRouter();
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
            </div></>)}
        <div id="appCapsule" className={name == 'restaurant' ? 'pt-0' : ''}>
            {children}
        </div>
    </>
    return content;
}

export default Layout;