import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import { Navbar } from './components/Navbar';
import { ScrollToTop } from './utils/ScrollToTop';
import { initCookieConsent } from './components/cookieConsentView';

import { Home } from './view/Home';
import { Login } from './view/Login';
import { Register } from './view/Register';
import { ForgotPassword } from './view/ForgotPassword';
import { UpdatePassword } from './view/UpdatePassword';
import { CreateArticle } from './view/CreateArticle';
import { EditArticle } from './view/EditArticle';
import { SingleArticle } from './view/SingleArticle';
import { MyArticles } from './view/MyArticles';
import { Footer } from './components/Footer';

const App = () => {
  useEffect(() => {
    initCookieConsent();
  }, []);

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={3000}
      style={{ marginTop: '4rem' }}
    >
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />{' '}
            {/* <-- Added route */}
            <Route path='/update-password' element={<UpdatePassword />} />{' '}
            {/* <-- Added route */}
            <Route path='/articles/new' element={<CreateArticle />} />
            <Route path='/articles/:id/edit' element={<EditArticle />} />
            <Route path='/article/:id' element={<SingleArticle />} />
            <Route path='/my-articles' element={<MyArticles />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </SnackbarProvider>
  );
};

export default App;
