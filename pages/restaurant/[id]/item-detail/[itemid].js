import { useEffect, useState, useRef } from 'react'
import useSessionStorage from '../../../../hooks/useSessionStorage';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Header from '../../../../components/head';
import AddToOrder from '../../../../helpers/cart-helper';
import { AddCircle, CloseCircle, Restaurant } from "react-ionicons";

const ItemDetail = ({ props }) => {
    let dataState = useSessionStorage('init_data');
    const [state, setState] = useState({});
    const [detail, setDetail] = useState(null); // state to set detail of order item
    const [orderItems, setOrderItems] = useState([]); // state to handle multiple items
    const [total, setTotal] = useState(0);
    const router = useRouter();
    const { id, itemid } = router.query;

    useEffect(() => {
        if (dataState) {
            setDetail(dataState.payload.data.quickProducts.find(p => p.itemid == itemid));
            if (detail) {
                setOrderItems([]);
                setOrderItems(orderItems => [...orderItems, detail]);
                setTotal(detail.salesprice);
            }
        }
    }, [dataState, detail, itemid]);

    const addAnotherItem = () => {
        setOrderItems(orderItems => [...orderItems, detail]);
    }

    const removeAnotherItem = (index) => {
        const items = orderItems.filter((item, i) => i != index);
        setOrderItems(items);
    }

    const changeHandler = (e, id, type) => {
        if (id && type == 'variation') {
            const variation = detail.variations.find(p => p.itemvariationid == id);
            if (variation && e.target.checked) {
                setTotal(total => total + variation.salesprice);
            } else {
                setTotal(total => total - variation.salesprice);
            }

        }
        setState((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    const addToOrder = () => {
        console.log(state);
    }

    if (!dataState || !detail || !orderItems) return <div id="loader">
        <Image src="/images/favicon.png" width={32} height={32} layout="fixed" alt="icon" className="loading-icon" />
    </div>
    return <>
        <Header title={detail.name}></Header>
        <div className="section mt-2 order-item">
            <div className="row item-hero">
                <div className="col-6 item-card-lg">
                    <div className="card card-border">
                        <Image src={detail.detailimageurl ? detail.detailimageurl : '/images/food/wide1.jpg'} width={250} height={120} objectFit="cover" priority className="card-img-top" alt="image" />
                        <div className="card-body p-1">
                            <div className="left">
                                <h5 className="card-title">{detail.name}</h5>
                                <h6 className="card-text">{detail.description}</h6>
                            </div>
                            <div className="right">
                                <h3>{detail.salesprice}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <p>{detail.description}</p>
                </div>
            </div>
            <div id="addItemContainer">
                {orderItems.map((item, i) => {
                    return <div key={i.toString()} className="card card-border mt-2">
                        <div className="card-body">
                            <div className="options">
                                <div className="btn-group" role="group" onChange={(e) => changeHandler(e)}>
                                    <input type="radio" className="btn-check" value="1" name={`cooking-${i}`} id={`wellDone${i}`} />
                                    <label className="btn btn-outline-primary" htmlFor={`wellDone${i}`}>Well Done</label>

                                    <input type="radio" className="btn-check" value="2" name={`cooking-${i}`} id={`Medium${i}`} />
                                    <label className="btn btn-outline-primary" htmlFor={`Medium${i}`}>Medium</label>

                                    <input type="radio" className="btn-check" value="3" name={`cooking-${i}`} id={`Rare${i}`} />
                                    <label className="btn btn-outline-primary" htmlFor={`Rare${i}`}>Rare</label>
                                </div>
                                {
                                    (i != 0) && <div onClick={() => removeAnotherItem(i)} className="cursor-pointer"><CloseCircle /></div>
                                }
                            </div>
                            <div className="modification-item-name">
                                <h4>{item.name}</h4>
                                <h3>{item.salesprice}</h3>
                            </div>
                            <div className="modification input-list w-100">
                                {
                                    item.variations.map(variation => {
                                        return <div key={variation.itemvariationid} className="single-modification">
                                            <div className="card-title mb-0">{variation.salesprice}</div>
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" name={`v1-${i}`} onChange={(e) => changeHandler(e, variation.itemvariationid, 'variation')} id={`v1${i}`} />
                                                <label className="form-check-label" htmlFor={`v1${i}`}>{item.name} {variation.name}</label>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                            {item.modifiers.length > 0 && <div className="accordion" id="modifiers">
                                {
                                    item.modifiers.map((modifier, index) => {
                                        const quickModifier = dataState.payload.data.quickModifiers.find(p => p.modifierId == modifier.modifierId);
                                        if (quickModifier) {
                                            return <div key={index} className="accordion-item">
                                                <h2 className="accordion-header" id={`modifier${modifier.itemModifierId}`}>
                                                    <button className={"accordion-button" + (index != 0 ? ' collapsed' : '')} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${modifier.itemModifierId}`} aria-expanded={index == 0 ? 'true' : 'false'} aria-controls={`modifier${modifier.itemModifierId}`}>
                                                        {quickModifier.displayName}
                                                    </button>
                                                </h2>
                                                <div id={`collapse${modifier.itemModifierId}`} className={"accordion-collapse collapse" + (index == 0 ? ' show' : '')} aria-labelledby={`modifier${modifier.itemModifierId}`} data-bs-parent="#modifiers">
                                                    <div className="accordion-body modification optional input-list w-100">
                                                        {
                                                            quickModifier.modifierOptions.map(modifierOption => {
                                                                return <div key={modifierOption.modifierOptionId} className="single-modification">
                                                                    <div className="card-title mb-0">10</div>
                                                                    <div className="form-check">
                                                                        <input type="radio" className="form-check-input" name={`v1${quickModifier.modifierId}`} id={`v11${modifierOption.modifierOptionId}`} />
                                                                        <label className="form-check-label" htmlFor={`v11${modifierOption.modifierOptionId}`}>{modifierOption.name}</label>
                                                                    </div>
                                                                </div>
                                                            })
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
                                    <h2 className="m-0">{total}</h2>
                                </div>
                            </div>
                            <div className="instruction mt-3">
                                <textarea name={`instructions-${i}`} id={`instructions${i}`} rows="2"
                                    placeholder="Add an instruction to this item" onChange={(e) => changeHandler(e)} className="w-100 p-1"></textarea>
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