import useLocalStorage from "../../../hooks/useLocalStorage";

const DeliveryAddressEdit = () => {
    const location = useLocalStorage('location');
    if (!location)  return <></>
    return <>
        <div className="section mt-2">
            <div className="card card-border">
                <div className="card-body">
                    <form>
                        <div className="form-group basic">
                            <div className="input-wrapper">
                                <label className="label" htmlFor="address">Address</label>
                                <input type="text" value={location.formattedAddress} className="form-control" id="address" />
                                <i className="clear-input">
                                    <ion-icon name="close-circle"></ion-icon>
                                </i>
                            </div>
                        </div>
                        <div className="form-group basic">
                            <div className="input-wrapper">
                                <label className="label" htmlFor="city">City</label>
                                <input type="text" value={location.city} className="form-control" id="city" />
                                <i className="clear-input">
                                    <ion-icon name="close-circle"></ion-icon>
                                </i>
                            </div>
                        </div>
                        <div className="form-group basic">
                            <div className="input-wrapper">
                                <label className="label" htmlFor="postal code">Postal Code</label>
                                <input type="text" className="form-control" id="postal code" />
                                <i className="clear-input">
                                    <ion-icon name="close-circle"></ion-icon>
                                </i>
                            </div>
                        </div>
                        <div className="form-group basic">
                            <div className="input-wrapper">
                                <label className="label" htmlFor="country">Country</label>
                                <input type="text" value={location.country} className="form-control" id="country" />
                                <i className="clear-input">
                                    <ion-icon name="close-circle"></ion-icon>
                                </i>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </div>

        <div className="section mt-4">
            <a href="order-delivery-confirmed-address.html" className="btn btn-primary btn-shadow btn-lg btn-block mt-2">Confirm</a>
        </div>
    </>
}
export default DeliveryAddressEdit;