import { ErrorMessage } from "formik";

const StyledError = ({ name }: { name: string }) => {
  return (
    <div className="h-1">
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
};

export default StyledError;
