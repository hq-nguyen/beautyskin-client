import './Button.scss';
import '../../Styles/styles.scss';
import '../../Styles/_mixin.scss';

// eslint-disable-next-line react/prop-types
const Button = ({ text, variant }) => {
  return <button className={`btn ${variant || ""}`}>{text}</button>;
};

export default Button;
