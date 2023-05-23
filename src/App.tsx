import React,{useEffect} from 'react';
import './styles/styles.css';
import { Outlet, Link } from "react-router-dom";


function Home() {

  useEffect(() => {
    document.title = 'Сервіс онлайн послуг';
  }, []);

  return (
    <div className='max-w-lg mx-auto my-4 p-4 bg-white  rounded'>
      <h2 className='text-xl font-semibold mb-2 text-center'>СЕРВІС ОНЛАЙН-ПОСЛУГ</h2>
        <nav>
          <ul className='text-center '>
            <li className='py-3 my-4 bg-sky-500'>
              <Link to="/specifications" className='text-white font-semibold' >Виготовлення технічних умов</Link>
            </li>
          </ul>
          <ul className='text-center '>
            <li className='py-3 my-4 bg-sky-500'>
              <Link to="/numberregistered" className='text-white font-semibold' >Зміна кількості прописаних осіб (фізичні особи)</Link>
            </li>
          </ul>
          <ul className='text-center '>
            <li className='py-3 my-4 bg-sky-500'>
              <Link to="/verificationcounter" className='text-white font-semibold' >Заявка на повірку лічильників</Link>
            </li>
          </ul>
          <ul className='text-center '>
            <li className='py-3 my-4 bg-sky-500'>
              <Link to="/changeowner" className='text-white font-semibold' >Зміна власника (фізичні особи)</Link>
            </li>
          </ul>
        </nav>
      <Outlet />
    </div>
  );
}

export default Home;


