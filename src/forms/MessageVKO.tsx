import React,{useState,useEffect} from 'react';
import axios from 'axios'; 
import InputMask from 'react-input-mask';
import Modal from 'react-modal';
import ReCAPTCHA from "react-google-recaptcha";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from '../component/Loader'

const validationSchema = Yup.object({
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
    comments: Yup.string().max(500, 'Максимальна довжина поля - 500 символів'),
    validPersonal: Yup.boolean().oneOf([true], 'Згода на обробку персональних даних обовязкова'),
    isRecaptchaVerified: Yup.string().required("Будь ласка, пройдіть перевірку reCAPTCHA"),
  })


const MessageVKO = () =>{


    const formik = useFormik({
        initialValues: {
          name: "",
          phone: "",
          email: "",
          address: "",
          comments: "",
          validPersonal:false,
          isRecaptchaVerified: "",
        },
        validationSchema,
        onSubmit: (values) => {
          setIsLoading(true);
          const formData = new FormData();
    
          formData.append('name', formik.values.name);
          formData.append('phone', formik.values.phone);
          formData.append('email', formik.values.email);
          formData.append('address', formik.values.address);
          formData.append('comments', formik.values.comments);
          formData.append('type', '4');

    
          axios.post('https://service.water.km.ua/Specifications/rg-service.php', formData)
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
        document.title = 'Повідомлення по роботі вузлів комерційного обліку';
      }, []);


      const [visibleRez, setVisibleRez] = useState(false);
      const [mesRez, setMesRez] = useState('');
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

    

 return (<>
 <form onSubmit={formik.handleSubmit} className="max-w-lg mx-auto my-4 p-4 bg-white shadow-lg rounded" encType="multipart/form-data">
      <h3 className="text-xl font-semibold mb-2 text-center">Повідомлення по роботі Вузлів комерційного обліку</h3>

      {visibleRez?<div className='font-sm text-gren-500 text-center'>{mesRez}</div>:<>

      <div className='mb-4 text-center text-sm'>Для того, щоб замовити послугу, заповніть, будь ласка, онлайн-заявку</div>

      <div className="mb-4">
        <label className="block  mb-2" htmlFor="name">Прізвище Ім'я По батькові:</label>
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
 
      <div className="mb-2">
        <textarea
          id="comments"
          name="comments"
          placeholder='Текст повідомлення по роботі ВКО.'
         value={formik.values.comments}
         onChange={formik.handleChange}
         onBlur={formik.handleBlur}
         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
         {formik.touched.comments && formik.errors.comments && (
         <div className='text-sm'>{formik.errors.comments}</div>)}
      </div>


      <div className="mb-6">
    <ReCAPTCHA 
    sitekey="6LetIx4mAAAAAGnHsRKJO6EOBssu1kNHL6TuKWb3" 
    onChange={(e) => {
          formik.setFieldValue("isRecaptchaVerified", e);
        }} />
         {formik.touched.isRecaptchaVerified && formik.errors.isRecaptchaVerified && (
         <div className='text-sm text-red-500'>{formik.errors.isRecaptchaVerified}</div>)}
    </div>

    <div className="mb-4 mt-4">
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


 </>)
}

export default MessageVKO;