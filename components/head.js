import Head from 'next/head'
const Header = ({ title, children }) => {
    return <Head>
        <title>{title} - Swype Order App</title>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport"
            content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Finapp HTML Mobile Template" />
        <meta name="keywords"
            content="bootstrap, wallet, banking, fintech mobile template, cordova, phonegap, mobile, html, responsive" />
        <link rel="icon" type="image/png" href="/images/favicon.ico" sizes="32x32" />
        {children}
    </Head>
}

export default Header;