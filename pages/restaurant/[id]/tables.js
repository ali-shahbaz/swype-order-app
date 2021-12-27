import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../../components/head';

const Tables = ({restaurantdata}) => {
    const router = useRouter();
    const { id } = router.query;
    const cartName = `cart${id}`;

    const setCartTable = (tableId, tableName) => {
        let cart = sessionStorage.getItem(cartName);
        if (cart) {
            cart = { ...JSON.parse(cart), ...{ tableId: tableId, tableName: tableName } };
            sessionStorage.setItem(cartName, JSON.stringify(cart));
        }
    }

    const removeTableFromCart = () => {
        let cart = sessionStorage.getItem(cartName);
        if (cart) {
            cart = { ...JSON.parse(cart), ...{ tableId: 0, tableName: null } };
            sessionStorage.setItem(cartName, JSON.stringify(cart));
        }
    }

    if (!restaurantdata) return <></>
    return <div className="order-receipts">
        <Header title="Select Your Section"></Header>
        <ul className="listview separate-list image-listview no-line no-arrow inset">
            {restaurantdata.quickTables.map((item, index) => {
                return <li key={item.tableId} onClick={() => setCartTable(item.tableId, item.name)} className="items-card card card-border">
                    <Link href={`/restaurant/${id}/menu`}>
                        <a className="item">
                            <div className="in">
                                <h4 className="m-0">{item.name}</h4>
                            </div>
                        </a>
                    </Link>
                </li>
            })}
        </ul>
        <div className="section">
            <div className="mt-4" onClick={() => removeTableFromCart()}>
                <Link href={`/restaurant/${id}/menu`}>
                    <a className="btn btn-primary btn-shadow btn-lg btn-block mt-2">{"I don't know my section"}</a>
                </Link>
            </div>
        </div>
    </div>
}

Tables.defaultProps = {
    name: 'Tables',
    title: 'Select Your Section',
    showBack: true,
    showCart: false
}

export default Tables;