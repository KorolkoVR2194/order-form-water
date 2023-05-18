import React,{useState,useEffect} from 'react';
import Modal from 'react-modal';
import InputMask from 'react-input-mask';
import '../styles/specific.css'
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios'; 

import { useFormik } from "formik";
import * as Yup from "yup";


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
  checkW: Yup.boolean(),
  checkS: Yup.boolean(),
  comments: Yup.string().max(500, 'Максимальна довжина поля - 500 символів'),
  validPersonal: Yup.boolean().oneOf([true], 'Згода на обробку персональних даних обовязкова'),
  
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
      technicalPassptor:null, /* 1 |Технічний паспорт на будинок */
      landDeed:null,          /* 2 | Копія документів на землю */
      ownership:null,         /* 3 | Свідоцтво на право власності */
      permission:null,        /* 4 | Дозвіл підключення до мереж */
      stateRegistration:null, /* 5 | Копія свідоцтва про державну реєстрацію підприємства */
      questionnaire:null,     /* 6 | Опитувальний лист */
      docRooms:null,          /* 7 | Копія документу на приміщення  */
      balancer:null,          /* 8 | Копія договору або дозволу (балансоутримувача) */
      passport:null,          /* 9 | Копія паспорта громадянина України 1,2,11 сторінки, ідентифікаційний номер */
      urbanPlanning:null,     /* 10| Містобудівні умови та обмеження */
      generalPlan:null,       /* 11| Генплан об'єкта в маштабі 1:500*/
      dogGeneral:null,        /* 12| Договір генпідряду на будівництво*/
      validPersonal:false,
    },
    validationSchema,
    onSubmit: (values) => {
      /*alert(JSON.stringify(values, null, 2));*/
      
      const formData = new FormData();

      formData.append('selectedOption', formik.values.selectedOption);
      formData.append('name', formik.values.name);
      formData.append('phone', formik.values.phone);
      formData.append('email', formik.values.email);
      formData.append('address', formik.values.address);
      formData.append('checkW', formik.values.checkW?'1':'0');
      formData.append('checkS', formik.values.checkS?'1':'0');
      formData.append('comments', formik.values.comments);

      if (formik.values.technicalPassptor) {
      formData.append('technicalPassptor', formik.values.technicalPassptor);
      }
      if (formik.values.landDeed) {
        formData.append('landDeed', formik.values.landDeed);
      }
      if (formik.values.ownership) {
        formData.append('ownership', formik.values.ownership);
      }
      if (formik.values.permission) {
          formData.append('permission', formik.values.permission);
      }

      if (formik.values.stateRegistration) {
        formData.append('stateRegistration', formik.values.stateRegistration);
      }
      if (formik.values.questionnaire) {
        formData.append('questionnaire', formik.values.questionnaire);
      }
      if (formik.values.docRooms) {
        formData.append('docRooms', formik.values.docRooms);
      }
      if (formik.values.balancer) {
        formData.append('balancer', formik.values.balancer);
      }
      if (formik.values.passport) {
        formData.append('passport', formik.values.passport);
      }
      if (formik.values.urbanPlanning) {
        formData.append('urbanPlanning', formik.values.urbanPlanning);
      }
      if (formik.values.generalPlan) {
        formData.append('generalPlan', formik.values.generalPlan);
      }
      if (formik.values.dogGeneral) {
        formData.append('dogGeneral', formik.values.dogGeneral);
      }


      axios.post('https://service.water.km.ua/Specifications/specifications.php', formData)
      .then(response => {
        console.log(response.data);

        if (response.data.success===1){
          setVisibleRez(true);
          setMesRez('Заявка відправлена успішно. На вашу електрону адресу відправлено посилання для перегляду статусу заявки.');
        } else {
          setVisibleRez(true);
          setMesRez('Виникла помилка при відправлені заявки. Спробуйте пізніше. Або зверніться до даміністратора Тел. 78-75-66');
        }
    
      })
      .catch(error => {
        console.error(error);

        setVisibleRez(true);
        setMesRez('Виникла помилка при відправлені заявки. Спробуйте пізніше. Або зверніться до даміністратора Тел. 78-75-66');
      });


    /*  fetch('https://service.water.km.ua/Specifications/specifications.php', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            console.log('Файл успішно завантажено');
            console.log(response);
          } else {
            console.error('Помилка під час завантаження файлу');
          }
        })
        .catch((error) => {
          console.error('Помилка під час відправлення запиту', error);
        });*/


    },
  });


  useEffect(() => {
    document.title = 'Заявка на виготовлення технічних умов';
  }, []);

  const [visibleRez, setVisibleRez] = useState(false);
  const [mesRez, setMesRez] = useState('');

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen1, setModalIsOpen1] = useState(false);


  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openModal1 = () => {
    setModalIsOpen1(true);
  };

  const closeModal1 = () => {
    setModalIsOpen1(false);
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

const handleOwnership = (e: React.ChangeEvent<HTMLInputElement>) => {
  const maxSize = 15 * 1024 * 1024;
  const file = e.target.files && e.target.files[0];
  if (file) {
    if (file.size <= maxSize) {
      formik.setFieldValue('ownership', file);
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
const handleQuestionnaire = (e: React.ChangeEvent<HTMLInputElement>) => {
  const maxSize = 15 * 1024 * 1024;
  const file = e.target.files && e.target.files[0];
  if (file) {
    if (file.size <= maxSize) {
      formik.setFieldValue('questionnaire', file);
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
const handleBalancer = (e: React.ChangeEvent<HTMLInputElement>) => {
  const maxSize = 15 * 1024 * 1024;
  const file = e.target.files && e.target.files[0];
  if (file) {
    if (file.size <= maxSize) {
      formik.setFieldValue('balancer', file);
    } else {
      alert('Розмір файлу перевищує доступний ліміт (15 МБ).');
    }
  }
};
const handlePassport = (e: React.ChangeEvent<HTMLInputElement>) => {
  const maxSize = 15 * 1024 * 1024;
  const file = e.target.files && e.target.files[0];
  if (file) {
    if (file.size <= maxSize) {
      formik.setFieldValue('passport', file);
    } else {
      alert('Розмір файлу перевищує доступний ліміт (15 МБ).');
    }
  }
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
const handleDogGeneral = (e: React.ChangeEvent<HTMLInputElement>) => {
  const maxSize = 15 * 1024 * 1024;
  const file = e.target.files && e.target.files[0];
  if (file) {
    if (file.size <= maxSize) {
      formik.setFieldValue('dogGeneral', file);
    } else {
      alert('Розмір файлу перевищує доступний ліміт (15 МБ).');
    }
  }
};

return (
  <form onSubmit={formik.handleSubmit} className="max-w-lg mx-auto my-4 p-4 bg-white shadow-lg rounded" encType="multipart/form-data">
      <h3 className="text-xl font-semibold mb-2 text-center">Заявка на виготовлення технічних умов</h3>
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
            <span className="ml-2">Приміщення в багатоповерхових будинках</span>
          </label>
          <label className="inline-flex items-center mb-2">
            <input
              type="radio"
              name="selectedOption"
              value="type3"
              checked={formik.values.selectedOption==='type3'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-radio h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Павільйони, будівлі</span>
          </label>
          <label className="inline-flex items-center mb-2">
            <input
              type="radio"
              name="selectedOption"
              value="type4"
              checked={formik.values.selectedOption==='type4'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-radio h-5 w-5 text-blue-600"
            />
            <span className="ml-2 ">Багатоповерхові житлові будинки</span>
          </label>
        </div>
        {formik.touched.selectedOption && formik.errors.selectedOption && (
         <div className='text-sm text-red-500'>{formik.errors.selectedOption}</div>)}
      </div>
      <div className="mb-4">
        <label className="block  mb-2" htmlFor="name">ПІП (Назва падприємства, установи чи організації):</label>
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
        Отримати технічні умови Ви зможете за адресою: вул. Водопровідна, 75 (1 поверх 4 вікно МКП "Хмельницькводоканал" Вівторок,Четвер з 8:00 до 12:00)
      </div>
      
      {formik.values.selectedOption!==''?<div className='font-semibold'>Перелік необхідних документів:</div>:<></>}
      {formik.values.selectedOption!==''?<div className='font-sm text-blue-500'>Розмір файлу не має перевищувати (15 МБ):</div>:<></>}
      


      {formik.values.selectedOption==='type1'?<>
      <div className="mb-2">
        <label className="block mb-2 text-sm" htmlFor="technicalPassptor">Технічний паспорт на будинок:</label>
        <input
              type="file"
              id="technicalPassptor"
              name="technicalPassptor"
              accept="image/*,.pdf"
              onChange={handleTechnicalPassptor}
             className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
            />
             {formik.touched.technicalPassptor && formik.errors.technicalPassptor && (
              <div className='text-sm text-red-500'>{formik.errors.technicalPassptor}</div>
              )}
      </div>
      <div className="mb-2">
      <label className="block mb-2 text-sm" htmlFor="landDeed">Копія документів на землю (державний акт на землю або договір оренди земельної дільнки):</label>
      <input
            type="file"
            id="landDeed"
            name="landDeed"
            accept="image/*,.pdf"
            onChange={handleLandDeed}
            className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
      />
      </div>
      <div className="mb-2">
      <label className="block mb-2 text-sm" htmlFor="ownership">Витяг з Державного реєстру про реєстрацію права власності:</label>
      <input
            type="file"
            id="ownership"
            name="ownership"
            accept="image/*,.pdf"
            onChange={handleOwnership}
            className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
          />
      </div>
      <div className="mb-2">
      <label className="block mb-2 text-sm" htmlFor="permission">При підключені до мереж які не знаходяться на балансі МКП "Хмельницькводоканал" отримати нотаріально або юридично завірений дозвіл:</label>
      <input
            type="file"
            id="permission"
            name="permission"
            accept="image/*,.pdf"
            onChange={handlePermission}
            className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
              />
      </div></>
      :formik.values.selectedOption==='type2'?<>
      <div className="mb-2">
        <label className="block mb-2 text-sm" htmlFor="stateRegistration">Копія свідоцтва про державну реєстрацію підприємства, організації, установи, фізичної особи-підприємця:</label>
        <input
              type="file"
              id="stateRegistration"
              name="stateRegistration"
              accept="image/*,.pdf"
              onChange={handleStateRegistration}
              className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
            />
      </div>
      <div className="mb-2">
      <label className="block mb-2 text-sm" htmlFor="questionnaire">Опитувальний лист (видає проєктна організація):</label>
      <input
            type="file"
            id="questionnaire"
            name="questionnaire"
            accept="image/*,.pdf"
            onChange={handleQuestionnaire}
            className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
          />
      </div>
      <div className="mb-2">
      <label className="block mb-2 text-sm" htmlFor="docRooms">Копія документу на приміщення (договір купівлі-продажу,технічний паспорт,свідоцтво на власність або договір оренди приміщення):</label>
      <input
            type="file"
            id="docRooms"
            name="docRooms"
            accept="image/*,.pdf"
            onChange={handleDocRooms}
            className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
          />
      </div>
      <div className="mb-2">
      <label className="block mb-2 text-sm" htmlFor="balancer">Копія договору або дозволу (балансоутримувача) про спільне користування мережами води та каналізації:</label>
      <input
            type="file"
            id="balancer"
            name="balancer"
            accept="image/*,.pdf"
            onChange={handleBalancer}
            className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
          />
      </div>
      <div className="mb-2">
      <label className="block mb-2 text-sm" htmlFor="passport1">Копія паспорта громадянина України 1,2,11 сторінки, ідентифікаційний номер:</label>
      <input
            type="file"
            id="passport1"
            name="passport1"
            accept="image/*,.pdf"
            onChange={handlePassport}
            className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
          />
      </div>
    </>:formik.values.selectedOption==='type3'?<>
      <div className="mb-2">
        <label className="block mb-2 text-sm" htmlFor="stateRegistration">Копія свідоцтва про державну реєстрацію підприємства, організації, установи, фізичної особи-підприємця:</label>
        <input
              type="file"
              id="stateRegistration"
              name="stateRegistration"
              accept="image/*,.pdf"
              onChange={handleStateRegistration}
              className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
            />
      </div>
      <div className="mb-2">
      <label className="block mb-2 text-sm" htmlFor="questionnaire">Опитувальний лист (видає проєктна організація):</label>
      <input
            type="file"
            id="questionnaire"
            name="questionnaire"
            accept="image/*,.pdf"
            onChange={handleQuestionnaire}
            className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
          />
      </div>
      <div className="mb-2">
      <label className="block mb-2 text-sm" htmlFor="docRooms">Копія документу на приміщення (договір купівлі-продажу,технічний паспорт,свідоцтво на власність або договір оренди приміщення):</label>
      <input
            type="file"
            id="docRooms"
            name="docRooms"
            accept="image/*,.pdf"
            onChange={handleDocRooms}
            className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
          />
      </div>
      <div className="mb-2">
      <label className="block mb-2 text-sm" htmlFor="landDeed">Копія документів на землю (державний акт на землю або договір оренди земельної дільнки):</label>
      <input
            type="file"
            id="landDeed"
            name="landDeed"
            accept="image/*,.pdf"
            onChange={handleLandDeed}
            className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
          />
      </div>
      <div className="mb-2">
      <label className="block mb-2 text-sm" htmlFor="urbanPlanning">Містобудівні умови та обмеження:</label>
      <input
            type="file"
            id="urbanPlanning"
            name="urbanPlanning"
            accept="image/*,.pdf"
            onChange={handleUrbanPlanning}
            className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
          />
      </div>
      <div className="mb-2">
      <label className="block mb-2 text-sm" htmlFor="generalPlan">Генплан об'єкта в маштабі 1:500 з водопровідними і каналізаційними мережами до міської каналізації:</label>
      <input
            type="file"
            id="generalPlan"
            name="generalPlan"
            accept="image/*,.pdf"
            onChange={handleGeneralPlan}
            className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
          />
      </div>
      <div className="mb-2">
      <label className="block mb-2 text-sm" htmlFor="passport1">Копія паспорта громадянина України 1,2,11 сторінки, ідентифікаційний номер:</label>
      <input
            type="file"
            id="passport1"
            name="passport1"
            accept="image/*,.pdf"
            onChange={handlePassport}
            className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
          />
      </div>
      <div className="mb-2">
      <label className="block mb-2 text-sm" htmlFor="permission">При підключені до мереж які не знаходяться на балансі МКП "Хмельницькводоканал" отримати нотаріально або юридично завірений дозвіл:</label>
      <input
            type="file"
            id="permission"
            name="permission"
            accept="image/*,.pdf"
            onChange={handlePermission}
            className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
          />
      </div>
    </>:formik.values.selectedOption==='type4'?<>
      <div className="mb-2">
        <label className="block mb-2 text-sm" htmlFor="stateRegistration">Копія свідоцтва про державну реєстрацію підприємства, організації, установи, фізичної особи-підприємця:</label>
        <input
              type="file"
              id="stateRegistration"
              name="stateRegistration"
              accept="image/*,.pdf"
              onChange={handleStateRegistration}
              className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
            />
      </div>
      <div className="mb-2">
      <label className="block mb-2 text-sm" htmlFor="questionnaire">Опитувальний лист (видає проєктна організація):</label>
      <input
            type="file"
            id="questionnaire"
            name="questionnaire"
            accept="image/*,.pdf"
            onChange={handleQuestionnaire}
            className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
          />
      </div>
      <div className="mb-2">
      <label className="block mb-2 text-sm" htmlFor="landDeed">Копія документів на землю (державний акт на землю або договір оренди земельної дільнки):</label>
      <input
            type="file"
            id="landDeed"
            name="landDeed"
            accept="image/*,.pdf"
            onChange={handleLandDeed}
            className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
          />
      </div>
      <div className="mb-2">
      <label className="block mb-2 text-sm" htmlFor="urbanPlanning">Містобудівні умови (містобудівний розрахунок):</label>
      <input
            type="file"
            id="urbanPlanning"
            name="urbanPlanning"
            accept="image/*,.pdf"
            onChange={handleUrbanPlanning}
            className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
          />
      </div>
      <div className="mb-2">
      <label className="block mb-2 text-sm" htmlFor="permission">При підключені до мереж які не знаходяться на балансі МКП "Хмельницькводоканал" отримати нотаріально або юридично завірений дозвіл:</label>
      <input
            type="file"
            id="permission"
            name="permission"
            accept="image/*,.pdf"
            onChange={handlePermission}
            className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
          />
      </div>
      <div className="mb-2">
      <label className="block mb-2 text-sm" htmlFor="dogGeneral">Договір генпідряду на будівництво:</label>
      <input
            type="file"
            id="dogGeneral"
            name="dogGeneral"
            accept="image/*,.pdf"
            onChange={handleDogGeneral}
            className="appearance-none bg-transparent border-none text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
          />
      </div>
    </>:<></>}

    <div className='mb-4'><button onClick={openModal1} className='text-blue-500' >Інформацію про вартість наших послуг</button></div>

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
            <span className="ml-2">Даю згоду на обробку  <button onClick={openModal} className='text-blue-500'>персональних даних</button></span>
        </div>
        {formik.touched.validPersonal && formik.errors.validPersonal && (
         <div className='text-sm text-red-500'>{formik.errors.validPersonal}</div>)}
    </div>
   
    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} >
      <h2 className="text-2xl font-semibold mb-4">ЗГОДА НА ОБРОБКУ ПЕРСОНАЛЬНИХ ДАНИХ</h2>
      <p className="text-gray-700">Відповідно до п. 6 ст. 6 та ст. 11 Закону України «Про захист персональних даних», надаю згоду власнику сайту, на обробку, збір, реєстрацію, накопичення, зберігання, зміну, поновлення, використання та поширення, даних, у тому числі конфіденційної інформації про мою адресу.</p>
      <p className="text-gray-700">Цим підтверджую що я повідомлений про включення інформації про мене до баз персональних даних з метою їх обробки у електронних базах та ведення їх обліку, а також відомості про мої права, визначені Законом України «Про захист персональних даних» та про осіб, яким мої дані надаються для використання.</p>
      <p className="text-gray-700 mb-4">Повідомляємо, що надані Вами дані, включені до бази персональних даних, власником якої є МКП “Хмельницькводоканал” з метою їх обробки, для ведення обліку в межах, передбачених законом.</p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={closeModal}
      >
        Закрити
      </button>
    </Modal>

    <Modal isOpen={modalIsOpen1} onRequestClose={closeModal1} style={customStyles} >
      <h2 className="text-2xl font-semibold mb-4">Інформацію про вартість наших послуг</h2>
      <table className="min-w-full divide-y divide-gray-200 mt-4 mb-4">
      <thead className="bg-gray-50">
        <tr>
          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Назва
          </th>
          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ціна
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        <tr>
          <td className="py-4 px-6 whitespace-nowrap">Приватний сектор (В)</td>
          <td className="py-4 px-6 whitespace-nowrap">1164.00</td>
        </tr>
        <tr>
          <td className="py-4 px-6 whitespace-nowrap">Приватний сектор (ВіК)</td>
          <td className="py-4 px-6 whitespace-nowrap">2328.00</td>
        </tr>
        <tr>
          <td className="py-4 px-6 whitespace-nowrap">Внутрішньо будинкові мережі</td>
          <td className="py-4 px-6 whitespace-nowrap">1647.00</td>
        </tr>
        <tr>
          <td className="py-4 px-6 whitespace-nowrap">до 3 м/добу (вода)</td>
          <td className="py-4 px-6 whitespace-nowrap">2679.00</td>
        </tr>
        <tr>
          <td className="py-4 px-6 whitespace-nowrap">до 3 м/добу (ВіК)</td>
          <td className="py-4 px-6 whitespace-nowrap">5358.00</td>
        </tr>
        <tr>
          <td className="py-4 px-6 whitespace-nowrap">більше 3 м/добу (В)</td>
          <td className="py-4 px-6 whitespace-nowrap">3816.00</td>
        </tr>
        <tr>
          <td className="py-4 px-6 whitespace-nowrap">більше 3 м/добу (ВіК)</td>
          <td className="py-4 px-6 whitespace-nowrap">7632.00</td>
        </tr>
      </tbody>
    </table>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={closeModal1}
      >
        Закрити
      </button>
    </Modal>



      <div className="flex justify-end tm-4">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
        Надіслати
        </button>
      </div>

      {visibleRez?<div className='font-sm text-gren-500 text-center'>{mesRez}</div>:<></>}



  </form>
)
}

export default Specifications;