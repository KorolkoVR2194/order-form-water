import React,{useEffect} from 'react';
import './styles/styles.css';
import { Outlet, Link } from "react-router-dom";


function Home() {

  useEffect(() => {
    document.title = 'Сервіс онлайн послуг';
  }, []);

  return (
    <div className='grid grid-cols-5 gap-2'>
      <h2 className='text-3xl font-bold text-blue-400 col-start-2 col-span-3 text-center mt-6'>СЕРВІС ОНЛАЙН-ПОСЛУГ</h2>
        <nav className='col-start-2 col-span-3 '>
          <ul className='text-center '>
            <li className='py-3 my-4 bg-sky-500'>
              <Link to="/specifications" className='text-white font-semibold' >Виготовлення технічних умов</Link>
            </li>
          </ul>
        </nav>
      <Outlet />
    </div>
  );
}

export default Home;
