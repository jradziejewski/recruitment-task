import type { FieldInputProps, FormikProps } from "formik";

interface PhoneNumberInputProps {
  field: FieldInputProps<string>;
  form: FormikProps<string>;
  onCountryChange: () => void;
  [key: string]: unknown;
}

const PhoneNumberInput = ({
  field,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  form,
  onCountryChange,
  ...props
}: PhoneNumberInputProps) => {
  return (
    <div className="flex rounded-md bg-white outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
      <div className="grid shrink-0 grid-cols-1 focus-within:relative">
        <select
          id="country"
          name="country"
          onChange={onCountryChange}
          autoComplete="country"
          aria-label="Country"
          className="col-start-1 row-start-1 w-full appearance-none rounded-md py-2 pl-3.5 pr-7 text-base text-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        >
          <option value="US">US</option>
          <option value="FR">FR</option>
          <option value="PL">PL</option>
          <option value="ES">ES</option>
        </select>
        <svg
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
          data-slot="icon"
        >
          <path
            fill-rule="evenodd"
            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>
      <input
        {...field}
        {...props}
        className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
      />
    </div>
  );
};

export default PhoneNumberInput;
