// src/App.js
import NavBar from './components/layout/NavBar';
import SideBar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import AppRoutes from './AppRoutes';
import './App.css';
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className='app-container'>
      <SideBar collapsed={true} />
      <div className='content'>
        <NavBar />
        <main>
          <Toaster position='top-right' toastOptions={{ maxVisible: 3 }} />
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
