import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { KEY_CART } from "../../../constants";
import { LocalStorageHelper } from "../../../helpers/local-storage-helper";
import useLocalStorage from "../../../hooks/useLocalStorage";
import Link from "next/link";
import Header from "../../../components/head";


const Tip = () => {
    const router = useRouter();
    const { id } = router.query;
    const cartKey = `${KEY_CART}-${id}`;
    const cartStorage = useLocalStorage(cartKey);
    const [tip, setTip] = useState(0);
    const [tipType, setTipType] = useState(null);
    const btnVal = useRef(0);
    const tipRef = useRef(0);

    useEffect(() => {
        if (cartStorage) {
            setTip(cartStorage.tipAmount);
            setTipType(cartStorage.tipType);

            if (tipRef && tipRef.current) {
                tipRef.current.addEventListener('click', (e) => {
                    const input = document.getElementsByClassName('tip-textbox');
                    const tipLabel = document.getElementById('tipLabel');
                    if (input.length > 0) {
                        input[0].style.display = 'block';
                        input[0].value = tip;
                        tipLabel.style.display = 'none';
                    }
                })

                tipRef.current.removeEventListener('click', () => { });
            }

        }

    }, [cartStorage, tip]);

    const setTipValue = (val) => {

        const input = document.getElementsByClassName('tip-textbox');
        const tipLabel = document.getElementById('tipLabel');
        if (input.length > 0) {
            input[0].style.display = 'none';
            tipLabel.style.display = 'block';
        }

        setTip(val);
        btnVal.current = val;
        cartStorage.tipAmount = val;
        setTipAmount();

    }

    const orderTipTypeChange = (event) => {
        const val = event.target.value.toLowerCase();
        cartStorage.tipType = val;
        setTipType(val);
        setTipAmount(true);

    }

    const setTipAmount = (isEditTip = false) => {
        if (cartStorage.tipType == 'percentage' && !isEditTip) {
            const total = cartStorage.saleDetails.reduce((a, b) => { return a + b.total }, 0);
            const tipAmount = total / 100 * btnVal.current;
            setTip(tipAmount);
            cartStorage.tipAmount = tipAmount;
        } else {
            setTip(btnVal.current);
            cartStorage.tipAmount = btnVal.current;
        }

        LocalStorageHelper.store(cartKey, cartStorage);
    }

    const preventAlphas = (event) => {
        let x = event.charCode || event.keyCode;
        if (isNaN(String.fromCharCode(event.which)) && x != 46 || x === 32 || x === 13 || (x === 46 && event.currentTarget.innerText.includes('.'))) event.preventDefault();
    }

    const editTip = (event) => {
        let val = parseFloat(event.target.value || 0);
        setTip(val);
        btnVal.current = val;
        setTipAmount(true);

    }

    if (!cartStorage) return <></>
    return <>
        <Header title="Tip"></Header>
        <div className="row section cash-payment-amount mt-2">
            <div className="col-4">
                <div className="single-cash-payment">
                    <p>Amount</p>
                    <h2>{cartStorage.saleDetails.reduce((a, b) => { return a + (b.total * b.quantity) }, 0).toFixed(2)}</h2>
                </div>
            </div>
            <div className="col-4">
                <div className="single-cash-payment">
                    <p>Tip</p>
                    <h2 ref={tipRef}>
                        <input style={{ display: 'none' }} className="tip-textbox" type="text" onKeyPress={(e) => preventAlphas(e)} onChange={(e) => editTip(e)} />
                        <span id="tipLabel">{tip.toFixed(2)}</span>
                    </h2>
                </div>
            </div>
            <div className="col-4">
                <div className="single-cash-payment">
                    <p>Total</p>
                    <h2>{(cartStorage.saleDetails.reduce((a, b) => { return a + (b.total * b.quantity) }, 0) + (cartStorage.tipAmount || 0)).toFixed(2)}</h2>
                </div>
            </div>
        </div>

        <div className="row section amount-btn mt-3">
            <div className="col">
                <button className={"btn btn-light btn-shadow btn-block" + (btnVal.current == 10 ? ' active' : '')} onClick={() => setTipValue(10)}>10</button>
            </div>
            <div className="col">
                <button className={"btn btn-light btn-shadow btn-block" + (btnVal.current == 20 ? ' active' : '')} onClick={() => setTipValue(20)}>20</button>
            </div>
            <div className="col">
                <button className={"btn btn-light btn-shadow btn-block" + (btnVal.current == 50 ? ' active' : '')} onClick={() => setTipValue(50)}>50</button>
            </div>
            <div className="col">
                <button className={"btn btn-light btn-shadow btn-block" + (btnVal.current == 100 ? ' active' : '')} onClick={() => setTipValue(100)}>100</button>
            </div>
            <div className="col">
                <button className={"btn btn-light btn-shadow btn-block" + (btnVal.current == 500 ? ' active' : '')} onClick={() => setTipValue(500)}>500</button>
            </div>
        </div>
        <div className="section tip-option mt-3">
            <div className="btn-group" role="group">
                <input type="radio" className="btn-check" value={'amount'} onChange={(e) => orderTipTypeChange(e)} name="btnradioGroup1" id="btnradio1" checked={tipType == 'amount'} />
                <label className="btn btn-outline-primary" htmlFor="btnradio1">Amount</label>

                <input type="radio" className="btn-check" value={'percentage'} onChange={(e) => orderTipTypeChange(e)} name="btnradioGroup1" id="btnradio2" checked={tipType == 'percentage'} />
                <label className="btn btn-outline-primary" htmlFor="btnradio2">Percentage</label>
            </div>
        </div>

        <div className="section mt-3">
            <Link href={`/restaurant/${id}/checkout`}>
                <a className="btn btn-primary btn-shadow btn-lg btn-block">Done</a>
            </Link>
        </div>

    </>
}

Tip.defaultProps = {
    name: 'Tip',
    title: 'Add Tip',
    showBack: true,
    showCart: false
}

export default Tip;