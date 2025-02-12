import { useRoutes } from "react-router-dom";
import Home from '../pages/Home';
import Shop from '../pages/Shop/Shop';
import About from '../pages/About/About';
import Blog from '../pages/Blog/Blog';
import News from '../pages/News/News';
import TestSkinType from '../pages/TestSkinType/TestSkinType';
import Cart from '../pages/Cart/Cart';
import Register from '../pages/Register/Register';
import Login from '../pages/Login/Login';
import AccountManagement from '../pages/ManageAccount/AccountManagement';
import InfoUser from '../pages/InfoUser/InfoUser';
import Address from '../pages/Address/Address';
import AddAddress from '../pages/AddressForm/AddressForm';
import AddressDefault from '../pages/AddressManagement';
import Order from '../pages/ManageOrder';
import ChangePassword from '../pages/ChangePassword';
import UserLayout from '../layout/UserLayout';
import MainLayout from '../layout/MainLayout'; // Assuming you have this

const Routers = () => {
  const routing = useRoutes([
    {
      path: "/",
      element: <MainLayout />, 
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: '/about',
          element: <About />,
        },
        {
          path: '/shop',
          element: <Shop />,
        },
        {
          path: '/blog',
          element: <Blog />,
        },
        {
          path: '/news',
          element: <News />,
        },
        {
          path: '/test',
          element: <TestSkinType />,
        },
        {
          path: '/cart',
          element: <Cart />,
        },
        {
          path: '/login',
          element: <Login />,
        },
        {
          path: '/register',
          element: <Register />,
        },
      ],
    },
    {
      path: "/user",
      element: <UserLayout />,
      children: [
        {
          index: true,
          element: <AccountManagement />,
        },
        {
          path: "info",
          element: <InfoUser />,
        },
        {
          path: "address",
          element: <Address />,
        },
        {
          path: "add-address",
          element: <AddAddress />,
        },
        {
          path: "manage-address",
          element: <AddressDefault />,
        },
        {
          path: "manage-order",
          element: <Order />,
        },
        {
          path: "change-password",
          element: <ChangePassword />,
        },
      ],
    },
    {
      path: '*',
      element: <h1>404 Not Found</h1>
    }
  ]);

  return routing;
};

export default Routers;
