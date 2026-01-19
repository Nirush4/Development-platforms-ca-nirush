import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';

// Views
import { Home } from './view/Home';
import { Login } from './view/Login';
import { Register } from './view/Register';
import { CreateArticle } from './view/CreateArticle';
import { EditArticle } from './view/EditArticle';
import { Footer } from './components/Footer';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <main className=''>
        <Routes>
          {/* Public */}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* Authenticated */}
          <Route path='/articles/new' element={<CreateArticle />} />
          <Route path='/articles/:id/edit' element={<EditArticle />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
};

export default App;
