import { MenuOutline, ChevronBackOutline } from 'react-ionicons'
import { useRouter } from 'next/router'

function Layout({ props, children, name }) {
    const router = useRouter();
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
                <div className="pageTitle">{name}</div>
            </div></>)}
        <div id="appCapsule" className={name == 'restaurant' ? 'pt-0' : ''}>
            {children}
        </div>
    </>
    return content;
}

export default Layout;