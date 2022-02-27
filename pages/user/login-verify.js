import { CloseCircle } from "react-ionicons";
import { VerifyLogin } from "../../services/user-service";
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useRecoilState } from "recoil";
import { userLoggedInState } from "../../states/atoms";
import React, { useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';
import Header from "../../components/head";
import { KEY_CART, KEY_LOGGED_IN_USER, KEY_RESTAURANT_DATA, KEY_USER_NUMBER } from "../../constants";
import { LocalStorageHelper } from "../../helpers/local-storage-helper";
import useLocalStorage from "../../hooks/useLocalStorage";

const LoginVerify = () => {
    const userPhoneNumber = useLocalStorage(KEY_USER_NUMBER);
    const [number, setNumber] = useState(null);
    const router = useRouter();
    const ref = useRef(null);
    const [isUserLoggedIn, setIsUserLoggedIn] = useRecoilState(userLoggedInState);

    const verifyBySMS = (event) => {
        event.target.disabled = true;
        ref.current.continuousStart();

        VerifyLogin(JSON.stringify(number))
            .then(data => {
                event.target.disabled = false;
                ref.current.complete();

                if (data.status == 1) {
                    LocalStorageHelper.store(KEY_LOGGED_IN_USER, { ...data.payload, ...userPhoneNumber });
                    setIsUserLoggedIn(true);
                    const storageData = LocalStorageHelper.load(KEY_RESTAURANT_DATA);
                    const id = storageData.id;
                    const cartKey = `${KEY_CART}-${id}`;
                    const cartStorage = LocalStorageHelper.load(cartKey) || null;
                    if (cartStorage) {
                        LocalStorageHelper.remove(KEY_USER_NUMBER);
                        cartStorage = {
                            ...cartStorage, ...{
                                verifymobile: userPhoneNumber.MobileNumber,
                                verifyfullname: data.payload.user.name
                            }
                        };
                        LocalStorageHelper.store(cartKey, cartStorage);

                        if (cartStorage.saleDetails.length > 0) {
                            router.push(`/restaurant/${id}/checkout`);
                        } else {
                            router.push(`/restaurant/${id}`);
                        }

                    }

                } else {
                    toast.error(data.message);
                }
            })
    }

    const changeHandler = (e) => {
        setNumber({
            MobileNumber: userPhoneNumber.MobileNumber,
            Otp: e.target.value
        });
    }

    return <div className="section mt-2">
        <Header title="Verify Login"></Header>
        <LoadingBar color='#F07D00' ref={ref} />
        <div className="card card-border mt-2">
            <div className="card-body">
                <form>
                    <div className="form-group basic">
                        <div className="input-wrapper">
                            <label className="label" htmlFor="enterCode">Enter Code from SMS</label>
                            <input type="text" className="form-control" id="enterCode" onChange={(e) => changeHandler(e)} />
                            <i className="clear-input">
                                <CloseCircle />
                            </i>
                        </div>
                    </div>
                </form>

            </div>
        </div>

        <div className="mt-4">
            <button className="btn btn-primary btn-shadow btn-lg btn-block mt-2" onClick={(e) => verifyBySMS(e)}>Next</button>
        </div>

    </div>
}

LoginVerify.defaultProps = {
    name: 'LoginVerify',
    title: 'Verify',
    showBack: true,
    showCart: false
}

export default LoginVerify;