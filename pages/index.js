import Header from '../components/head';
import Link from 'next/link';
import { apiSettings } from '../configs/api-settings';
import Image from 'next/image';
import { useState } from 'react';
import { LocationOutline } from "react-ionicons";


Home.defaultProps = {
  name: 'Home',
  title: 'Restaurants',
  showBack: false,
  showCart: false
}

export default function Home({ data }) {

  const actualRestaurantDate = data.payload.restaurants;
  const [restaurantData, setRestaurantData] = useState(actualRestaurantDate);
  const SearchRestaurant = (search) => 
  {
      let filterd = actualRestaurantDate;
      if(search)
      {
          search = search.toLocaleLowerCase();
          filterd = actualRestaurantDate.filter(item=> {

              if(item.companyName && item.companyName.toLocaleLowerCase().indexOf(search) > -1)
                return true;
                
              if(item.companyLocation && item.companyLocation.toLocaleLowerCase().indexOf(search) > -1)
                return true;
              
              return false
            });
      }
      setRestaurantData(filterd);
  };
  return <>
    <Header title="Restaurants">
      <style>
        {` #hamburgerMenu {
          display: none;
        }`}
      </style>
    </Header>
    <div className="section confirmed-email mt-2">
            <form action="#">
                <div className="card card-border">
                    <div className="card-body">
                        <div className="form-group basic">
                            <div className="input-wrapper">
                                <label className="label">Search</label>
                                <input type="email" className="form-control" required="" onChange={(e)=>SearchRestaurant(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
     </div>
    <div className="section">
      <ul className="row ulRestaurant">
        {
          restaurantData.map(item => {
            return <div key={item.companyId} className="col-sm-4 mt-2">
              <Link href={`/restaurant/${item.companyId}`}>
                <a>
                  <div className="card item-card card-border p-0 restaurant-card">
                    <div>
                      <Image src={item.companyLogoUrl ? item.companyLogoUrl : '/images/blank.png'} height={300} width={400} layout="responsive" priority className="card-img-top" alt="image" />
                    </div>
                    <h4  className="card-title">{item.companyName}</h4>
                    { 
                      item.companyLocation && 
                      <h6 className="card-text">
                        <LocationOutline className="switchSVGColor" width="20px" height="20px" />
                          {item.companyLocation}
                      </h6>
                    }
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
  const res = await fetch(`${apiSettings.apiUrl}orderapp/GetRestaurants`);
  const data = await res.json()
  // Pass data to the page via props
  return { props: { data } }
}