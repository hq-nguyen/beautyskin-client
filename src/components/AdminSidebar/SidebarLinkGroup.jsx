import { useState } from 'react';
import PropTypes from 'prop-types';

function SidebarLinkGroup({
  children,
  activecondition,
}) {

  const [open, setOpen] = useState(activecondition);

  const handleClick = () => {
    setOpen(!open);
  }

  return (
    <li className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 ${activecondition ? 'bg-violet-50' : 'hover:bg-gray-50'}`}>
      {children(handleClick, open)}
    </li>
  );
}
SidebarLinkGroup.propTypes = {
  children: PropTypes.func.isRequired,
  activecondition: PropTypes.bool.isRequired,
};

export default SidebarLinkGroup;
