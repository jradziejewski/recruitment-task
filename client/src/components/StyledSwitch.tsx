import type { FieldInputProps, FormikProps } from "formik";

interface StyledSwitchProps {
  field: FieldInputProps<boolean>;
  form: FormikProps<string>;
  label: string;
}

const StyledSwitch = ({ field, form, label }: StyledSwitchProps) => {
  // Toggle the switch state
  const toggleSwitch = () => {
    form.setFieldValue(field.name, !field.value); // Update Formik's state
  };

  return (
    <button
      type="button"
      onClick={toggleSwitch}
      className={`flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
        field.value ? "bg-indigo-600" : "bg-gray-200"
      }`}
      role="switch"
      aria-checked={field.value}
    >
      <span className="sr-only">{label}</span>
      <span
        className={`size-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out ${
          field.value ? "translate-x-4" : "translate-x-0"
        }`}
      ></span>
    </button>
  );
};

export default StyledSwitch;
