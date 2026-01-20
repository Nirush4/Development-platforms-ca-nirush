import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ScrollToTop } from './utils/ScrollToTop';

// Views
import { Home } from './view/Home';
import { Login } from './view/Login';
import { Register } from './view/Register';
import { CreateArticle } from './view/CreateArticle';
import { EditArticle } from './view/EditArticle';
import { SingleArticle } from './view/SingleArticle';
import { Footer } from './components/Footer';

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/articles/new' element={<CreateArticle />} />
          <Route path='/articles/:id/edit' element={<EditArticle />} />
          <Route path='/article/:id' element={<SingleArticle />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
