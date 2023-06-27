import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

interface Services {
  name_status: string;
  dates: string;
  id_reg: number;
}

const Status: React.FC = () => {
  const [nameService, setNameService] = useState('');
  const [rez, setRez] = useState<Services[]>([]);

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type');
    const code = queryParams.get('code');

    if (typeof code === 'string') {
      get_data(type, code);
    }
  }, [location.search]);

  useEffect(() => {
    document.title = 'Статус замовлення';
  }, []);

  function get_data(type: any, code_service: string) {
    const formData = new FormData();

    formData.append('type', type);
    formData.append('code', code_service);
    formData.append('token', 'aic634kmsj98sm');

    axios
      .post('https://service.water.km.ua/Specifications/status.php', formData)
      .then((response) => {
        console.log(response.data);
        setRez(response.data.data[0]);
        setNameService(response.data.name_service);
      })
      .catch((error) => {
        console.error(error);
      });
  }


  const ListService=rez;

  return (
    <div className="max-w-lg mx-auto">
    <h3 className="text-xl font-semibold mb-2 text-center">{nameService}</h3>
    <div className="relative">
      <div className="border-r-2 border-gray-300 absolute h-full top-0" style={{ left: '15px' }}></div>
      <ul className="list-none m-0 p-0">
        {rez.map((row, index) => (
          <li key={index} className="mb-2">
            <div className="flex items-center mb-1">
              <div className="bg-gray-300 rounded-full h-8 w-8"></div>
              <div className="flex-1 ml-4 font-medium">{row.name_status}</div>
            </div>
            <div className="ml-12">
              <p className="text-sm text-gray-500">{row.dates}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
    <form className="mt-8">{/* Ваші поля форми тут */}</form>
  </div>
  );
};

export default Status;