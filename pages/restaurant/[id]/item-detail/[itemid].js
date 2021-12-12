import { useEffect, useState, useRef, Dispatcher } from 'react'
import useSessionStorage from '../../../../hooks/useSessionStorage';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Header from '../../../../components/head';
import { AddCircle, CloseCircle, Restaurant } from "react-ionicons";
import { useRecoilState } from 'recoil';
import { cartState } from '../../../../states/atoms';
import { toast } from 'react-toastify';

const ItemDetail = ({ props }) => {
    let data = useSessionStorage('init_data');
    const [itemState, setItemState] = useState(null); // state to set detail of order item
    const [orderItemsState, setOrderItemsState] = useState([]); // state to handle multiple items
    const [cart, setCart] = useRecoilState(cartState);
    const varificationEl = useRef();
    const router = useRouter();
    const { id, itemid } = router.query;
    const cartName = `cart${id}`;

    useEffect(() => {
        if (data) {
            setItemState(data.payload.data.quickProducts.find(p => p.itemid == itemid));
            if (itemState) {
                setOrderItemsState([]);
                const itemDetail = JSON.parse(JSON.stringify(itemState));
                itemDetail.selectedModifiers = [];
                itemDetail.total = itemState.salesprice;
                setOrderItemsState(orderItems => [...orderItems, itemDetail]);
            }
        }
    }, [data, itemState, itemid]);

    const addAnotherItem = () => {
        const itemDetail = JSON.parse(JSON.stringify(itemState));
        itemDetail.selectedModifiers = [];
        itemDetail.total = itemState.salesprice;
        setOrderItemsState(orderItems => [...orderItems, itemDetail]);
    }

    const removeAnotherItem = (index) => {
        const items = orderItemsState.filter((item, i) => i != index);
        setOrderItemsState(items);
    }

    const changeHandler = (e, itemIndex, id, parentId, type) => {
        if (id && type == 'variation') {
            const variation = itemState.variations.find(p => p.itemvariationid == id);
            if (variation) {
                if (e.target.checked) {
                    orderItemsState[itemIndex].variationName = variation.name;
                    orderItemsState[itemIndex].total = orderItemsState[itemIndex].salesprice + variation.salesprice;

                    [...varificationEl.current.getElementsByTagName("input")].forEach(element => {
                        if (element.name != e.target.name) {
                            element.checked = false;
                        }
                    });

                } else {
                    orderItemsState[itemIndex].variationName = '';
                    orderItemsState[itemIndex].total = orderItemsState[itemIndex].salesprice;
                }

                setOrderItemsState(prev => prev = [...orderItemsState]);
            }

        } else if (id && parentId >= 0 && type == 'modifier') {
            const quickModifier = data.payload.data.quickModifiers.find(p => p.modifierId == parentId);
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

                orderItemsState[itemIndex].total = orderItemsState[itemIndex].salesprice + orderItemsState[itemIndex].selectedModifiers.reduce((acc, obj) => { return acc + obj.price; }, 0);
                setOrderItemsState(prev => prev = [...orderItemsState]);

                // now unlock next panel
                const nextSibling = e.target.closest('.accordion-item').nextSibling;
                if (nextSibling.classList.contains('accordion-item')) {
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
                const requiredModifiers = data.payload.data.quickModifiers.filter(p => p.isOptional == 0 && element.modifiers.some(m => m.modifierId == p.modifierId));
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

        let cart = sessionStorage.getItem(cartName);
        if (cart) {
            const saleDetails = [...JSON.parse(cart).saleDetails, ...orderItemsState];
            cart = { ...JSON.parse(cart), ...{ saleDetails } };
            sessionStorage.setItem(cartName, JSON.stringify(cart));
        }

        const orderItemsCount = JSON.parse(sessionStorage.getItem(cartName)).saleDetails.length;
        setCart(orderItemsCount);
        router.back();
    }

    if (!data || !itemState || !orderItemsState) return <div id="loader">
        <Image src="/images/favicon.png" width={32} height={32} layout="fixed" alt="icon" className="loading-icon" />
    </div>
    return <>
        <Header title={itemState.name}></Header>
        <div className="section mt-2 order-item">
            <div className="row item-hero">
                <div className="col-6 item-card-lg">
                    <div className="card card-border">
                        <Image src={itemState.detailimageurl ? itemState.detailimageurl : '/images/food/wide1.jpg'} width={250} height={250} objectFit="cover" priority className="card-img-top" alt="image" />
                        <div className="card-body p-1">
                            <div className="left">
                                <h5 className="card-title">{itemState.name}</h5>
                                <h6 className="card-text">{itemState.description}</h6>
                            </div>
                            <div className="right">
                                <h3>{itemState.salesprice}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <p>{itemState.description}</p>
                </div>
            </div>
            <div id="addItemContainer">
                {orderItemsState.map((item, itemIndex) => {
                    return <div key={itemIndex.toString()} className="card card-border mt-2">
                        <div className="card-body">
                            <div className="options">
                                {
                                    (itemIndex != 0) && <div onClick={() => removeAnotherItem(itemIndex)} className="remove-item"><CloseCircle /></div>
                                }
                            </div>
                            <div className="modification-item-name">
                                <h4>{item.name}</h4>
                                <h3>{item.salesprice}</h3>
                            </div>
                            <div ref={varificationEl} className="modification input-list w-100">
                                {
                                    item.variations.map(variation => {
                                        return <div key={variation.itemvariationid} className="single-modification">
                                            <div className="card-title mb-0">{variation.salesprice}</div>
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" name={`${variation.itemvariationid}-${itemIndex}`} onChange={(e) => changeHandler(e, itemIndex, variation.itemvariationid, -1, 'variation')} id={`id${variation.itemvariationid}${itemIndex}`} />
                                                <label className="form-check-label" htmlFor={`id${variation.itemvariationid}${itemIndex}`}>{item.name} {variation.name}</label>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                            {item.modifiers.length > 0 && <div className="accordion" id="modifiers">
                                {
                                    item.modifiers.map((modifier, index) => {
                                        const quickModifier = data.payload.data.quickModifiers.find(p => p.modifierId == modifier.modifierId);
                                        if (quickModifier) {
                                            return <div key={index} data-optional={quickModifier.isOptional} className="accordion-item">
                                                <h2 className="accordion-header" id={`modifier${modifier.itemModifierId}`}>
                                                    <button id={`headerBtn${index}`} className={"accordion-button" + (index != 0 ? ' collapsed' : '')} disabled={index == 0 ? false : true} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${modifier.itemModifierId}`} aria-expanded={index == 0 ? 'true' : 'false'} aria-controls={`modifier${modifier.itemModifierId}`}>
                                                        {quickModifier.displayName}
                                                    </button>
                                                </h2>
                                                <div id={`collapse${modifier.itemModifierId}`} className={"accordion-collapse collapse" + (index == 0 ? ' show' : '')} aria-labelledby={`modifier${modifier.itemModifierId}`} data-bs-parent="#modifiers">
                                                    <div className="accordion-body modification optional input-list w-100">
                                                        {
                                                            (quickModifier.selectionAllowed === 1 ?
                                                                quickModifier.modifierOptions.map(modifierOption => {
                                                                    return <div key={modifierOption.modifierOptionId} className="single-modification">
                                                                        <div className="card-title mb-0">{modifierOption.price != 0 && modifierOption.price}</div>
                                                                        <div className="form-check">
                                                                            <input type="radio" className="form-check-input" onChange={(e) => changeHandler(e, itemIndex, modifierOption.modifierOptionId, quickModifier.modifierId, 'modifier')} name={`${itemIndex}modifier-${quickModifier.modifierId}`} id={`${itemIndex}modifierid-${modifierOption.modifierOptionId}`} />
                                                                            <label className="radio form-check-label" htmlFor={`${itemIndex}modifierid-${modifierOption.modifierOptionId}`}>{modifierOption.name}</label>
                                                                        </div>
                                                                    </div>
                                                                }) :
                                                                quickModifier.modifierOptions.map(modifierOption => {
                                                                    return <div key={modifierOption.modifierOptionId} className="single-modification">
                                                                        <div className="card-title mb-0">{modifierOption.price != 0 && modifierOption.price}</div>
                                                                        <div className="form-check">
                                                                            <input type="checkbox" className="form-check-input" onChange={(e) => changeHandler(e, itemIndex, modifierOption.modifierOptionId, quickModifier.modifierId, 'modifier')} name={`${itemIndex}modifier-${quickModifier.modifierId}`} id={`${itemIndex}modifierid-${modifierOption.modifierOptionId}`} />
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
                            <div className="qnt-total input-list w-100">
                                <h2 className="m-0">Total</h2>
                                <div className="total-amount">
                                    <h2 className="m-0">{item.total}</h2>
                                </div>
                            </div>
                            <div className="instruction mt-3">
                                <textarea name={`instructions-${itemIndex}`} id={`instructions${itemIndex}`} rows="2"
                                    placeholder="Add an instruction to this item" onChange={(e) => changeHandler(e, itemIndex)} className="w-100 p-1"></textarea>
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>

        <div className="section mt-2">
            <div id="addOrderItem">
                <button onClick={() => addAnotherItem()} className="btn add-tag-anchor btn-primary mt-2">
                    <span>
                        <AddCircle />
                    </span>
                    Add Another
                </button>
            </div>
        </div>

        <div className="section mt-4">
            <button className="btn btn-primary btn-shadow btn-lg btn-block" onClick={() => addToOrder()}>Add to Order</button>
        </div>
    </>
}
export default ItemDetail;