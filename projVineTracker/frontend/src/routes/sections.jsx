import { lazy, Suspense, useEffect, useState } from "react";
import { Outlet, Navigate, useRoutes, useLocation } from "react-router-dom";

import DashboardLayout from "src/layouts/dashboard";

export const IndexPage = lazy(() => import("src/pages/app"));
export const UserPage = lazy(() => import("src/pages/user"));
export const LoginPage = lazy(() => import("src/pages/login"));
export const VinesPage = lazy(() => import("src/pages/vines"));
export const VineDetailsPage = lazy(() => import("src/pages/vineDetails"));
export const Page404 = lazy(() => import("src/pages/page-not-found"));
export const RegisterPage = lazy(() => import("src/pages/register"));

import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
 const isLoggedIn = localStorage.getItem("user") !== null;
 const location = useLocation();

 if (!isLoggedIn) {
  return <Navigate to="/login" />;
 }
 return children;
};

ProtectedRoute.propTypes = {
 children: PropTypes.node,
};

const Routes = () => {
 const routes = useRoutes([
   {
     path: "/",
     element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Suspense>
              <Outlet />
          </Suspense>
        </DashboardLayout>
       </ProtectedRoute>
     ),
    children: [
      { element: <IndexPage />, index: true },
      // { path: "user", element: <UserPage /> },
      { path: "vines", element: <VinesPage /> },
      { path: "vineDetails/:id", element: <VineDetailsPage /> },
    ],
    },
   {
     path: "login",
     element: <LoginPage />,
   },
   {
     path: "404",
     element: <Page404 />,
   },
   {
     path: "*",
     element: <Navigate to="/404" replace />,
   },
   {
    path: "register",
    element: <RegisterPage />,
   },
 ]);

 return routes;
}

export default Routes;
