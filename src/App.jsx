import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ToastContainer from './components/ToastContainer';
import routes from "./routes/AppRoutes";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Layout>
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;