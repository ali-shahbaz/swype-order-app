import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
const Login = () => {
    return <div className="section">
        <div className="card card-border mt-2">
            <div className="card-body">
                <form>
                    <div className="form-group flag-mbl-input basic">
                        <div className="input-wrapper">
                            <label className="label" htmlFor="phone">Mobile</label>
                            <IntlTelInput
                               fieldName="phone" preferredCountries={['us','gb']}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div className="mt-4">
            <a href="order-my-profile-login-sms.html" className="btn btn-primary btn-shadow btn-lg btn-block mt-2">{`Let's go`}</a>
        </div>
    </div>
}

export default Login;