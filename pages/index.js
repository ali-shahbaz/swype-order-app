import { useEffect } from 'react';
import Header from '../components/head';
import Link from 'next/link';
import { apiSettings } from '../configs/api-settings';
import Image from 'next/image';

export default function Home({ data }) {
  useEffect(() => {
    if (window) {
      // window.sessionStorage.setItem('init_data', JSON.stringify(data));
      // set props data to session storage or local storage  
    }
  }, [data]);

  return <>
    <Header title="Swype Order | Restaurants"></Header>
    <div className="section">
      <ul className="row checkout-item">
        {
          data.payload.restaurants.map(item => {
            return <div key={item.companyId} className="col-4 mt-2">
              <Link href={`/restaurant/${item.companyId}`}>
                <a>
                  <div className="card item-card card-border p-0">
                    <Image src={item.companyLogoUrl} height={300} width={400} layout="responsive" className="card-img-top" alt="image" />
                    <h4>{item.companyName}</h4>
                  </div>
                </a>
              </Link>
            </div>
          })
        }
      </ul>
    </div>
  </>
}

// This gets called on every request
export async function getServerSideProps({ params }) {
  // Fetch data from external API
  const res = await fetch(`${apiSettings.apiUrl}/orderapp/GetRestaurants`)
  const data = await res.json()
  // Pass data to the page via props
  return { props: { data } }
}