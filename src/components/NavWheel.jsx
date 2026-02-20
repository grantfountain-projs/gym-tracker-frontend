import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/5GFLogo.png';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
    { label: 'Home', path: '/dashboard', icon: '🏠' },
    { label: 'History', path: '/history', icon: '📋' },
    { label: 'Exercises', path: '/exercises', icon: '💪' },
    { label: 'Stats', path: '/stats', icon: '📊' },
    { label: 'Profile', path: '/profile', icon: '👤' },
    { label: 'Settings', path: '/settings', icon: '⚙️' },
    { label: 'Logout', path: '/logout', icon: '🚪' },
];

function NavWheel({ onOpenChange }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const toggleOpen = () => {
        const newState = !open;
        setOpen(newState);
        onOpenChange(newState);
    };

    const { logout } = useAuth();

    const handleNavigate = (path) => {
        setOpen(false);
        onOpenChange(false);
        if (path === '/logout') {
            logout();
            navigate('/login');
            return;
        }
        navigate(path);
    };

    const getItemStyle = (index, total) => {
        const angle = (index / (total - 1)) * 180 + 180;
        const radius = 160;
        const radian = (angle * Math.PI) / 180;
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;
        return {
            transform: open ? `translate(calc(${x}px - 50%), calc(${y}px - 50%)) scale(1)` : 'translate(-50%, -50%) scale(0)',
            opacity: open ? 1 : 0,
            transition: `transform 0.3s ease ${index * 0.05}s, opacity 0.3s ease ${index * 0.05}s`,
        };
    };

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
            {/* Wheel items */}
            {NAV_ITEMS.map((item, index) => (
                <div
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className="absolute flex flex-col items-center cursor-pointer"
                    style={{
                        ...getItemStyle(index, NAV_ITEMS.length),
                        left: '50%',
                        top: '50%',
                    }}
                >
                    <div className="w-12 h-12 bg-gray-800 border border-red-600 rounded-full flex items-center justify-center text-xl shadow-lg">
                        {item.icon}
                    </div>
                    <span className="text-white text-xs mt-1 font-medium whitespace-nowrap">
                        {item.label}
                    </span>
                </div>
            ))}

            {/* Center logo button */}
            <div
                onClick={toggleOpen}
                className={`w-16 h-16 rounded-full border-2 ${open ? 'border-red-600' : 'border-gray-600'} bg-black flex items-center justify-center cursor-pointer shadow-xl transition-all duration-300`}
            >
                <img src={logo} alt="5G Fitness" className="w-12 h-12 rounded-full" />
            </div>

            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 -z-10"
                    onClick={() => { setOpen(false); onOpenChange(false); }}
                />
            )}
        </div>
    );
}

export default NavWheel;