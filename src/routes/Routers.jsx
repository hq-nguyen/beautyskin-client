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
import ForgotPassword from "../pages/ForgotPassword";
// admin section
import AdminLayout from "../layout/AdminLayout";
import AddProductPage from "../pages/Admin/ManageProduct/AddProduct";
import ManageProduct from "../pages/Admin/ManageProduct/ManageProduct";
import ManageStaff from "../pages/Admin/ManageStaff/ManageStaff";
import AddStaff from "../pages/Admin/ManageStaff/AddStaff";
import ManageCustomer from "../pages/Admin/ManageCustomer/ManageCustomer";
import ManageOrder from "../pages/Admin/ManageOrder/ManageOrder";
import ManageCategory from "../pages/Admin/ManageCategory/ManageCategory";
import AddCategory from "../pages/Admin/ManageCategory/AddCategory";

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
          path: "/forgot-password",
          element: <ForgotPassword />,
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
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <ManageProduct />,
        },
        {
          path: 'list-products',
          element: <ManageProduct />,
        },
        {
          path: "add-product",
          element: <AddProductPage />,
        },
        {
          path: "staffs",
          element: <ManageStaff />,
        },
        {
          path: "add-staff",
          element: <AddStaff />,
        },
        {
          path: "customers",
          element: <ManageCustomer />,
        },
        {
          path: "orders",
          element: <ManageOrder />,
        },
        {
          path: "category",
          element: <ManageCategory />,
        },
        {
          path: "add-category",
          element: <AddCategory />,
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
