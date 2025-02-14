import type { FieldInputProps, FormikProps } from "formik";

interface StyledTextareaProps {
  field: FieldInputProps<string>;
  form: FormikProps<string>;
  [key: string]: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledTextarea = ({ field, form, ...props }: StyledTextareaProps) => {
  return (
    <textarea
      {...field}
      {...props}
      rows={4}
      className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
    />
  );
};

export default StyledTextarea;
