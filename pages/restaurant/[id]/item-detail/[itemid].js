import { useEffect, useState, useRef } from 'react'
import useSessionStorage from '../../../../hooks/useSessionStorage';
import Image from 'next/image';
import { useRouter } from 'next/router';

const ItemDetail = ({ props }) => {
    let state = useSessionStorage('init_data');
    const [detail, setDetail] = useState(null);
    const router = useRouter();
    const { id, itemid } = router.query;

    useEffect(() => {
        if (state) {
            setDetail(state.payload.data.quickProducts.find(p => p.itemid == itemid));
        }
    }, [itemid, state]);

    if (!state || !detail) return <div id="loader">
        <Image src="/images/favicon.png" width={32} height={32} layout="fixed" alt="icon" className="loading-icon" />
    </div>
    return <>
        <div className="section mt-2 order-item">
            <div className="row item-hero">
                <div className="col-6 item-card-lg">
                    <a href="order-item.html">
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
                    </a>
                </div>
                <div className="col-6">
                    <p>{detail.description}</p>
                </div>
            </div>
            <div id="addItemContainer">
                <div className="card card-border mt-2">
                    <div className="card-body">
                        <div className="options">
                            <div className="btn-group" role="group">
                                <input type="radio" className="btn-check " name="btnradioGroup1" id="wellDone" checked />
                                <label className="btn btn-outline-primary" htmlFor="wellDone">Well Done</label>

                                <input type="radio" className="btn-check " name="btnradioGroup1" id="Medium" />
                                <label className="btn btn-outline-primary" htmlFor="Medium">Medium</label>

                                <input type="radio" className="btn-check " name="btnradioGroup1" id="rare" />
                                <label className="btn btn-outline-primary" htmlFor="rare">Rare</label>
                            </div>
                        </div>
                        <div className="modification-item-name">
                            <h4>{detail.name}</h4>
                            <h3>{detail.salesprice}</h3>
                        </div>
                        <div className="modification input-list w-100">
                            <div className="single-modification">
                                <div className="card-title mb-0">25.24</div>
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input" id="variation1" />
                                    <label className="form-check-label" htmlFor="variation1">Variation #1</label>
                                </div>
                            </div>
                            <div className="single-modification">
                                <div className="card-title mb-0">5.24</div>
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input" id="customCheckd2" />
                                    <label className="form-check-label" htmlFor="customCheckd2">Variation #2</label>
                                </div>
                            </div>
                        </div>
                        <div className="qnt-total input-list w-100">
                            <h2 className="m-0">Total</h2>
                            <div className="total-amount">
                                <h2 className="m-0">11.50</h2>
                            </div>
                        </div>
                        <div className="instruction mt-3">
                            <textarea name="instruction" id="instruction" rows="2"
                                placeholder="Add an instruction to this item" className="w-100 p-1"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}
export default ItemDetail;