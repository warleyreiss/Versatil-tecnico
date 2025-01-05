
//import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom'

//COMPONENTES DA PAGINA
import SideBar from '../components/layout/sidebar/SideBar'
//PAGINAS

import Index from '../components/pages/servicos/index'

import { AuthProvider } from '../context/AuthContext';
import { PrivateRoute } from '../components/layout/sidebar/privateRoutes'


export const AppRouter = () => {
  return (
    <Router>
      <SideBar />
      <Routes>
        <Route exact path="/" element={<PrivateRoute />} >
          <Route path="/" element={<Index/>} />
        </Route>
      </Routes >
    </Router >
  );
};
