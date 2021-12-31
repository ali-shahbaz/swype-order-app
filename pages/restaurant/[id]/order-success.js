import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import Header from "../../../components/head";
import { KEY_CART } from "../../../constants";
import { LocalStorageHelper } from "../../../helpers/local-storage-helper";
import { cartState } from "../../../states/atoms";

const OrderSuccess = () => {
    const router = useRouter();
    const { id, orderid , ordernumber} = router.query;
    const cartKey = `${KEY_CART}-${id}`;
    const [cart, setCart] = useRecoilState(cartState);

    useEffect(() => {
        if (orderid && window) {
            LocalStorageHelper.remove(cartKey);
            setCart(0);
        }
    })

    return <>
        <Header title="Order Confirmed"></Header>
        <div className="section confirmed-heading my-3">
            <div className="section-heading">
                <Image src="/images/paid.png" width={87} height={80} alt="" />
                <div>
                    <h2 className="title mb-1">Thanks for your order</h2>
                    <h4>Order id <span>#{ordernumber}</span></h4>
                </div>
            </div>
        </div>
        <div className="section">
            <h3>We are preparing your order and it should be ready soon. We will send you another text once its ready. </h3>
            <h3>You can follow it, by going to your profile page. </h3>
        </div>
        <div className="section next-button mt-4">
            <Link href={`/restaurant/${id}?sidebar=1`}>
                <a className="btn btn-primary btn-shadow btn-lg btn-block">Next</a>
            </Link>
        </div>
    </>
}

OrderSuccess.defaultProps = {
    name: 'OrderSuccess',
    title: '',
    showBack: false,
    showCart: false
}

export default OrderSuccess;