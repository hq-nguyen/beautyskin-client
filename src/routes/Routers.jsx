import { useRoutes } from "react-router-dom";
import Home from '../pages/Home';
import Shop from '../pages/Shop/Shop';
import About from '../pages/About/About';
import Blog from '../pages/Blog/Blog';
import News from '../pages/News/News';
import TestSkinType from '../pages/TestSkinType/TestSkinType';
import Register from '../pages/Register/Register';
import Login from '../pages/Login/Login';
import AccountManagement from '../pages/ManageAccount/AccountManagement';
import InfoUser from '../pages/InfoUser/InfoUser';
import Order from '../pages/ManageOrder';
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
import Promotion from "../pages/PromotionManagement/promotion";
import ShoppingCart from "../pages/ShoppingCart/Cart";
import BlogDetail from "../pages/Blog/BlogDetail";
import CheckoutPage from "../pages/Checkout/checkout";
import Address from "../pages/Address/ShippingAddress/Address";
import AddAddress from "../pages/Address/AddressForm/AddressForm";
import AddressDefault from "../pages/Address/AddressManagement";
import NotFoundPage from "../pages/NotFound/NotFoundPage";
import ManageBlog from "../pages/Admin/ManageBlog/ManageBlog";
import ManageQuiz from "../pages/Admin/ManageQuiz/ManageQuiz";
import SupportLayout from "../layout/SupportLayout";
import TermsOfUsePage from "../components/Support/Term";
import PrivacyPolicyPage from "../components/Support/Privacy";
import PaymentPage from "../components/Support/Payment";
import RefundPage from "../components/Support/Refund";
import ProductAttributeManagement from "../pages/Admin/ManageAttribute/ManageAttribute";
import CheckoutLayout from "../layout/CheckoutLayout";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../pages/Unauthorized/Unauthorized";
import ProductDetail from "../components/ProductDetail/ProductDetail";
import ManagePromotion from "../pages/Admin/ManagePromotion/ManagePromotion";
import CODPage from "../pages/CheckoutConfirm";
import Transfer from "../components/Payment/Transfer/Tranfer";

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
          path: '/product/:id',
          element: <ProductDetail />,
        },
        {
          path: '/blog',
          element: <Blog />,
        },
        {
          path: '/blog/:slug',
          element: <BlogDetail />,
        },
        {
          path: '/news',
          element: <News />,
        },
        {
          path: '/test-skin',
          element: <TestSkinType />,
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
        {
          path: '*',
          element: <NotFoundPage />,
        }
      ],
    },
    {
      path: "/user",
      element: (
        <ProtectedRoute allowedRoles={["USER", "MANAGER", "STAFF"]}>
          <UserLayout />
        </ProtectedRoute>
      ),
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
          path: "promotion",
          element: <Promotion />,
        }

      ],
    },
    {
      path: "/checkout",
      element: <CheckoutLayout />,
      children: [
        {
          path: "cart",   
          element: <ShoppingCart />,
        },
        {
          index: true,   
          element: <CheckoutPage />,
        },
        {
          path: "confirmCOD",   
          element: <CODPage />,
        },
      ],
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute allowedRoles={["MANAGER"]}>
          <AdminLayout />
        </ProtectedRoute>
      ),
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
          element: <ProductAttributeManagement />,
        },
        {
          path: "promotion",
          element: <ManagePromotion />,
        },
        {
          path: "blog",
          element: <ManageBlog />,
        },
        {
          path: "quiz",
          element: <ManageQuiz />,
        }

      ],
    },
    {
      path: "/support",
      element: <SupportLayout />,
      children: [
        {
          index: true,
          element: <TermsOfUsePage />,
        },
        {
          path: "privacy",
          element: <PrivacyPolicyPage />,
        },
        {
          path: "payment",
          element: <PaymentPage />,
        },
        {
          path: "refund",
          element: <RefundPage />,
        },
      ],
    },
    {
      path: "/unauthorized",
      element: <Unauthorized />,
    },
  ]);

  return routing;
};

export default Routers;