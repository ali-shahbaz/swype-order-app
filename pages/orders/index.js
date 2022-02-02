import Header from '../../components/head';
import Image from 'next/image';
import { GetUserReceipts } from '../../services/user-service';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import useLocalStorage from '../../hooks/useLocalStorage';
import { KEY_LOGGED_IN_USER, KEY_RESTAURANT_DATA } from '../../constants';
import { LocalStorageHelper } from '../../helpers/local-storage-helper';
const Orders = () => {
    const loggedInUser = useLocalStorage(KEY_LOGGED_IN_USER);
    const [receipts, setReceipts] = useState([]);
    const [restaurantId, setRestaurantId] = useState(null);

    useEffect(() => {
        if (loggedInUser) {
            GetUserReceipts(loggedInUser.token).then(data => {
                if (data.status == 1) {
                    setReceipts(data.payload.receipts);
                } else {

                }
            });
        }

        const storageData = LocalStorageHelper.load(KEY_RESTAURANT_DATA);
        setRestaurantId(storageData.id);
    }, [loggedInUser]);

    return <>
        <Header title="My Orders"></Header>
        <div className="order-receipts">
            <ul className="listview separate-list image-listview no-line no-arrow inset">
                {
                    receipts.length == 0 ? <>
                        <h2>No receipts available</h2>
                        <Link href={`/restaurant/${restaurantId}/menu`}>
                            <a>Click here to start you order</a>
                        </Link>
                    </>
                        :
                        receipts.map(item => {
                            return <li key={item.orderId} className="items-card card card-border">
                                {/* <Link href={`/restaurant/${item.companyId}/order-detail/${item.orderId}`}>
                                <a className="item"> */}
                                <div className='item'>
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
                                </div>
                                {/* </a>
                            </Link> */}
                            </li>
                        })
                }
            </ul>
        </div>
    </>
}

Orders.defaultProps = {
    name: 'Orders',
    title: 'Reciepts',
    showBack: false,
    showCart: false
}

export default Orders;