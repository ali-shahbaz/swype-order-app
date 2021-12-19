import { useEffect, useRef, useState } from 'react'
import useSessionStorage from '../../../hooks/useSessionStorage';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../../components/head';
import { useRecoilState } from 'recoil';
import { menuTabState } from '../../../states/atoms';
const Menu = ({ props }) => {
    let state = useSessionStorage('init_data');
    const tabRef = useRef(null);
    const router = useRouter();
    const { id, type, table } = router.query;
    const [menu, setMenu] = useState(null);
    const [tab, setTab] = useRecoilState(menuTabState);


    useEffect(() => {
        setTimeout(() => {
            if (tabRef && tabRef.current) {
                tabRef.current.click();
            }
        }, 0);
    }, [tabRef])

    const categoryClick = (event, categoryID) => {
        setTab(event.currentTarget);
        const filterMenuChildren = event.currentTarget.parentElement.children;
        for (let i = 0; i < filterMenuChildren.length; i++) {
            filterMenuChildren[i].classList.remove('category-active');
        }
        event.currentTarget.classList.add('category-active');
        const products = state.quickProducts.filter(p => p.categoryid == categoryID);
        setMenu(products);
    }

    if (!state) return <></>
    state = state.payload.data;
    return <>
        <Header title="Menu"></Header>
        <ul id="menuCategory" className="categories pt-1 pb-1">
            {
                state.quickKeyCategoryList.map((item, i) => {
                    return <li key={item.categoryID} ref={el => i == 0 ? tabRef.current = el : null} onClick={(e) => categoryClick(e, item.categoryID)} className="single-category" data-target={item.name}>
                        <span>{item.name}</span>
                    </li>
                })
            }
        </ul>
        <div className="section row menu-filter-item px-3">
            {
                (menu && menu.map(item => {
                    return <div key={item.itemid} className="col-6 menu-card item-card section mt-2 filter-active" data-item={item.categoryname}>
                        <Link href={`/restaurant/${id}/item-detail/${item.itemid}`}>
                            <a>
                                <div className="card card-border">
                                    <Image src={item.detailimageurl ? item.detailimageurl : '/images/food/wide1.jpg'} width={250} height={120} objectFit="cover" priority={true} className="card-img-top" alt="image" />
                                    <div className="card-body p-1">
                                        <div className="left">
                                            <h5 className="card-title">{item.name}</h5>
                                            <h6 className="card-text">{item.description}</h6>
                                        </div>
                                        <div className="right">
                                            <h3>{item.salesprice}</h3>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </Link>
                    </div>
                }))
            }
        </div>
    </>
}

export default Menu