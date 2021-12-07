import Image from 'next/image';
import useSessionStorage from '../../../hooks/useSessionStorage';
import { useRouter } from 'next/router';

const Checkout = () => {
    const router = useRouter();
    const { id } = router.query;
    const cart = useSessionStorage(`cart${id}`);

    return <div className="order-checkout">
        <div className="section">
            <div className="row checkout-item">
                {cart && cart.map((item, i) => {
                    return <div key={i} className="col-4 mt-2">
                        <div className="card item-card card-border p-0">
                            <Image src={item.detailimageurl ? item.detailimageurl : '/images/food/wide1.jpg'} width={250} height={250} objectFit="cover" priority={true} className="card-img-top" alt="image" />
                            <h4>{item.name}</h4>
                        </div>
                    </div>
                })}
            </div>
        </div>
        <div className="section mt-3">
            <div className="border-bottom">
                <div className="total-item">
                    <h4>Total Items</h4>
                    <h4>{cart && cart.length}</h4>
                </div>
                <div className="total-amount">
                    <h4>Total Amount</h4>
                    <h4>{cart && cart.reduce((a, b) => { return a + b.total }, 0)}</h4>
                </div>
            </div>
        </div>

        <div className="section mt-4">
            <a href="order-my-profile-2.html" className="btn btn-primary btn-shadow btn-lg btn-block">Invite a Friend to Your Order</a>
            <a href="#" className="btn btn-primary btn-shadow btn-lg btn-block mt-2">Pay Now</a>
        </div>
    </div>
}

export default Checkout;