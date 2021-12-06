import Layout from '../components/layout'
import Sidebar from '../components/sidebar'
import '../styles/globals.css'
import '../styles/override.css'
import '@splidejs/splide/dist/css/splide.min.css'
import { useEffect } from "react";
import { RecoilRoot } from 'recoil';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle');
  }, []);
  return <RecoilRoot>
    <Layout name={Component.name.toLowerCase()}>
      <Component {...pageProps} />
      <Sidebar />
    </Layout>
  </RecoilRoot>
}

export default MyApp
