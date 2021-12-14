import { useEffect, useRef, useState } from "react";
import Header from "../../../components/head";
import PropTypes from 'prop-types';

const ConfirmAddress = ({ width, height, lat, lng, zoom,
    zoomControl, scaleControl, fullscreenControl, disableDefaultUI, gestureHandling,
    mapRef, onDragStart, onDragEnd, showMyLocationButton }) => {

    const mapDivRef = useRef();
    const [isDragging, setIsDragging] = useState(false);
    const [localMapRef, setlocalMapRef] = useState(null);
    const [latestLocation, setLatestLocation] = useState(null);
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

    useEffect(() => {
        setTimeout(() => {
            new google.maps.Map(mapDivRef.current, options);
        }, 1000);
    })

    return <>
        <Header title={'Cofirm Delivery Address'}>
            <script async
                src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBAM49P9DVbH42o1XVL-dEZNkOYFhEVdRk`}>
            </script>
        </Header>
        <div className="section" style={{ width, height }} ref={mapDivRef} id="map"></div>
        <div className="section mt-4">
            <a href="order-delivery-edit.html" className="btn btn-primary btn-shadow btn-lg btn-block">Confirm</a>
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
    height: '30em',
    lat: -6.291272,
    lng: 106.800752,
    zoom: 16,
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