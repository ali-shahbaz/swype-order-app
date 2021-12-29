import { useState } from 'react';
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import { LoginUser } from '../../services/user-service';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';
import Header from '../../components/head';
import { KEY_USER_NUMBER } from '../../constants';


const Login = () => {
    const [number, setNumber] = useState(null);
    const router = useRouter();
    const ref = useRef(null);

    const singin = (event) => {
        if (number && number.isValid) {
            event.target.disabled = true;
            ref.current.continuousStart();
            
            LoginUser(JSON.stringify(number))
                .then(data => {
                    event.target.disabled = false;
                    ref.current.complete();
                    if (data.status == 1) {
                        sessionStorage.setItem(KEY_USER_NUMBER, JSON.stringify(number));
                        router.push('/user/login-verify');
                    } else {
                        ref.current.complete();
                    }
                    
                });
        } else {
            toast.error("Phone number is not valid");
        }

    }

    const changeHandler = (isValid, value, selectedCountryData, fullNumber, extension) => {
        setNumber({
            MobileNumber: fullNumber,
            isValid
        });
    }

    return <div className="section">
        <Header title="Login"></Header>
        <LoadingBar color='#F07D00' ref={ref} />
        <div className="card card-border mt-2">
            <div className="card-body">
                <form>
                    <div className="form-group flag-mbl-input basic">
                        <div className="input-wrapper">
                            <label className="label" htmlFor="phone">Mobile</label>
                            <IntlTelInput onPhoneNumberChange={changeHandler}
                            fieldName="phone" preferredCountries={['us', 'gb', 'es','se']} 
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div className="mt-4">
            <button className="btn btn-primary btn-shadow btn-lg btn-block mt-2" onClick={(e) => singin(e)}>{`Let's go`}</button>
        </div>
    </div>
}

Login.defaultProps = {
    name: 'Login',
    title: 'Login',
    showBack: false,
    showCart: false
}

export default Login;