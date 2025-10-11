import PrivateRoute from "../components/PrivateRoute";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import CartPage from "../pages/CartPage.jsx";
import GalleryPage from "../pages/GalleryPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProductPage from "../pages/ProductPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import ProfilePage from "../pages/ProfilePage";

const routes = [
  { path: "/", element: <HomePage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/gallery", element: <GalleryPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/product", element: <ProductPage /> },
  { path: "/product/:id", element: <ProductDetailPage /> },
  { path: "/profile",
    element: (
      <PrivateRoute>
        <ProfilePage />
      </PrivateRoute>
    )
  },
];

export default routes;