import { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../../components/head';
import { useRecoilState } from 'recoil';
import { menuTabState } from '../../../states/atoms';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { KEY_SELECTED_MENU, KEY_CART } from '../../../constants';
import { LocalStorageHelper } from '../../../helpers/local-storage-helper';
import { RemoveCircle, AddCircle } from 'react-ionicons';
import { cartState } from './../../../states/atoms';
import { getItemForCart } from '../../../helpers/cart-helper';

const Menu = ({ restaurantdata }) => {
    const tabRef = useRef(null);
    const router = useRouter();
    const { id } = router.query;
    const [menu, setMenu] = useState(null);
    const [tab, setTab] = useRecoilState(menuTabState);
    const selectedIndexKey = id && `${KEY_SELECTED_MENU}-${id}`;
    const selectedTabIndex = useLocalStorage(selectedIndexKey);
    const cartKey = `${KEY_CART}-${id}`;
    const cartStorage = useLocalStorage(cartKey);
    const [cart, setCart] = useRecoilState(cartState);


    useEffect(() => {
        if (restaurantdata) {
            if (selectedTabIndex === null) {
                LocalStorageHelper.store(selectedIndexKey, 0);
            }
            if (tabRef && tabRef.current) {
                tabRef.current.click();
            }
        }

        if (window) {
            window.onscroll = (ev) => {
                const windscroll = window.scrollY;
                if (windscroll >= 100) {
                    document.querySelectorAll('.sell-single-list').forEach((val, key) => {
                        if (val.offsetTop <= windscroll + 10) {
                            const cats = document.querySelectorAll('.categories li');
                            for (let i = 0; i < cats.length; i++) {
                                const element = cats[i];
                                element.classList.remove('category-active');

                            }

                            cats[key].classList.add('category-active');
                        }

                    });
                } else {
                    const cats = document.querySelectorAll('.categories li');
                    if (cats.length > 0) {
                        for (let i = 0; i < cats.length; i++) {
                            const element = cats[i];
                            element.classList.remove('category-active');

                        }

                        cats[0].classList.add('category-active');
                    }

                }
            }
        }

    }, [restaurantdata, selectedIndexKey, selectedTabIndex])

    const categoryClick = (event, categoryID, index) => {
        if (document.getElementById(`${categoryID}`).offsetTop >= 100) {
            document.querySelector("html, body").scrollTop = document.getElementById(`${categoryID}`).offsetTop;
        } else {
            document.querySelector("html, body").scrollTop = 1;
        }

        selectedIndexKey && LocalStorageHelper.store(selectedIndexKey, index);
        setTab(event.currentTarget);
        // const filterMenuChildren = event.currentTarget.parentElement.children;
        // for (let i = 0; i < filterMenuChildren.length; i++) {
        //     filterMenuChildren[i].classList.remove('category-active');
        // }

        // event.currentTarget.classList.add('category-active');
        const products = restaurantdata.quickProducts.filter(p => p.categoryid == categoryID);
        setMenu(products);
    }

    const increaseQty = (event, itemId) => {
        if (cartStorage) {
            const saleDetailItem = cartStorage.saleDetails.find(p => p.itemid == itemId);
            if (saleDetailItem) {
                if (saleDetailItem.variations.length > 0 || saleDetailItem.modifiers.length > 0) {
                    router.push(`/restaurant/${id}/item-detail/${itemId}`);
                } else {
                    saleDetailItem.quantity += 1;
                    LocalStorageHelper.store(cartKey, cartStorage);
                }

            } else {
                const product = restaurantdata.quickProducts.find(p => p.itemid == itemId);
                if (product && (product.variations.length > 0 || product.modifiers.length > 0)) {
                    router.push(`/restaurant/${id}/item-detail/${itemId}`);
                } else {
                    cartStorage.saleDetails.push(getItemForCart(product));
                    LocalStorageHelper.store(cartKey, cartStorage);
                }
            }

            const orderItemsCount = LocalStorageHelper.load(cartKey).saleDetails.reduce((prev, next) => { return prev + next.quantity }, 0)
            setCart(orderItemsCount);
        }
    }

    const decreaseQty = (event, itemId) => {
        if (cartStorage) {
            const saleDetailItem = cartStorage.saleDetails.find(p => p.itemid == itemId);
            if (saleDetailItem) {
                if (saleDetailItem.variations.length > 0 || saleDetailItem.modifiers.length > 0) {
                    router.push(`/restaurant/${id}/item-detail/${itemId}`);
                } else {
                    if (saleDetailItem.quantity == 1) {
                        cartStorage.saleDetails = cartStorage.saleDetails.filter(p => p.itemid != itemId);
                    } else {
                        saleDetailItem.quantity--;
                    }

                }

                LocalStorageHelper.store(cartKey, cartStorage);
            }

            const orderItemsCount = LocalStorageHelper.load(cartKey).saleDetails.reduce((prev, next) => { return prev + next.quantity }, 0)
            setCart(orderItemsCount);
        }
    }

    const getQuantity = (itemId) => {
        if (cartStorage) {
            const saleDetailItems = cartStorage.saleDetails.filter(p => p.itemid == itemId);
            if (saleDetailItems.length > 0) {
                return saleDetailItems.reduce((prev, curr) => { return prev + curr.quantity }, 0);
            } else {
                return 0;
            }

        } else {
            return 0;
        }
    }

    if (!restaurantdata && !cartStorage) return <></>
    return <>
        <Header title="Menu"></Header>
        <ul className="categories ps-2 py-1 pe-4">
            {
                restaurantdata.quickKeyCategoryList.map((item, i) => {
                    return <li key={item.categoryID} ref={el => i == selectedTabIndex ? tabRef.current = el : null} onClick={(e) => categoryClick(e, item.categoryID, i)} className="category" data-target={item.name}>
                        <span>{item.name}</span>
                    </li>
                })
            }
        </ul>
        <div className="order-list-view-wrapper pt-1">
            {
                restaurantdata.quickKeyCategoryList.map((item, i) => {
                    return <div id={item.categoryID} key={item.categoryID} className="sell-single-list mt-1">
                        <div className="section-title ms-2">{item.name}</div>
                        <ul className="listview separate-list image-listview inset no-line">
                            {
                                restaurantdata.quickProducts.filter(p => p.categoryid == item.categoryID).map((product, index) => {
                                    return <li key={product.itemid} className="items-card card card-border">
                                        <div className="item">
                                            <Link href={`/restaurant/${id}/item-detail/${product.itemid}`}>
                                                <a>
                                                    <Image src={product.detailimageurl ? product.detailimageurl : '/images/food/wide1.jpg'} width={100} height={100} objectFit="cover" priority={true} className="image" alt="image" />
                                                </a>
                                            </Link>
                                            <div className="in">
                                                <div>
                                                    <h4>
                                                        <Link href={`/restaurant/${id}/item-detail/${product.itemid}`}>
                                                            <a>{product.name}</a>
                                                        </Link>
                                                    </h4>
                                                    <p>{product.description}</p>
                                                    <div className="item-price-qnt">
                                                        <h5>{product.salesprice.toFixed(2)}</h5>
                                                        <div className="qnt-incre-decre">
                                                            {getQuantity(product.itemid) > 0 && <>
                                                                <div className="qnt-incre-decre-bg"></div>
                                                                <div></div>
                                                                <div className="hide-incre-decre" onClick={(event) => decreaseQty(event, product.itemid)}>
                                                                    <RemoveCircle cssClasses="ion-icon" />
                                                                </div>
                                                                <input type="text" value={getQuantity(product.itemid)} onChange={() => { }} />
                                                            </>
                                                            }
                                                            <div className="show-incre-decre" onClick={(event) => increaseQty(event, product.itemid)}>
                                                                <AddCircle cssClasses="ion-icon" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                })
                            }

                        </ul>
                    </div>
                })

                // (menu && menu.map(item => {
                //     return <div key={item.itemid} className="col-6 menu-card item-card section mt-2 filter-active" data-item={item.categoryname}>
                //         <Link href={`/restaurant/${id}/item-detail/${item.itemid}`}>
                //             <a>
                //                 <div className="card card-border">
                //                     <Image src={item.detailimageurl ? item.detailimageurl : '/images/food/wide1.jpg'} width={250} height={120} objectFit="cover" priority={true} className="card-img-top" alt="image" />
                //                     <div className="card-body p-1">
                //                         <div className="left">
                //                             <h5 className="card-title">{item.name}</h5>
                //                             <h6 className="card-text">{item.description}</h6>
                //                         </div>
                //                         <div className="right">
                //                             <h3>{item.salesprice.toFixed(2)}</h3>
                //                         </div>
                //                     </div>
                //                 </div>
                //             </a>
                //         </Link>
                //     </div>
                // }))
            }
        </div>
    </>
}

Menu.defaultProps = {
    name: 'Menu',
    title: 'Menu',
    showBack: true,
    showCart: true
}

export default Menu