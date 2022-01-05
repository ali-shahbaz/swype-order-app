import Header from "../../../../components/head";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from "react";
import { GetOrderDetail } from "../../../../services/restaurant-service";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import { KEY_LOGGED_IN_USER } from "../../../../constants";

const OrderDetail = () => {
    const loggedInUser = useLocalStorage(KEY_LOGGED_IN_USER);
    const router = useRouter();
    const { orderid } = router.query;
    const [orderDetail, setOrderDetail] = useState(null);

    useEffect(() => {
        if (loggedInUser) {
            // setUserDetail(loggedInUser);
            GetOrderDetail(loggedInUser.token, orderid).then(data => {
                if (data.status == 1) {
                    setOrderDetail(data.payload);
                } else {
                    toast.error(data.error);
                }

            });
        }

    }, [loggedInUser, orderid]);

    return <div className="order-checkout">
        <Header title="Order Detail"></Header>
        <div className="section">
            <div className="row checkout-item">
                {orderDetail && orderDetail.order.details.map((item, i) => {
                    return <div key={i} className="col-4 mt-2">
                        {/* <Link href={`/restaurant/${orderDetail.companyId}/item-detail/${item.itemId}`}>
                            <a> */}
                        <div className="card item-card card-border p-0">
                            <Image src={item.imageUrl ? item.imageUrl : '/images/food/wide1.jpg'} width={250} height={250} objectFit="cover" priority={true} className="card-img-top" alt="image" />
                            <h4>{item.itemName}</h4>
                        </div>
                        {/* </a>
                        </Link> */}
                    </div>
                })}
            </div>
        </div>

        <div className="section mt-3">
            <div className="border-bottom">
                <div className="total-item">
                    <h4>Total Items</h4>
                    <h4>{orderDetail && orderDetail.order.details.length}</h4>
                </div>
                <div className="total-amount">
                    <h4>Total Amount</h4>
                    <h4>{orderDetail && orderDetail.order.amount.toFixed(2)}</h4>
                </div>
            </div>
        </div>

        <div className="section full mt-2 px-3">
            <form action="#">
                <div className="form-check mt-1">
                    <input type="checkbox" onClick={(e) => { e.preventDefault() }} className="form-check-input" id="orderConfirmed" defaultChecked={orderDetail && orderDetail.order.orderStatusDone.indexOf('OrderConfirmed') >= 0} />
                    <label className="form-check-label" htmlFor="orderConfirmed">Order Confirmed</label>
                </div>
                <div className="form-check mt-1">
                    <input type="checkbox" onClick={(e) => { e.preventDefault() }} className="form-check-input" id="preparingOrder" defaultChecked={orderDetail && orderDetail.order.orderStatusDone.indexOf('InProgress') >= 0} />
                    <label className="form-check-label" htmlFor="preparingOrder">We are preparing your
                        order</label>
                </div>
                <div className="form-check mt-1">
                    <input type="checkbox" onClick={(e) => { e.preventDefault() }} className="form-check-input" id="EnjoyOrder" defaultChecked={orderDetail && orderDetail.order.orderStatusDone.indexOf('Completed') >= 0} />
                    <label className="form-check-label" htmlFor="EnjoyOrder">Enjoy</label>
                </div>
            </form>
        </div>
    </div>
}

OrderDetail.defaultProps = {
    name: 'OrderDetail',
    title: 'Your Order',
    showBack: false,
    showCart: false
}

export default OrderDetail;