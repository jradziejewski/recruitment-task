import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import StyledInput from "./StyledInput";
import StyledLabel from "./StyledLabel";
import StyledError from "./StyledError";
import PhoneNumberInput from "./PhoneNumberInput";
import { useState } from "react";
import StyledTextarea from "./StyledTextarea";
import StyledSwitch from "./StyledSwitch";

interface FormValues {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phoneNumber: string;
  message: string;
  policyAgreement: boolean;
}

const fieldRequiredText = "This field is required.";

const SubmissionSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(1, "This field can't be empty.")
    .max(50, ({ max }) => `Exceeded ${max} character limit.`)
    .trim()
    .required(fieldRequiredText),
  lastName: Yup.string()
    .min(1, "This field can't be empty.")
    .max(50, ({ max }) => `Exceeded ${max} character limit.`)
    .trim()
    .required(fieldRequiredText),
  company: Yup.string()
    .min(1, "This field can't be empty.")
    .max(100, ({ max }) => `Exceeded ${max} character limit.`)
    .trim()
    .required(fieldRequiredText),
  email: Yup.string()
    .email("Invalid email address.")
    .trim()
    .required(fieldRequiredText),
  phoneNumber: Yup.number()
    .typeError("Must be a number.")
    .required(fieldRequiredText),
  message: Yup.string()
    .min(1, "This field can't be empty.")
    .max(1000, ({ max }) => `Exceeded ${max} character limit.`)
    .trim()
    .required(fieldRequiredText),
  policyAgreement: Yup.boolean().isTrue(fieldRequiredText),
});

const SubmissionForm = () => {
  const [countryCode, setCountryCode] = useState<string>("US");
  const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phoneNumber: "",
    message: "",
    policyAgreement: false,
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountryCode = e.target.value;
    setCountryCode(newCountryCode);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { policyAgreement: _, ...requestBody } = values;
        fetch("http://localhost:8080/api/submissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...requestBody,
            phoneNumber: `${countryCode} ${values.phoneNumber}`,
          }),
        });
      }}
      validationSchema={SubmissionSchema}
    >
      <Form className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {/* First name */}
          <div>
            <StyledLabel htmlFor="firstName" text="First name" />
            <div className="mt-2.5">
              <Field id="firstName" name="firstName" component={StyledInput} />
              <StyledError name="firstName" />
            </div>
          </div>

          {/* Last name */}
          <div>
            <StyledLabel htmlFor="lastName" text="Last name" />
            <div className="mt-2.5">
              <Field id="lastName" name="lastName" component={StyledInput} />
              <StyledError name="lastName" />
            </div>
          </div>

          {/* Company */}
          <div className="sm:col-span-2">
            <StyledLabel htmlFor="company" text="Company" />
            <div className="mt-2.5">
              <Field id="company" name="company" component={StyledInput} />
              <StyledError name="company" />
            </div>
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <StyledLabel htmlFor="email" text="Email" />
            <div className="mt-2.5">
              <Field
                type="email"
                id="email"
                name="email"
                component={StyledInput}
              />
              <StyledError name="email" />
            </div>
          </div>

          {/* Phone number */}
          <div className="sm:col-span-2">
            <StyledLabel htmlFor="phoneNumber" text="Phone number" />
            <div className="mt-2.5">
              <Field
                id="phoneNumber"
                name="phoneNumber"
                onCountryChange={handleCountryChange}
                component={PhoneNumberInput}
              />
              <StyledError name="phoneNumber" />
            </div>
          </div>

          {/* Message */}
          <div className="sm:col-span-2">
            <StyledLabel htmlFor="phoneNumber" text="Message" />
            <div className="mt-2.5">
              <Field
                type="textarea"
                id="message"
                name="message"
                component={StyledTextarea}
              />
              <StyledError name="message" />
            </div>
          </div>

          {/* Agree to policies*/}
          <div className="flex gap-x-4 sm:col-span-2">
            <div className="flex h-6 items-center">
              <Field
                type="switch"
                id="policyAgreement"
                name="policyAgreement"
                label="Agree to policies"
                component={StyledSwitch}
              />
            </div>
            <label className="text-sm/6 text-gray-600" id="switch-1-label">
              By selecting this, you agree to our
              <a href="#" className="font-semibold text-indigo-600">
                &nbsp;privacy&nbsp;policy
              </a>
              .
            </label>
            <StyledError name="policyAgreement" />
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Let's talk
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default SubmissionForm;
