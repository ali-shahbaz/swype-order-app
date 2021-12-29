import Header from '../../components/head';
import Image from 'next/image'
import useLocalStorage from '../../hooks/useLocalStorage';
import { useEffect, useRef, useState } from 'react';
import { GetUserProfile, UpdateProfile, UploadUserImage } from '../../services/user-service';
import { CloseCircle } from 'react-ionicons';
import { toast } from 'react-toastify';
import { KEY_LOGGED_IN_USER } from '../../constants';
import { LocalStorageHelper } from '../../helpers/local-storage-helper';
import LoadingBar from 'react-top-loading-bar';

const Profile = () => {
    const loggedInUser = useLocalStorage(KEY_LOGGED_IN_USER);
    const [userDetail, setUserDetail] = useState(null);
    const ref = useRef(null);

    useEffect(() => {
        if (loggedInUser) {
            // setUserDetail(loggedInUser);
            GetUserProfile(loggedInUser.token).then(data => {
                if (data.status == 1) {
                    loggedInUser.email = data.payload.user.email;
                    loggedInUser.imageUrl = data.payload.user.imageUrl;
                    loggedInUser.name = data.payload.user.name;

                    setUserDetail(loggedInUser);
                    LocalStorageHelper.store(KEY_LOGGED_IN_USER, loggedInUser);
                } else {
                    toast.error(data.error);
                }

            });
        }

    }, [loggedInUser]);

    const fileSelect = (event) => {
        if (event.target.files && event.target.files.length) {
            const formData = new FormData();
            formData.append('file', event.target.files[0]);
            ref.current.continuousStart();

            UploadUserImage(formData, loggedInUser.token).then(data => {
                ref.current.complete();
                if (data.status == 1) {
                    loggedInUser.imageUrl = data.payload.image.url;
                    setUserDetail(prev => prev = { ...prev, ...{ imageUrl: data.payload.image.url } });
                    LocalStorageHelper.store(KEY_LOGGED_IN_USER, loggedInUser);
                    toast.success('Image uploaded, click Save button for save changes.');
                } else {
                    toast.error(data.message ? data.message : data.error);
                }
            })
        }
    }

    const updateUserProfile = (event) => {
        const params = {
            Email: userDetail.email,
            ImageUrl: userDetail.imageUrl,
            Name: userDetail.name,
            MobileNumber: userDetail.MobileNumber
        }
        event.target.disabled = true;
        ref.current.continuousStart();

        UpdateProfile(JSON.stringify(params), loggedInUser.token).then(response => {
            event.target.disabled = false;
            ref.current.complete();
            if (response.status == 1) {
                loggedInUser.user = response.payload.user;
                LocalStorageHelper.store(KEY_LOGGED_IN_USER, loggedInUser);
                toast.success('Profile updated successfully');
            } else {
                toast.error(response.message ? response.message : response.error);
            }
        });
    }

    const changeHandler = (e) => {
        const obj = { [e.target.name]: e.target.value };
        setUserDetail(prev => prev = { ...prev, ...obj });
    }

    if (!userDetail) return <></>
    return <>
        <Header title="My Profile"></Header>
        <LoadingBar color='#F07D00' ref={ref} />
        <div className="section mt-2">
            <div className="row m-0">
                <div className="col-6 ps-0">
                    <div className="card img-card card-border">
                        <label className="uploader">
                            <input accept=".jpg,.jpeg,.png,.jfif" type="file" onChange={(e) => fileSelect(e)} />
                            <Image src={userDetail.imageUrl ? userDetail.imageUrl : '/images/placeholder.jpg'} height={250} width={250} objectFit="cover" alt="image" />
                        </label>
                    </div>
                </div>
            </div>
            <div className="card card-border mt-2">
                <div className="card-body">
                    <form>
                        <div className="form-group basic">
                            <div className="input-wrapper">
                                <label className="label" htmlFor="name">Name</label>
                                <input value={userDetail.name} onChange={(e) => changeHandler(e)} type="text" className="form-control" name="name" id="name" />
                                <i className="clear-input">
                                    <CloseCircle />
                                </i>
                            </div>
                        </div>

                        <div className="form-group basic">
                            <div className="input-wrapper">
                                <label className="label" htmlFor="email">E-mail</label>
                                <input value={userDetail.email} onChange={(e) => changeHandler(e)} type="email" className="form-control" name="email" id="email" />
                                <i className="clear-input">
                                    <CloseCircle />
                                </i>
                            </div>
                        </div>

                        <div className="form-group flag-mbl-input basic">
                            <div className="input-wrapper">
                                <label className="label" htmlFor="phone">Mobile</label>
                                <input value={userDetail.MobileNumber} readOnly={true} type="tel" id="phone" name="phone" autoComplete="off" required />
                            </div>
                        </div>
                    </form>

                </div>
            </div>
            <div className="mt-4">
                <button className="btn btn-primary btn-shadow btn-lg btn-block mt-2" onClick={(e) => updateUserProfile(e)}>Save</button>
            </div>
        </div>
    </>
}

Profile.defaultProps = {
    name: 'Profile',
    title: 'My Profile',
    showBack: false,
    showCart: false
}

export default Profile;