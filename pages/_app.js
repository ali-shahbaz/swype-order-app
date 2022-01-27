import Layout from '../components/layout'
import Sidebar from '../components/sidebar'
import '../styles/globals.css'
import '../styles/override.css'
import '@splidejs/splide/dist/css/splide.min.css'
import React, { useEffect, useState } from "react";
import { RecoilRoot } from 'recoil';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { appWithTranslation } from 'next-i18next';
import Router from 'next/router';

const MyApp = ({ Component, pageProps }) => {
  const [loading, setLoading] = useState(false);
  //let [SidebarObj, setSidebarObj] = useState(null);
  let sidebarObj = 0;
  useEffect(() => {
    window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js');
    Router.onRouteChangeStart = (url) => {
      setLoading(true);
    };

    Router.onRouteChangeComplete = (url) => {
      setLoading(false);
    };

    Router.onRouteChangeError = (err, url) => {
      setLoading(false);
    };
  }, []);
  return <RecoilRoot>
    <Layout props={Component.defaultProps}>
      {!loading ? (
        <Component {...pageProps} />
      ) : (
        <div id="loader">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/loading-icon.png" alt="icon" className="loading-icon" />
        </div>
      )}
      <Sidebar props={Component.defaultProps} abc={++sidebarObj} />
      <ToastContainer hideProgressBar={true} autoClose={3000} position="top-center" />
    </Layout>
  </RecoilRoot>
}

export default appWithTranslation(MyApp)
