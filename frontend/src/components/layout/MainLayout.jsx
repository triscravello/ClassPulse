import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import SideBar from './Sidebar';
import Footer from './Footer';

function MainLayout() {
    return (
        <div className='app-container flex min-h-screen'>
            <SideBar />
            <div className='flex-1 flex flex-col'>
                <NavBar />
                <main className='p-4 flex-1 overflow-y-auto'>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default MainLayout;