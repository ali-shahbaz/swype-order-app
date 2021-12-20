import { useState } from 'react';
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import { loginUser } from '../../services/user-service';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';


const Login = () => {
    const [number, setNumber] = useState(null);
    const router = useRouter();
    const singin = (event) => {
        if (number.isValid) {
            loginUser(JSON.stringify(number))
                .then(data => {
                    if (data.status == 1) {
                        sessionStorage.setItem('user_number', JSON.stringify(number))
                        router.push('/user/login-verify');
                    } else {
                        toast.error(data.error);
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
        <div className="card card-border mt-2">
            <div className="card-body">
                <form>
                    <div className="form-group flag-mbl-input basic">
                        <div className="input-wrapper">
                            <label className="label" htmlFor="phone">Mobile</label>
                            <IntlTelInput onPhoneNumberChange={changeHandler}
                                fieldName="phone" preferredCountries={['pk', 'gb']}
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

export default Login;