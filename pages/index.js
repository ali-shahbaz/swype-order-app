import styles from '../styles/Home.module.css'
import { useEffect } from 'react';
import Header from '../components/head';
import Link from 'next/link';
import { apiSettings } from '../configs/api-settings';

export default function Home({ data }) {
  useEffect(() => {
    if (window) {
      window.sessionStorage.setItem('init_data', JSON.stringify(data));
      // set props data to session storage or local storage  
    }
  }, [data]);
  return (
    <div>
      <Header title="Swype Order | Welcome"></Header>
      <Link href={`/restaurant/1`} >
        <a>Open Restaurant</a>
      </Link>
    </div>
  )
}

// This gets called on every request
export async function getServerSideProps({ params }) {
  // Fetch data from external API
  const res = await fetch(`${apiSettings.apiUrl}/orderapp/getmenu/1`)
  const data = await res.json()
  // Pass data to the page via props
  return { props: { data } }
}