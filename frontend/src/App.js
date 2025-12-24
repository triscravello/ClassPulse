// src/App.js
import NavBar from './components/layout/NavBar';
import SideBar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import AppRoutes from './AppRoutes';
import './App.css';

function App() {
  return (
    <div className='app-container'>
      <SideBar collapsed={true} />
      <div className='content'>
        <NavBar />
        <main>
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
