interface StyledLabelProps {
  htmlFor: string;
  text: string;
  [key: string]: unknown;
}

const StyledLabel = ({ htmlFor, text, ...props }: StyledLabelProps) => {
  return (
    <label htmlFor={htmlFor} {...props}>
      {text}
    </label>
  );
};

export default StyledLabel;
