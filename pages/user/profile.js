import Header from '../../components/head';
import Image from 'next/image'

const Profile = () => {
    return <>
        <Header title="My Profile"></Header>
        <div className="section mt-2">
            <div className="row m-0">
                <div className="col-6 ps-0">
                    <div className="card img-card card-border">
                        <Image src="/images/profile/profile.png" height={250} width={250} objectFit="cover" alt="image" />
                    </div>
                </div>
            </div>
            <div className="card card-border mt-2">
                <div className="card-body">
                    <form>
                        <div className="form-group basic">
                            <div className="input-wrapper">
                                <label className="label" htmlFor="name">Name</label>
                                <input type="text" className="form-control" id="name" />
                                <i className="clear-input">
                                    <ion-icon name="close-circle"></ion-icon>
                                </i>
                            </div>
                        </div>

                        <div className="form-group basic">
                            <div className="input-wrapper">
                                <label className="label" htmlFor="Email">E-mail</label>
                                <input type="email" className="form-control" id="Email" />
                                <i className="clear-input">
                                    <ion-icon name="close-circle"></ion-icon>
                                </i>
                            </div>
                        </div>

                        <div className="form-group flag-mbl-input basic">
                            <div className="input-wrapper">
                                <label className="label" htmlForr="phone">Mobile</label>
                                <input type="tel" id="phone" autoComplete="off" required />
                            </div>
                        </div>
                    </form>

                </div>
            </div>
            <div className="mt-4">
                <a href="welcome.html" className="btn btn-primary btn-shadow btn-lg btn-block mt-2">Save</a>
            </div>

        </div>
    </>
}

export default Profile;