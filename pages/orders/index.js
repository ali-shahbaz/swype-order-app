import Header from '../../components/head';
import Image from 'next/image';
import useSessionStorage from '../../hooks/useSessionStorage';
import { getUserReceipts } from '../../services/user-service';
import { useEffect, useState } from 'react';
import Link from 'next/link';
const Orders = () => {
    const loggedInUser = useSessionStorage('logged_in_user');
    const [receipts, setReceipts] = useState([]);

    useEffect(() => {
        if (loggedInUser) {
            getUserReceipts(loggedInUser.token).then(data => {
                if (data.status == 1) {
                    setReceipts(data.payload.receipts);
                } else {

                }
            });
        }
    }, [loggedInUser]);

    return <>
        <Header title="My Orders"></Header>
        <div className="order-receipts">
            <ul className="listview separate-list image-listview no-line no-arrow inset">
                {
                    receipts.map(item => {
                        return <li key={item.orderId} className="items-card card card-border">
                            <Link href={`/orders/${item.orderId}`}>
                                <a className="item">
                                    <Image src={item.companyLogoUrl ? item.companyLogoUrl : "/images/under-logo.png"} width={36} height={36} alt="image" className="image" />
                                    <div className="in">
                                        <div>
                                            <h4>{item.companyName}</h4>
                                            <p>{item.itemsCount} items - {item.dateLabel}</p>
                                        </div>
                                        <div>
                                            <h4>{item.amount}</h4>
                                            <p>{item.paymentType}</p>
                                        </div>
                                    </div>
                                </a>
                            </Link>
                        </li>
                    })
                }
            </ul>
            <div className="section mt-4">
                <a href="#" className="btn btn-primary btn-shadow btn-lg btn-block">Export</a>
            </div>

        </div>
    </>
}

export default Orders;