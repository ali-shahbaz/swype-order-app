import { CloseCircle } from "react-ionicons";
import useSessionStorage from "../../hooks/useSessionStorage";
import { loginVerify } from "../../services/user-service";
import { useState } from 'react';
import { toast } from 'react-toastify';

const LoginVerify = () => {
    const userPhoneNumber = useSessionStorage('user_number');
    const [number, setNumber] = useState(null);

    const verifyBySMS = () => {
        loginVerify(JSON.stringify(number))
            .then(data => {
                if (data.status == 1) {
                    sessionStorage.setItem('logged_in_user', JSON.stringify(data.payload));
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
            <button className="btn btn-primary btn-shadow btn-lg btn-block mt-2" onClick={verifyBySMS}>Verify</button>
        </div>

    </div>
}

export default LoginVerify;