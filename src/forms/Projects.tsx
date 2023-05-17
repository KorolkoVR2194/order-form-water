import React from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";

const Projects = () => {
  const initialValues = {
    fullName: "",
    phone: "",
    email: "",
    address: "",
  };

  const validationSchema = Yup.object({
    fullName: Yup.string()
    .max(15, 'Максимальна довжина імені - 15 символів')
    .required("Поле ПІП є обов'язковим"),
    phone: Yup.string().required("Поле телефон є обов'язковим"),
    email: Yup.string()
      .email("Некоректний Емейл")
      .required("Поле Емейл є обов'язковим"),
    address: Yup.string().required("Поле адреса є обов'язковим"),
  });

  const handleSubmit = (values:any, { setSubmitting }:any) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 400);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <div>
          <label htmlFor="fullName">ПІП:</label>
          <Field type="text" id="fullName" name="fullName" />
          <ErrorMessage name="fullName" component="div" />
        </div>

        <div>
          <label htmlFor="phone">Телефон:</label>
          <Field type="tel" id="phone" name="phone" />
          <ErrorMessage name="phone" component="div" />
        </div>

        <div>
          <label htmlFor="email">Емейл:</label>
          <Field type="email" id="email" name="email" />
          <ErrorMessage name="email" component="div" />
        </div>

        <div>
          <label htmlFor="address">Адреса:</label>
          <Field type="text" id="address" name="address" />
          <ErrorMessage name="address" component="div" />
        </div>

        <button type="submit">Надіслати</button>
      </Form>
    </Formik>
  );
};

export default Projects;