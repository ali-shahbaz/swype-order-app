import Header from "../../components/head";

const OrderDetail = () => {
    return <>
        <Header title="Order Detail"></Header>
        <span>Ordre Detail</span>
    </>
}

OrderDetail.defaultProps = {
    name: 'OrderDetail',
    title: 'Your Order',
    showBack: false,
    showCart: false
}

export default OrderDetail;