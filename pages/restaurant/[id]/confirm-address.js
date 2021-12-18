import { useEffect, useRef, useState } from "react";
import Header from "../../../components/head";
import PropTypes from 'prop-types';
import { CloseCircle } from "react-ionicons";
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from "next/router";
import { CreateOutline } from "react-ionicons";

const ConfirmAddress = ({ width, height, lat, lng, zoom,
    zoomControl, scaleControl, fullscreenControl, disableDefaultUI }) => {

    const mapDivRef = useRef();
    const autoCompleteRef = useRef();
    const router = useRouter();
    // const [address, setAddress] = useState({});
    const { id } = router.query;
    const options = {
        center: { lat, lng },
        zoom,
        disableDefaultUI,
        zoomControl,
        scaleControl,
        fullscreenControl,
        clickableIcons: false,
        clickableLabels: false,
        mapTypeControlOptions: {
            mapTypeIds: []
        }
    }
    const clientPosition = (position) => {
        options.center.lat = position.coords.latitude;
        options.center.lng = position.coords.longitude;

        initMap();
    }

    useEffect(() => {
        debugger
        if (localStorage.getItem('location')) {
            const location = JSON.parse(localStorage.getItem('location'));
            options.center.lat = location.latitude;
            options.center.lng = location.longitude;

            initMap();
        } else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(clientPosition, (error) => {
                    if (error.PERMISSION_DENIED) {
                        toast.error(`We're having trouble in finding your location, please enable your location permission.`)
                    }
                    initMap();
                });
            } else {
                initMap();
            }
        }

    });

    const initMap = () => {
        getAddress(options.center)
        const map = new google.maps.Map(mapDivRef.current, options);
        const autoCompleteOptions = {
            fields: ["address_components", "geometry", "icon", "name"],
            strictBounds: false,
            types: ["establishment"],
        };
        const autocomplete = new google.maps.places.Autocomplete(autoCompleteRef.current, autoCompleteOptions);
        autocomplete.addListener('place_changed', (e) => {
            const place = autocomplete.getPlace();
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            map.setCenter({ lat, lng });
            getAddress({ lat, lng });
        });
        map.addListener('dragend', () => {
            const center = map.getCenter();
            const latlng = {
                lat: center.lat(),
                lng: center.lng()
            };
            getAddress(latlng);
        });

        // const marker = new google.maps.Marker({
        //     position: options.center,
        //     map,
        //     title: "We'll deliver here",
        //     optimized: true
        // });

        // map.addListener('center_changed', () => {
        //     marker.setPosition(map.getCenter())
        // })

    }

    const getAddress = (latLng) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: latLng }).then((response) => {
            if (response.results[0]) {
                console.log(response.results[0]);
                const address = response.results[0].address_components.filter(p =>
                    p.types.indexOf('establishment') >= 0 ||
                    p.types.indexOf('premise') >= 0 ||
                    p.types.indexOf('sublocality_level_3') >= 0 ||
                    p.types.indexOf('sublocality_level_2') >= 0 ||
                    p.types.indexOf('sublocality_level_1') >= 0 ||
                    p.types.indexOf('route') >= 0 ||
                    p.types.indexOf('sublocality_level_1') >= 0).map(p => p.long_name).join(', ');

                autoCompleteRef.current.value = response.results[0].formatted_address;
                const location = {
                    placeId: response.results[0].place_id,
                    formattedAddress: address,
                    latitude: response.results[0].geometry.location.lat(),
                    longitude: response.results[0].geometry.location.lng(),
                    city: response.results[0].address_components.find(p => p.types.indexOf('locality') >= 0).long_name,
                    country: response.results[0].address_components.find(p => p.types.indexOf('country') >= 0).long_name,
                    countryCode: response.results[0].address_components.find(p => p.types.indexOf('country') >= 0).short_name
                }

                // setAddress(location);
                localStorage.setItem('location', JSON.stringify(location))
            }
        }).catch((e) => console.log("Geocoder failed due to: " + e));
    }

    return <>
        <Header title={'Cofirm Delivery Address'}>

        </Header>
        <div className="section mt-2">
            <div className="card card-border mt-2">
                <div className="card-body">
                    <form>
                        <div className="form-group basic">
                            <div className="input-wrapper">
                                <input type="text" className="form-control" ref={autoCompleteRef} id="enterCode" />
                                <i className="clear-input">
                                    <CloseCircle />
                                </i>
                            </div>
                            <div>
                                <span>
                                    {/* {address.formattedAddress}, {address.city} <br />
                                    {address.country} */}
                                </span>
                                <CreateOutline />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="section mt-2" style={{ width, height }} ref={mapDivRef} id="map"></div>
            <div className="section mt-4">
                <Link href={`/restaurant/${id}/delivery-address-edit`}>
                    <a className="btn btn-primary btn-shadow btn-lg btn-block">Confirm</a>
                </Link>
            </div>
        </div>
    </>
}

ConfirmAddress.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
    zoom: PropTypes.number,
    mapRef: PropTypes.func,
    disableDefaultUI: PropTypes.bool,
    zoomControl: PropTypes.bool,
    scaleControl: PropTypes.bool,
    fullscreenControl: PropTypes.bool,
    gestureHandling: PropTypes.bool,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    showMyLocationButton: PropTypes.bool,
}

ConfirmAddress.defaultProps = {
    width: '100%',
    height: '28em',
    lat: -6.291272,
    lng: 106.800752,
    zoom: 17,
    mapRef: () => { },
    disableDefaultUI: false,
    zoomControl: false,
    scaleControl: false,
    fullscreenControl: false,
    gestureHandling: false,
    onDragStart: () => { },
    onDragEnd: () => { },
    showMyLocationButton: false,
}

export default ConfirmAddress;