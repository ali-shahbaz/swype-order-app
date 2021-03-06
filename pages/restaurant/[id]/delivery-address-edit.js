import useLocalStorage from "../../../hooks/useLocalStorage";
import { useRouter } from "next/router";
import Header from "../../../components/head";
import { useEffect, useState } from "react";
import { KEY_CART, KEY_CHANGE_ORDER_TYPE } from "../../../constants";
import { LocalStorageHelper } from "../../../helpers/local-storage-helper";

const DeliveryAddressEdit = () => {
    const router = useRouter();
    const { id } = router.query;
    const cartKey = `${KEY_CART}-${id}`;
    const cartStorage = useLocalStorage(cartKey);
    const [address, setAddress] = useState();

    useEffect(() => {
        if (cartStorage) {
            setAddress(cartStorage.DeliveryAddress);
        }
    }, [cartStorage]);

    const changeHandler = (event) => {
        setAddress(address => address = { ...address, ...{ [event.target.id]: event.target.value } });
    }

    const confirmAddress = () => {
        LocalStorageHelper.store(cartKey, { ...cartStorage, ...{ DeliveryAddress: address } });
        const isOrderTypeChanged = LocalStorageHelper.load(KEY_CHANGE_ORDER_TYPE);
        if (isOrderTypeChanged) {
            router.push(`/restaurant/${id}/checkout`);
        } else {
            router.push(`/restaurant/${id}/menu`);
        }
        
    }

    if (!address) return <></>
    return <>
        <Header title="Edit Delivery Address"></Header>
        <div className="section mt-2">
            <div className="card card-border">
                <div className="card-body">
                    <form>
                        <div className="form-group basic">
                            <div className="input-wrapper">
                                <label className="label" htmlFor="address">Address</label>
                                <input type="text" onChange={(e) => changeHandler(e)} value={address.address} className="form-control" id="address" />
                                <i className="clear-input">
                                    <ion-icon name="close-circle"></ion-icon>
                                </i>
                            </div>
                        </div>
                        <div className="form-group basic">
                            <div className="input-wrapper">
                                <label className="label" htmlFor="city">City</label>
                                <input type="text" onChange={(e) => changeHandler(e)} value={address.city} className="form-control" id="city" />
                                <i className="clear-input">
                                    <ion-icon name="close-circle"></ion-icon>
                                </i>
                            </div>
                        </div>
                        <div className="form-group basic">
                            <div className="input-wrapper">
                                <label className="label" htmlFor="postalCode">Postal Code</label>
                                <input type="text" onChange={(e) => changeHandler(e)} value={address.postalCode} className="form-control" id="postalCode" />
                                <i className="clear-input">
                                    <ion-icon name="close-circle"></ion-icon>
                                </i>
                            </div>
                        </div>
                        <div className="form-group basic">
                            <div className="input-wrapper">
                                <label className="label" htmlFor="country">Country</label>
                                <input type="text" onChange={(e) => changeHandler(e)} value={address.country} className="form-control" id="country" />
                                <i className="clear-input">
                                    <ion-icon name="close-circle"></ion-icon>
                                </i>
                            </div>
                        </div>
                        <div className="form-group basic">
                            <div className="input-wrapper">
                                <label className="label" htmlFor="notes">Notes</label>
                                <textarea type="text" onChange={(e) => changeHandler(e)} value={address.notes} className="form-control" id="notes"></textarea>
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
            <div className="section mt-4">
                <button className="btn btn-primary btn-shadow btn-lg btn-block mt-2" onClick={(e) => confirmAddress(e)}>Confirm</button>
            </div>
        </div>
    </>
}

DeliveryAddressEdit.defaultProps = {
    name: 'DeliveryAddressEdit',
    title: 'Edit',
    showBack: true,
    showCart: false
}

export default DeliveryAddressEdit;