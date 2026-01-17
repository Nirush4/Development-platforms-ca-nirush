import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './view/Home';
import { Login } from './view/Login';
import { Register } from './view/Register';
import { CreateArticle } from './view/CreateArticle';
import { EditArticle } from './view/EditArticle';
import supabase from './lib/supabaseClient';

import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<unknown>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to='/login' />;
  return children;
};

export const App = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route
        path='/create'
        element={
          <ProtectedRoute>
            <CreateArticle />
          </ProtectedRoute>
        }
      />
      <Route
        path='/edit/:id'
        element={
          <ProtectedRoute>
            <EditArticle />
          </ProtectedRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);
