import Layout from '../components/layout'
import Sidebar from '../components/sidebar'
import '../styles/globals.css'
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle');
    import('@splidejs/splide/dist/css/splide.min.css');
  }, []);
  return <Layout name={Component.name.toLowerCase()}>
    <Component {...pageProps} />
    <Sidebar />
  </Layout>
}

export default MyApp
