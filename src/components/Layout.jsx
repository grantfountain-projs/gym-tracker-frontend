import { useState } from 'react';
import NavWheel from './NavWheel';

function Layout({ children }) {
    const [wheelOpen, setWheelOpen] = useState(false);

    return (
        <div className="min-h-screen bg-black">
            <div className={`transition-all duration-300 ${wheelOpen ? 'blur-sm brightness-50' : ''}`}>
                {children}
            </div>
            <NavWheel onOpenChange={setWheelOpen} />
        </div>
    );
}

export default Layout;