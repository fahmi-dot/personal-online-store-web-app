import PrivateRoute from "../components/PrivateRoute";
import AdminRoute from "../components/AdminRoute";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import CartPage from "../pages/CartPage.jsx";
import GalleryPage from "../pages/GalleryPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProductPage from "../pages/ProductPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import ProfilePage from "../pages/ProfilePage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";

const routes = [
  { path: "/", element: <HomePage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/gallery", element: <GalleryPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/product", element: <ProductPage /> },
  { path: "/product/:id", element: <ProductDetailPage /> },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <ProfilePage />
      </PrivateRoute>
    )
  },
  // Admin routes
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminDashboardPage />
      </AdminRoute>
    )
  },
  {
    path: "/admin/products",
    element: (
      <AdminRoute>
        <AdminProductsPage />
      </AdminRoute>
    )
  },
  {
    path: "/admin/categories",
    element: (
      <AdminRoute>
        <AdminCategoriesPage />
      </AdminRoute>
    )
  },
  {
    path: "/admin/orders",
    element: (
      <AdminRoute>
        <AdminOrdersPage />
      </AdminRoute>
    )
  },
  {
    path: "/admin/users",
    element: (
      <AdminRoute>
        <AdminUsersPage />
      </AdminRoute>
    )
  },
];

export default routes;