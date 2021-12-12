const SetCartWithOrderType = (companyId, orderType) => {
    debugger
    const cartName = `cart${companyId}`;
    orderType = parseInt(orderType);

    let cart = sessionStorage.getItem(cartName);
    if (cart) {
        cart = { ...JSON.parse(cart), ...{ onlineOrderType: orderType } };
        sessionStorage.setItem(cartName, JSON.stringify(cart));
    } else {
        const orderObj = {
            status: 1,
            saleDetails: [],
            label: 'Online Sales',
            isSplitCheck: false,
            equitySplitCount: 0,
            parkSplitSale: null,
            netTotal: 0,
            taxAmount: 0,
            tableId: 0,
            tableName: null,
            amount: 0,
            grandTotal: 0,
            discount: 0,
            discountAmount: 0,
            tipAmount: 0,
            salePayments: [{
                paymentMethodId: 0,
                paymentTypeId: 0,
                amount: 0
            }],
            onlineOrderType: orderType
        }
        sessionStorage.setItem(cartName, JSON.stringify(orderObj));
    }

}
export default SetCartWithOrderType;