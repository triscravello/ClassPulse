import { useContext } from "react";
import NavBar from './components/layout/NavBar';
import SideBar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import AppRoutes from './AppRoutes';
import './App.css';
import { UserContext } from "./context/UserContext";

function App() {
  const { user } = useContext(UserContext);

  const showLayout = !!user; // Only show sidebar/navbar/footer if logged in

  return (
    <div className='app-container'>
      {showLayout && <SideBar collapsed={true} />}

      <div className='content'>
        {showLayout && <NavBar />}
        <main>
          <AppRoutes />
        </main>
        {showLayout && <Footer />}
      </div>
    </div>
  );
}

export default App;
