import React,{useState,useEffect} from 'react';
import Modal from 'react-modal';
import InputMask from 'react-input-mask';
import '../styles/specific.css'
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios'; 

import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from '../component/Loader'

const validationSchema = Yup.object({
  selectedOption: Yup.string()
    .required("Один з пунктів обовязковий для вибору"),
  name: Yup.string()
    .max(100, 'Максимальна довжина поля - 100 символів')
    .required("Поле є обов'язковим для заповнення"),
  phone: Yup.string()
    .matches(/^\+38\(0\d{2}\) \d{3}-\d{2}-\d{2}$/, 'Введіть коректний номер телефону')
    .required("Поле телефон є обов'язковим"),
  email: Yup.string()
    .email("Некоректний Email")
    .required("Поле Email є обов'язковим"),
  address: Yup.string()
    .max(80, 'Максимальна довжина поля - 80 символів')
    .required("Поле адреса є обов'язковим"),
  numberTY: Yup.string()
    .required("Поле Номер ТУ є обов'язковим"),
  dateTY: Yup.string()
    .required("Поле Дата ТУ є обов'язковим"),
  issuedTY: Yup.string()
    .max(80, 'Максимальна довжина поля - 100 символів')
    .required("Поле адреса є обов'язковим"),
  checkW: Yup.boolean(),
  checkS: Yup.boolean(),
  comments: Yup.string().max(500, 'Максимальна довжина поля - 500 символів'),
  validPersonal: Yup.boolean().oneOf([true], 'Згода на обробку персональних даних обовязкова'),
  isRecaptchaVerified: Yup.string().required("Будь ласка, пройдіть перевірку reCAPTCHA"),
})


const Specifications = () => {

  const formik = useFormik({
    initialValues: {
      selectedOption:"",
      name: "",
      phone: "",
      email: "",
      address: "",
      checkW: false,
      checkS: false,
      comments: "",
      numberTY:"",
      dateTY:"",
      issuedTY:"",
      statement:null,         /* 0 | Звява */
      specification:null,     /* 1 | Технічні умови */
      technicalPassptor:null, /* 2 | Технічний паспорт на будинок | Технічні умови оригінал*/
      cadastralnumber:null,   /* 3 | Копія кадастрового номеру з планом ділянки*/
      generalPlan:null,       /* 4 | Генплан з посадкою будинку на ділянці*/
      plotplan:null,          /* 5 | План ділянки з розподілом землі */
      placeaccommodation:null,/* 6 | Місце влаштування вводу водопроводу і випуску каналізації */
      permission:null,        /* 7 | Нотаріально завірений дозвіл власників територій , через які будуть проектуватися мережі (при потребі)*/
      stateRegistration:null, /* 8 | Копія свідоцтва про державну реєстрацію підприємства */
      docRooms:null,          /* 9 | Копія документу на приміщення ( договір купівлі-продажу, технічний паспорт, свідоцтво на власність або договір оренди приміщення)  */
      landDeed:null,          /* 10| Копія документів на землю */
      urbanPlanning:null,     /* 11| Містобудівні умови та обмеження */

      
      validPersonal:false,
      isRecaptchaVerified: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      
      const formData = new FormData();

      formData.append('selectedOption', formik.values.selectedOption);
      formData.append('name', formik.values.name);
      formData.append('phone', formik.values.phone);
      formData.append('email', formik.values.email);
      formData.append('address', formik.values.address);
      formData.append('checkW', formik.values.checkW?'1':'0');
      formData.append('checkS', formik.values.checkS?'1':'0');
      formData.append('numberTY', formik.values.numberTY);
      formData.append('dateTY', formik.values.dateTY);
      formData.append('issuedTY', formik.values.issuedTY);
      formData.append('comments', formik.values.comments);

      if (formik.values.statement) {
      formData.append('statement', formik.values.statement);
      }

      if (formik.values.specification) {
        formData.append('specification', formik.values.specification);
      }

      if (formik.values.technicalPassptor) {
        formData.append('technicalPassptor', formik.values.technicalPassptor);
      }

      if (formik.values.cadastralnumber) {
        formData.append('cadastralnumber', formik.values.cadastralnumber);
      }

      if (formik.values.generalPlan) {
        formData.append('generalPlan', formik.values.generalPlan);
      }

      if (formik.values.plotplan) {
        formData.append('plotplan', formik.values.plotplan);
      }

      if (formik.values.placeaccommodation) {
        formData.append('placeaccommodation', formik.values.placeaccommodation);
      }

      if (formik.values.permission) {
        formData.append('permission', formik.values.permission);
      }

      if (formik.values.stateRegistration) {
        formData.append('stateRegistration', formik.values.stateRegistration);
      }

      if (formik.values.docRooms) {
        formData.append('docRooms', formik.values.docRooms);
      }

      if (formik.values.landDeed) {
        formData.append('landDeed', formik.values.landDeed);
      }

      if (formik.values.urbanPlanning) {
        formData.append('urbanPlanning', formik.values.urbanPlanning);
      }


      axios.post('https://service.water.km.ua/Specifications/pr-service.php', formData)
      .then(response => {
        console.log(response.data);

        if (response.data.success===1){
          setVisibleRez(true);
          setMesRez('Заявка відправлена успішно. На електрону адресу відправлено посилання для перегляду статусу заявки.');
        } else {
          setVisibleRez(true);
          setMesRez('Виникла помилка при відправлені заявки. Спробуйте пізніше. Або зверніться за тел. 78-75-60');
        }
    
      })
      .catch(error => {
        console.error(error);

        setVisibleRez(true);
        setMesRez('Виникла помилка при відправлені заявки. Спробуйте пізніше. Або зверніться за тел. 78-75-60');
      });
      setIsLoading(false); 
    },
  });


  useEffect(() => {
    document.title = 'Заявка на виготовлення технічних умов';
  }, []);

  const [visibleRez, setVisibleRez] = useState(false);
  const [mesRez, setMesRez] = useState('');
  /*const [isRecaptchaVerified, setRecaptchaVerified] = useState(false);*/
  const [modalIsPersonal, setModalIsPersonal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  Modal.setAppElement("#root");

  const openModalPersonal = () => {
    setModalIsPersonal(true);
  };

  const closeModalPersonal = () => {
    setModalIsPersonal(false);
  };


  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      width: '900px',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };


const handleUrbanPlanning = (e: React.ChangeEvent<HTMLInputElement>) => {
  const maxSize = 15 * 1024 * 1024;
  const file = e.target.files && e.target.files[0];
  if (file) {
    if (file.size <= maxSize) {
      formik.setFieldValue('urbanPlanning', file);
    } else {
      alert('Розмір файлу перевищує доступний ліміт (15 МБ).');
    }
  }
};

const handleLandDeed = (e: React.ChangeEvent<HTMLInputElement>) => {
  const maxSize = 15 * 1024 * 1024;
  const file = e.target.files && e.target.files[0];
  if (file) {
    if (file.size <= maxSize) {
      formik.setFieldValue('landDeed', file);
    } else {
      alert('Розмір файлу перевищує доступний ліміт (15 МБ).');
    }
  }
};


const handleDocRooms = (e: React.ChangeEvent<HTMLInputElement>) => {
  const maxSize = 15 * 1024 * 1024;
  const file = e.target.files && e.target.files[0];
  if (file) {
    if (file.size <= maxSize) {
      formik.setFieldValue('docRooms', file);
    } else {
      alert('Розмір файлу перевищує доступний ліміт (15 МБ).');
    }
  }
};

const handleStateRegistration = (e: React.ChangeEvent<HTMLInputElement>) => {
  const maxSize = 15 * 1024 * 1024;
  const file = e.target.files && e.target.files[0];
  if (file) {
    if (file.size <= maxSize) {
      formik.setFieldValue('stateRegistration', file);
    } else {
      alert('Розмір файлу перевищує доступний ліміт (15 МБ).');
    }
  }
};



const handlePermission = (e: React.ChangeEvent<HTMLInputElement>) => {
  const maxSize = 15 * 1024 * 1024;
  const file = e.target.files && e.target.files[0];
  if (file) {
    if (file.size <= maxSize) {
      formik.setFieldValue('permission', file);
    } else {
      alert('Розмір файлу перевищує доступний ліміт (15 МБ).');
    }
  }
};


const handlePlaceaccommodation = (e: React.ChangeEvent<HTMLInputElement>) => {
  const maxSize = 15 * 1024 * 1024;
  const file = e.target.files && e.target.files[0];
  if (file) {
    if (file.size <= maxSize) {
      formik.setFieldValue('placeaccommodation', file);
    } else {
      alert('Розмір файлу перевищує доступний ліміт (15 МБ).');
    }
  }
};

const handlePlotplan = (e: React.ChangeEvent<HTMLInputElement>) => {
  const maxSize = 15 * 1024 * 1024;
  const file = e.target.files && e.target.files[0];
  if (file) {
    if (file.size <= maxSize) {
      formik.setFieldValue('plotplan', file);
    } else {
      alert('Розмір файлу перевищує доступний ліміт (15 МБ).');
    }
  }
};

const handleGeneralPlan = (e: React.ChangeEvent<HTMLInputElement>) => {
  const maxSize = 15 * 1024 * 1024;
  const file = e.target.files && e.target.files[0];
  if (file) {
    if (file.size <= maxSize) {
      formik.setFieldValue('generalPlan', file);
    } else {
      alert('Розмір файлу перевищує доступний ліміт (15 МБ).');
    }
  }
};


const handleCadastralnumber = (e: React.ChangeEvent<HTMLInputElement>) => {
  const maxSize = 15 * 1024 * 1024;
  const file = e.target.files && e.target.files[0];
  if (file) {
    if (file.size <= maxSize) {
      formik.setFieldValue('cadastralnumber', file);
    } else {
      alert('Розмір файлу перевищує доступний ліміт (15 МБ).');
    }
  }
};



const handleTechnicalPassptor = (e: React.ChangeEvent<HTMLInputElement>) => {
  const maxSize = 15 * 1024 * 1024;
  const file = e.target.files && e.target.files[0];
  if (file) {
    if (file.size <= maxSize) {
      formik.setFieldValue('technicalPassptor', file);
    } else {
      alert('Розмір файлу перевищує доступний ліміт (15 МБ).');
    }
  }
};

const handleSpecification = (e: React.ChangeEvent<HTMLInputElement>) => {
  const maxSize = 15 * 1024 * 1024;
  const file = e.target.files && e.target.files[0];
  if (file) {
    if (file.size <= maxSize) {
      formik.setFieldValue('specification', file);
    } else {
      alert('Розмір файлу перевищує доступний ліміт (15 МБ).');
    }
  }
};

  const handleStatement = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxSize = 15 * 1024 * 1024;
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size <= maxSize) {
        formik.setFieldValue('statement', file);
      } else {
        alert('Розмір файлу перевищує доступний ліміт (15 МБ).');
      }
    }
  };



return (
  <form onSubmit={formik.handleSubmit} className="max-w-lg mx-auto my-4 p-4 bg-white shadow-lg rounded" encType="multipart/form-data">
      <h3 className="text-xl font-semibold mb-2 text-center">Заявка на виготовлення робочого проекту на водопостачання і водовідведення (зовнішні мережі)</h3>

      {visibleRez?<div className='font-sm text-gren-500 text-center'>{mesRez}</div>:<>

      <div className='mb-1 text-center text-sm'>Для того, щоб замовити послугу, заповніть, будь ласка, онлайн-заявку</div>
      <div className="mb-4">
        <div className='pt-4 flex flex-col'>
          <label className="inline-flex items-start mb-2">
            <input
              type="radio"
              name="selectedOption"
              value="type1"
              checked={formik.values.selectedOption==='type1'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-radio h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Приватний сектор</span>
          </label>
          <label className="inline-flex items-center mb-2">
            <input
              type="radio"
              name="selectedOption"
              value="type2"
              checked={formik.values.selectedOption==='type2'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-radio h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Юридичні особи</span>
          </label>
        </div>
        {formik.touched.selectedOption && formik.errors.selectedOption && (
         <div className='text-sm text-red-500'>{formik.errors.selectedOption}</div>)}
      </div>
      <div className="mb-4">
        <label className="block  mb-2" htmlFor="name">ПІП (Назва підприємства, установи чи організації):</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
         {formik.touched.name && formik.errors.name && (
          <div className='text-sm text-red-500'>{formik.errors.name}</div>)}
      </div>
      <div className="mb-4">
        <label className="block mb-2" htmlFor="contact-info">Контактна інформація:</label>
        <div className="flex items-center">
          <InputMask
            mask="+38(099) 999-99-99"
            maskChar="_"
            type="text"
            pattern="\+38\(0\d{2}\) \d{3}-\d{2}-\d{2}"
            id="phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Контактний телефон"
            aria-labelledby="label-phone"
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2'
          />
         
          <input
            type="text"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Email"
          />
           
        </div>
        {(formik.touched.phone && formik.errors.phone) || (formik.touched.email && formik.errors.email) ? (
        <div className='text-sm mb-4 text-red-500'>
          {formik.errors.phone || formik.errors.email}
        </div>
      ) : null}
      </div>
     
      <div className="flex items-center">
    
      </div>
  
      <div className="mb-4">
        <label className="block mb-2" htmlFor="address">Адреса:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {formik.touched.address && formik.errors.address && (
          <div className='text-sm text-red-500'>{formik.errors.address}</div>)}
      </div>
      <div className="mb-4">
        <div className="flex items-center">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="checkW"
              checked={formik.values.checkW}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Водопостачання</span>
          </label>

          <label className="inline-flex items-center ml-6">
            <input
              type="checkbox"
              name="checkS"
              checked={formik.values.checkS}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Водовідведення</span>
          </label>
        </div>
        {(!formik.values.checkW && !formik.values.checkS) && (
          <div className='text-sm mb-4 text-red-500'>
            Виберіть хочаб один варіант.
          </div>
        )}
      </div>
    

      
      <div className="mb-4">
        <label className="block mb-2" htmlFor="contact-info">Технічні умови:</label>
        
        <div className="flex items-center">
          <input
            type="text"
            id="numberTY"
            name="numberTY"
            value={formik.values.numberTY}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  mr-2"
            placeholder="Номер"
          />

          
          <InputMask
            mask="99.99.9999"
            maskChar="_"
            type="text"
            pattern="\d{2}.\d{2}.\d{4}"
            id="dateTY"
            name="dateTY"
            value={formik.values.dateTY}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Дата"
            aria-labelledby="label-phone"
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
           
        </div>
        {(formik.touched.numberTY && formik.errors.dateTY) || (formik.touched.numberTY && formik.errors.dateTY) ? (
        <div className='text-sm mb-4 text-red-500'>
          {formik.errors.numberTY || formik.errors.dateTY}
        </div>
      ) : null}
      </div>


      <div className="mb-4">
        <input
          type="text"
          id="issuedTY"
          name="issuedTY"
          placeholder='Ким видані'
          value={formik.values.issuedTY}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {formik.touched.issuedTY && formik.errors.issuedTY && (
          <div className='text-sm text-red-500'>{formik.errors.issuedTY}</div>)}
      </div>

      <div className="mb-2">
        <textarea
          id="comments"
          name="comments"
          placeholder='За необхідності Ви можите залишити коментар з приводу замовлення послуги'
         value={formik.values.comments}
         onChange={formik.handleChange}
         onBlur={formik.handleBlur}
         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
         {formik.touched.comments && formik.errors.comments && (
         <div className='text-sm'>{formik.errors.comments}</div>)}
      </div>



      <div className='text-sm mb-4'>
        Отримати проект можете за адресою: вул. Водопровідна, 75, каб №39
      </div>
      
      {formik.values.selectedOption!==''?<div className='font-semibold'>Перелік необхідних документів:</div>:<></>}
      {formik.values.selectedOption!==''?<div className='font-sm text-blue-500'>Розмір файлу не має перевищувати (15 МБ):</div>:<></>}
      


      {formik.values.selectedOption==='type1'?<>

      <div className="mb-2">
        <label className="block mb-1 text-sm" htmlFor="statement">Заява заповнена та підписана:</label>
       
        <input
              type="file"
              id="statement"
              name="statement"
              accept=".jpg,.png,.pdf"
              onChange={handleStatement}
             className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
            />
             {formik.touched.statement && formik.errors.statement && (
              <div className='text-sm text-red-500'>{formik.errors.statement}</div>
              )}
        
      </div>

      <div className="mb-2">
        <label className="block mb-1 text-sm" htmlFor="specification">Технічні умови:</label>
       
        <input
              type="file"
              id="specification"
              name="specification"
              accept=".jpg,.png,.pdf"
              onChange={handleSpecification}
             className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
            />
             {formik.touched.specification && formik.errors.specification && (
              <div className='text-sm text-red-500'>{formik.errors.specification}</div>
              )}
        
      </div>

      <div className="mb-2">
        <label className="block mb-1 text-sm" htmlFor="technicalPassptor">Технічний паспорт будинку:</label>
       
        <input
              type="file"
              id="technicalPassptor"
              name="technicalPassptor"
              accept=".jpg,.png,.pdf"
              onChange={handleTechnicalPassptor}
             className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
            />
             {formik.touched.specification && formik.errors.specification && (
              <div className='text-sm text-red-500'>{formik.errors.specification}</div>
              )}
        
      </div>


      <div className="mb-2">
        <label className="block mb-1 text-sm" htmlFor="cadastralnumber">Копія кадастрового номеру з планом ділянки:</label>
       
        <input
              type="file"
              id="cadastralnumber"
              name="cadastralnumber"
              accept=".jpg,.png,.pdf"
              onChange={handleCadastralnumber}
             className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
            />
             {formik.touched.cadastralnumber && formik.errors.cadastralnumber && (
              <div className='text-sm text-red-500'>{formik.errors.cadastralnumber}</div>
              )}
        
      </div>

      <div className="mb-2">
        <label className="block mb-1 text-sm" htmlFor="generalPlan">Генплан з посадкою будинку на ділянці:</label>
       
        <input
              type="file"
              id="generalPlan"
              name="generalPlan"
              accept=".jpg,.png,.pdf"
              onChange={handleGeneralPlan}
             className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
            />
             {formik.touched.generalPlan && formik.errors.generalPlan && (
              <div className='text-sm text-red-500'>{formik.errors.generalPlan}</div>
              )}
        
      </div>

      <div className="mb-2">
        <label className="block mb-1 text-sm" htmlFor="plotplan">План ділянки з розподілом землі:</label>
       
        <input
              type="file"
              id="plotplan"
              name="plotplan"
              accept=".jpg,.png,.pdf"
              onChange={handlePlotplan}
             className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
            />
             {formik.touched.plotplan && formik.errors.plotplan && (
              <div className='text-sm text-red-500'>{formik.errors.plotplan}</div>
              )}
        
      </div>

      <div className="mb-2">
        <label className="block mb-1 text-sm" htmlFor="placeaccommodation">Місце влаштування вводу водопроводу і випуску каналізації:</label>
       
        <input
              type="file"
              id="placeaccommodation"
              name="placeaccommodation"
              accept=".jpg,.png,.pdf"
              onChange={handlePlaceaccommodation}
             className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
            />
             {formik.touched.placeaccommodation && formik.errors.placeaccommodation && (
              <div className='text-sm text-red-500'>{formik.errors.placeaccommodation}</div>
              )}
        
      </div>


      <div className="mb-2">
        <label className="block mb-1 text-sm" htmlFor="permission">Нотаріально завірений дозвіл власників територій , через які будуть проектуватися мережі (при потребі):</label>
       
        <input
              type="file"
              id="permission"
              name="permission"
              accept=".jpg,.png,.pdf"
              onChange={handlePermission}
             className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
            />
             {formik.touched.permission && formik.errors.permission && (
              <div className='text-sm text-red-500'>{formik.errors.permission}</div>
              )}
        
      </div>
      

</>
      :formik.values.selectedOption==='type2'?<>


      <div className="mb-2">
        <label className="block mb-1 text-sm" htmlFor="statement">Заява заповнена та підписана:</label>
       
        <input
              type="file"
              id="statement"
              name="statement"
              accept=".jpg,.png,.pdf"
              onChange={handleStatement}
             className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
            />
             {formik.touched.statement && formik.errors.statement && (
              <div className='text-sm text-red-500'>{formik.errors.statement}</div>
              )}
        
      </div>

      <div className="mb-2">
        <label className="block mb-1 text-sm" htmlFor="specification">Технічні умови:</label>
       
        <input
              type="file"
              id="specification"
              name="specification"
              accept=".jpg,.png,.pdf"
              onChange={handleSpecification}
             className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
            />
             {formik.touched.specification && formik.errors.specification && (
              <div className='text-sm text-red-500'>{formik.errors.specification}</div>
              )}
        
      </div>


      <div className="mb-2">
        <label className="block mb-1 text-sm" htmlFor="stateRegistration">Копія свідоцтва про державну реєстрацію підприємства:</label>
       
        <input
              type="file"
              id="stateRegistration"
              name="stateRegistration"
              accept=".jpg,.png,.pdf"
              onChange={handleStateRegistration}
             className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
            />
             {formik.touched.stateRegistration && formik.errors.stateRegistration && (
              <div className='text-sm text-red-500'>{formik.errors.stateRegistration}</div>
              )}
        
      </div>


      <div className="mb-2">
        <label className="block mb-1 text-sm" htmlFor="docRooms">Копія документу на приміщення ( договір купівлі-продажу, технічний паспорт, свідоцтво на власність або договір оренди приміщення):</label>
       
        <input
              type="file"
              id="docRooms"
              name="docRooms"
              accept=".jpg,.png,.pdf"
              onChange={handleDocRooms}
             className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
            />
             {formik.touched.docRooms && formik.errors.docRooms && (
              <div className='text-sm text-red-500'>{formik.errors.docRooms}</div>
              )}
        
      </div>

      <div className="mb-2">
        <label className="block mb-1 text-sm" htmlFor="landDeed">Копія документів на землю:</label>
       
        <input
              type="file"
              id="landDeed"
              name="landDeed"
              accept=".jpg,.png,.pdf"
              onChange={handleLandDeed}
             className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
            />
             {formik.touched.landDeed && formik.errors.landDeed && (
              <div className='text-sm text-red-500'>{formik.errors.landDeed}</div>
              )}
        
      </div>


      <div className="mb-2">
        <label className="block mb-1 text-sm" htmlFor="urbanPlanning">Містобудівні умови та обмеження:</label>
       
        <input
              type="file"
              id="urbanPlanning"
              name="urbanPlanning"
              accept=".jpg,.png,.pdf"
              onChange={handleUrbanPlanning}
             className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
            />
             {formik.touched.urbanPlanning && formik.errors.urbanPlanning && (
              <div className='text-sm text-red-500'>{formik.errors.urbanPlanning}</div>
              )}
        
      </div>

      <div className="mb-2">
        <label className="block mb-1 text-sm" htmlFor="placeaccommodation"> Місце влаштування вводу водопроводу і випуску каналізації:</label>
       
        <input
              type="file"
              id="placeaccommodation"
              name="placeaccommodation"
              accept=".jpg,.png,.pdf"
              onChange={handlePlaceaccommodation}
             className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
            />
             {formik.touched.placeaccommodation && formik.errors.placeaccommodation && (
              <div className='text-sm text-red-500'>{formik.errors.placeaccommodation}</div>
              )}
        
      </div>


      <div className="mb-2">
        <label className="block mb-1 text-sm" htmlFor="permission"> Нотаріально завірений дозвіл власників територій , через які будуть проектуватися мережі (при потребі):</label>
       
        <input
              type="file"
              id="permission"
              name="permission"
              accept=".jpg,.png,.pdf"
              onChange={handlePermission}
             className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
            />
             {formik.touched.permission && formik.errors.permission && (
              <div className='text-sm text-red-500'>{formik.errors.permission}</div>
              )}
        
      </div>

    </>:<></>}

  

    <div className="mb-2">
    <ReCAPTCHA 
    sitekey="6LetIx4mAAAAAGnHsRKJO6EOBssu1kNHL6TuKWb3" 
    onChange={(e) => {
          formik.setFieldValue("isRecaptchaVerified", e);
        }} />
         {formik.touched.isRecaptchaVerified && formik.errors.isRecaptchaVerified && (
         <div className='text-sm text-red-500'>{formik.errors.isRecaptchaVerified}</div>)}
    </div>

    <div className="mb-4">
        <div className="flex items-center">
            <input
              type="checkbox"
              name="validPersonal"
              checked={formik.values.validPersonal}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Даю згоду на обробку  <button onClick={openModalPersonal} className='text-blue-500'>персональних даних</button></span>
        </div>
        {formik.touched.validPersonal && formik.errors.validPersonal && (
         <div className='text-sm text-red-500'>{formik.errors.validPersonal}</div>)}
    </div>
   
    <Modal isOpen={modalIsPersonal} onRequestClose={closeModalPersonal} style={customStyles} >
      <h2 className="text-xl font-semibold mb-4">ЗГОДА НА ОБРОБКУ ПЕРСОНАЛЬНИХ ДАНИХ</h2>
      <p className="text-gray-700 text-sm">Відповідно до п. 6 ст. 6 та ст. 11 Закону України «Про захист персональних даних», надаю згоду власнику сайту, на обробку, збір, реєстрацію, накопичення, зберігання, зміну, поновлення, використання та поширення, даних, у тому числі конфіденційної інформації про мою адресу.</p>
      <p className="text-gray-700 text-sm">Цим підтверджую що я повідомлений про включення інформації про мене до баз персональних даних з метою їх обробки у електронних базах та ведення їх обліку, а також відомості про мої права, визначені Законом України «Про захист персональних даних» та про осіб, яким мої дані надаються для використання.</p>
      <p className="text-gray-700 mb-4 text-sm">Повідомляємо, що надані Вами дані, включені до бази персональних даних, власником якої є МКП “Хмельницькводоканал” з метою їх обробки, для ведення обліку в межах, передбачених законом.</p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 text-sm rounded focus:outline-none focus:shadow-outline"
        onClick={closeModalPersonal}
      >
        Закрити
      </button>
    </Modal>
   
      <div className="flex justify-end tm-4">
      {isLoading?<Loader />:
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
        Надіслати
        </button>
        }
      </div>

      
      </>}


  </form>
)
}

export default Specifications;