import { useEffect, useState, useRef } from 'react'
import Image from 'next/image';
import { useRouter } from 'next/router';
import Header from '../../../../components/head';
import { AddCircle, CloseCircleOutline, RemoveCircle } from "react-ionicons";
import { useRecoilState } from 'recoil';
import { cartState } from '../../../../states/atoms';
import { toast } from 'react-toastify';
import { LocalStorageHelper } from '../../../../helpers/local-storage-helper';
import { KEY_CART, KEY_LAST_VISITED_ITEM } from '../../../../constants';
import useLocalStorage from '../../../../hooks/useLocalStorage';
import { getItemForCart } from '../../../../helpers/cart-helper';

const ItemDetail = ({ restaurantdata }) => {
    const [itemState, setItemState] = useState(null); // state to set detail of order item
    const [orderItemsState, setOrderItemsState] = useState([]); // state to handle multiple items
    const [cart, setCart] = useRecoilState(cartState);
    const varificationEl = useRef();
    const router = useRouter();
    const { id, itemid } = router.query;
    const cartKey = `${KEY_CART}-${id}`;
    const itemKey = `${KEY_LAST_VISITED_ITEM}-${id}`;
    const cartStorage = useLocalStorage(cartKey);

    useEffect(() => {
        if (restaurantdata) {
            const item = restaurantdata.quickProducts.find(p => p.itemid == itemid);
            setItemState(item);
            if (cartStorage) {
                setOrderItemsState([]);
                if (cartStorage.saleDetails.findIndex(p => p.itemid == itemid) < 0) {
                    setOrderItemsState(orderItems => [...orderItems, getItemForCart(item)]);
                } else {
                    const items = cartStorage.saleDetails.filter(p => p.itemid == itemid);
                    setOrderItemsState(orderItems => [...orderItems, ...items]);
                }

            }

            // if (itemState) {
            // setOrderItemsState([]);
            // const itemDetail = JSON.parse(JSON.stringify(itemState));
            // itemDetail.selectedModifiers = [];
            // itemDetail.total = itemState.salesprice;
            // setOrderItemsState(orderItems => [...orderItems, itemDetail]);
            // }
            LocalStorageHelper.store(itemKey, itemid);
        }
    }, [cartStorage, itemKey, itemid, restaurantdata]);

    const addAnotherItem = () => {
        if (itemState.variations.length == 0 && itemState.modifiers.length == 0) {
            const items = JSON.parse(JSON.stringify(orderItemsState));
            items[0].quantity += 1;
            setOrderItemsState(items);
        } else {
            const itemDetail = getItemForCart(itemState);
            setOrderItemsState(orderItems => [...orderItems, itemDetail]);
        }

    }

    const removeAnotherItem = (index) => {
        if (itemState.variations.length == 0 && itemState.modifiers.length == 0 && orderItemsState[0].quantity > 1) {
            const items = JSON.parse(JSON.stringify(orderItemsState));
            items[0].quantity -= 1;
            setOrderItemsState(items);
        } else {
            if (index > 0) {
                const items = orderItemsState.filter((item, i) => i != index);
                setOrderItemsState(items);
            }
        }

    }

    const changeHandler = (e, itemIndex, id, parentId, type) => {
        if (id && type == 'variation') {
            const variation = itemState.variations.find(p => p.itemvariationid == id);
            if (variation) {
                if (e.target.checked) {
                    orderItemsState[itemIndex].variationName = variation.name;
                    orderItemsState[itemIndex].variationId = variation.itemvariationid;
                    orderItemsState[itemIndex].total = orderItemsState[itemIndex].sellingPrice + variation.salesprice;
                    orderItemsState[itemIndex].extras =variation.salesprice;

                    [...varificationEl.current.getElementsByTagName("input")].forEach(element => {
                        if (element.name != e.target.name) {
                            element.checked = false;
                        }
                    });

                } else {
                    orderItemsState[itemIndex].variationName = '';
                    orderItemsState[itemIndex].variationId = 0;
                    orderItemsState[itemIndex].total = orderItemsState[itemIndex].sellingPrice;
                    orderItemsState[itemIndex].extras = 0;
                }

                setOrderItemsState(prev => prev = [...orderItemsState]);
            }

        } else if (id && parentId >= 0 && type == 'modifier') {
            const quickModifier = restaurantdata.quickModifiers.find(p => p.modifierId == parentId);
            if (quickModifier) {
                const modifierOption = quickModifier.modifierOptions.find(p => p.modifierOptionId == id);
                if (quickModifier.selectionAllowed == 1 || !e.target.checked) {
                    const idx = orderItemsState[itemIndex].selectedModifiers && orderItemsState[itemIndex].selectedModifiers.findIndex(p => p.modifierId == parentId);
                    if (idx >= 0) {
                        orderItemsState[itemIndex].selectedModifiers = orderItemsState[itemIndex].selectedModifiers.filter((p, i) => i != idx);
                    }

                }

                if (e.target.checked) {
                    const modifier = {
                        modifierId: parentId,
                        modifierOptionId: id,
                        name: modifierOption.name,
                        price: modifierOption.price
                    }
                    orderItemsState[itemIndex].selectedModifiers.push(modifier);
                }

                const extras = orderItemsState[itemIndex].selectedModifiers.reduce((acc, obj) => { return acc + obj.price; }, 0);
                orderItemsState[itemIndex].total = orderItemsState[itemIndex].sellingPrice + extras;
                orderItemsState[itemIndex].extras = extras;

                setOrderItemsState(prev => prev = [...orderItemsState]);

                // now unlock next panel
                const nextSibling = e.target.closest('.accordion-item').nextSibling;
                if (nextSibling && nextSibling.classList.contains('accordion-item')) {
                    nextSibling.getElementsByTagName('button')[0].disabled = false;
                }
            }

        }

        if (!id) {
            orderItemsState[itemIndex].instructions = e.target.value;
        }

    }

    const addToOrder = () => {
        for (let i = 0; i < orderItemsState.length; i++) {
            const element = orderItemsState[i];
            if (element.modifiers.length > 0) {
                const requiredModifiers = restaurantdata.quickModifiers.filter(p => p.isOptional == 0 && element.modifiers.some(m => m.modifierId == p.modifierId));
                if (element.selectedModifiers && element.selectedModifiers.length > 0) {
                    const selectedRequiredModifiers = requiredModifiers.filter(p => element.selectedModifiers.some(m => m.modifierId == p.modifierId));
                    if (selectedRequiredModifiers.length < requiredModifiers.length) {
                        toast.error('Some of the required modifiers are not selected');
                        return;
                    }

                } else {
                    toast.error('Some of the required modifiers are not selected');
                    return;
                }

            }
        }

        if (cartStorage) {
            cartStorage.saleDetails = cartStorage.saleDetails.filter(p => p.itemid != itemid);
            const saleDetails = [...cartStorage.saleDetails, ...orderItemsState];
            cartStorage = { ...cartStorage, ...{ saleDetails } };
            LocalStorageHelper.store(cartKey, cartStorage);
        }

        const orderItemsCount = LocalStorageHelper.load(cartKey).saleDetails.reduce((prev, next) => { return prev + next.quantity }, 0)
        setCart(orderItemsCount);
        router.push(`/restaurant/${id}/menu`);
    }

    if (!restaurantdata || !itemState || orderItemsState.length == 0 || !cartStorage) return <></>
    let inputStyle = 
    {
        width: '1ch'
    }
    let qty = orderItemsState.reduce((prev, curr) => { return prev + curr.quantity }, 0);
    if(qty > 9)
        inputStyle.width = '2ch';
    return <>
        <Header title={itemState.name}></Header>
        <div className="order-item-img">
            <Image src={itemState.detailimageurl ? itemState.detailimageurl : '/images/food/wide1.jpg'} width={600} height={400} layout="responsive" objectFit="fill" priority className="card-img-top" alt="image" />
        </div>
        <div className="card-text px-3 mt-2">
            <h3 className="section-title">{itemState.name}</h3>
            <p>
                <small>{itemState.description}</small>
            </p>
            <div className="item-price-qnt">
                <h5>{orderItemsState.reduce((prev, curr) => { return prev + (curr.quantity * curr.total) }, 0).toFixed(2)}</h5>
                <div className="qnt-incre-decre qnt-mt-3">
                    <div className="qnt-incre-decre-bg"></div>
                    <div></div>
                    <div onClick={() => removeAnotherItem(orderItemsState.length - 1)} className="hide-incre-decre ccc">
                        <RemoveCircle cssClasses="ion-icon" />
                    </div>
                    <input type="text" value={orderItemsState.reduce((prev, curr) => { return prev + curr.quantity }, 0)} onChange={() => { }} style={inputStyle} />
                    <div onClick={() => addAnotherItem()} className="show-incre-decre">
                        <AddCircle cssClasses="ion-icon" />
                    </div>
                </div>
            </div>
        </div>
        {/* <div className="row item-hero">
                <div className="col-6 item-card-lg">
                    <div className="card card-border">
                        <Image src={itemState.detailimageurl ? itemState.detailimageurl : '/images/food/wide1.jpg'} width={250} height={250} objectFit="cover" priority className="card-img" alt="image" />
                    </div>
                </div>
                <div className="col-6">
                    <div className="item-title">
                        <div className="left">
                            <h4>{itemState.name}</h4>
                        </div>
                        <div className="right">
                            <h3>{itemState.salesprice.toFixed(2)}</h3>
                        </div>
                    </div>
                    <div>
                        <h5 className="card-text">{itemState.description}</h5>
                    </div>
                </div>
            </div> */}
        <div className="section mt-2">
            <div id="addItemContainer">
                {orderItemsState.map((item, itemIndex) => {
                    return <div key={itemIndex.toString()} className="card card-border mt-2">
                        <div className="card-body">
                            {
                                (itemIndex != 0) && <div onClick={() => removeAnotherItem(itemIndex)} className="remove-item"><CloseCircleOutline className="switchSVGColor" /></div>
                            }
                            {/* {
                                (item.modifiers.length > 0 || item.variations.length > 0) &&
                                <div className="modification-item-name">
                                    <h4>{item.itemName}</h4>
                                    <h3>{item.sellingPrice.toFixed(2)}</h3>
                                </div>
                            } */}
                            <div ref={el => varificationEl.current = el} className="modification input-list w-100">
                                {
                                    item.variations.map(variation => {
                                        return <div key={variation.itemvariationid} className="single-modification">
                                            <div className="card-title mb-0">+{variation.salesprice.toFixed(2)}</div>
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" checked={item.variationId == variation.itemvariationid} name={`${variation.itemvariationid}-${itemIndex}`} onChange={(e) => changeHandler(e, itemIndex, variation.itemvariationid, -1, 'variation')} id={`id${variation.itemvariationid}${itemIndex}`} />
                                                <label className="form-check-label" htmlFor={`id${variation.itemvariationid}${itemIndex}`}>{item.name} {variation.name}</label>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                            {item.modifiers.length > 0 && <div className="accordion" id={`modifiers${itemIndex}`}>
                                {
                                    item.modifiers.map((modifier, index) => {
                                        const quickModifier = restaurantdata.quickModifiers.find(p => p.modifierId == modifier.modifierId);
                                        if (quickModifier) {
                                            return <div key={index} data-optional={quickModifier.isOptional} className="accordion-item">
                                                <h2 className="accordion-header" id={`modifier${modifier.itemModifierId}-${itemIndex}`}>
                                                    <button id={`headerBtn${index}`} className={"accordion-button" + (index != 0 ? ' collapsed' : '')} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${modifier.itemModifierId}-${itemIndex}`} aria-expanded={index == 0 ? 'true' : 'false'} aria-controls={`modifier${modifier.itemModifierId}-${itemIndex}`}>
                                                        {quickModifier.displayName}
                                                    </button>
                                                </h2>
                                                <div id={`collapse${modifier.itemModifierId}-${itemIndex}`} className={"accordion-collapse collapse" + (index == 0 ? ' show' : '')} aria-labelledby={`modifier${modifier.itemModifierId}-${itemIndex}`} data-bs-parent={`#modifiers${itemIndex}`}>
                                                    <div className="accordion-body modification optional input-list w-100">
                                                        {
                                                            (quickModifier.selectionAllowed === 1 ?
                                                                quickModifier.modifierOptions.map(modifierOption => {
                                                                    return <div key={modifierOption.modifierOptionId} className="single-modification">
                                                                        <div className="card-title mb-0">{modifierOption.price != 0 && `+${modifierOption.price.toFixed(2)}`}</div>
                                                                        <div className="form-check">
                                                                            <input type="radio" className="form-check-input" checked={item.selectedModifiers.findIndex(p => p.modifierOptionId == modifierOption.modifierOptionId) >= 0} onChange={(e) => changeHandler(e, itemIndex, modifierOption.modifierOptionId, quickModifier.modifierId, 'modifier')} name={`${itemIndex}modifier-${quickModifier.modifierId}`} id={`${itemIndex}modifierid-${modifierOption.modifierOptionId}`} />
                                                                            <label className="radio form-check-label" htmlFor={`${itemIndex}modifierid-${modifierOption.modifierOptionId}`}>{modifierOption.name}</label>
                                                                        </div>
                                                                    </div>
                                                                }) :
                                                                quickModifier.modifierOptions.map(modifierOption => {
                                                                    return <div key={modifierOption.modifierOptionId} className="single-modification">
                                                                        <div className="card-title mb-0">{modifierOption.price != 0 && `+${modifierOption.price.toFixed(2)}`}</div>
                                                                        <div className="form-check">
                                                                            <input type="checkbox" className="form-check-input" checked={item.selectedModifiers.findIndex(p => p.modifierOptionId == modifierOption.modifierOptionId) >= 0} onChange={(e) => changeHandler(e, itemIndex, modifierOption.modifierOptionId, quickModifier.modifierId, 'modifier')} name={`${itemIndex}modifier-${quickModifier.modifierId}`} id={`${itemIndex}modifierid-${modifierOption.modifierOptionId}`} />
                                                                            <label className="form-check-label" htmlFor={`${itemIndex}modifierid-${modifierOption.modifierOptionId}`}>{modifierOption.name}</label>
                                                                        </div>
                                                                    </div>
                                                                })
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    })
                                }
                            </div>
                            }
                            {
                                (item.modifiers.length > 0 || item.variations.length > 0) &&
                                <>
                                    <div className="qnt-total input-list w-100">
                                        <h3 className="m-0">Item Price</h3>
                                        <h3 className="m-0">{item.sellingPrice.toFixed(2)}</h3>
                                    </div>
                                    <div className="qnt-total input-list w-100">
                                        <h3 className="m-0">Extras</h3>
                                        <h3 className="m-0">{item.extras.toFixed(2)}</h3>
                                    </div>
                                    <div className="qnt-total input-list w-100">
                                        <h2 className="m-0">Total</h2>
                                        <div className="total-amount">
                                            <h2 className="m-0">{item.total.toFixed(2)}</h2>
                                        </div>
                                    </div>
                                </>
                            }

                            <div className={(item.modifiers.length > 0 || item.variations.length > 0) ? 'instruction mt-3' : 'instruction'}>
                                <textarea name={`instructions-${itemIndex}`} id={`instructions${itemIndex}`} rows="2"
                                    placeholder="Add an instruction to this item" onChange={(e) => changeHandler(e, itemIndex)} className="w-100 p-1" value={item.instructions}></textarea>
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>

        {/* <div className="section mt-2">
            <div id="addOrderItem">
                <button onClick={() => addAnotherItem()} className="btn add-tag-anchor btn-primary mt-2">
                    <span>
                        <AddCircle />
                    </span>
                    Add Another
                </button>
            </div>
        </div> */}

        <div className="section mt-4">
            <button className="btn btn-primary btn-shadow btn-lg btn-block" onClick={() => addToOrder()}>Add to Order</button>
        </div>
    </>
}

ItemDetail.defaultProps = {
    name: 'ItemDetail',
    title: 'Item',
    showBack: true,
    showCart: true
}

export default ItemDetail;