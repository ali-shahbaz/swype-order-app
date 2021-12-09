import Layout from '../components/layout'
import Sidebar from '../components/sidebar'
import '../styles/globals.css'
import '../styles/override.css'
import '@splidejs/splide/dist/css/splide.min.css'
import { useEffect } from "react";
import { RecoilRoot } from 'recoil';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { appWithTranslation } from 'next-i18next';

const MyApp = ({ Component, pageProps }) => {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle');
  }, []);
  return <RecoilRoot>
    <Layout name={Component.name.toLowerCase()}>
      <Component {...pageProps} />
      <Sidebar />
      <ToastContainer hideProgressBar={true} autoClose={3000} position="top-center" />
    </Layout>
  </RecoilRoot>
}

export default appWithTranslation(MyApp)
