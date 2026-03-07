import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { changePassword, deleteUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [deleteError, setDeleteError] = useState('');

    const handleChangePassword = async () => {
        setPasswordError('');
        setPasswordSuccess('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('All fields are required');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            return;
        }

        try {
            await changePassword(token, currentPassword, newPassword);
            setPasswordSuccess('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setPasswordError(error.message);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') {
            setDeleteError('Please type DELETE to confirm');
            return;
        }
        try {
            await deleteUser(token);
            logout();
            navigate('/login');
        } catch (error) {
            setDeleteError(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pb-32">
            <header className="bg-black border-b border-gray-800 px-4 py-6 text-center">
                <h1 className="text-2xl font-bold text-white tracking-widest">PROFILE</h1>
            </header>

            <main className="flex flex-col items-center px-4 pt-8 space-y-6 max-w-md mx-auto">

                {/* Account Info */}
                <div className="w-full bg-black border border-gray-800 rounded-xl p-5">
                    <p className="text-gray-500 text-xs mb-1">Email</p>
                    <p className="text-white font-medium">{user?.email}</p>
                </div>

                {/* Change Password */}
                <div className="w-full bg-black border border-gray-800 rounded-xl p-5 space-y-3">
                    <h2 className="text-white font-semibold text-sm">Change Password</h2>
                    <input
                        type="password"
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
                    {passwordSuccess && <p className="text-green-500 text-xs">{passwordSuccess}</p>}
                    <button
                        onClick={handleChangePassword}
                        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200"
                    >
                        Update Password
                    </button>
                </div>

                {/* Delete Account */}
                <div className="w-full bg-black border border-red-900 rounded-xl p-5 space-y-3">
                    <h2 className="text-red-500 font-semibold text-sm">Danger Zone</h2>
                    <p className="text-gray-400 text-xs">Deleting your account is permanent and cannot be undone. All your workout data will be lost.</p>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full py-2 bg-black border border-red-600 hover:bg-red-600/10 text-red-500 font-semibold rounded-lg transition duration-200"
                    >
                        Delete Account
                    </button>
                </div>

            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
                    <div className="bg-black border border-red-600 rounded-xl p-6 w-full max-w-sm space-y-4">
                        <h2 className="text-white text-xl font-bold text-center">Delete Account</h2>
                        <p className="text-gray-400 text-sm text-center">This cannot be undone. Type <span className="text-red-500 font-bold">DELETE</span> to confirm.</p>
                        <input
                            type="text"
                            placeholder="Type DELETE to confirm"
                            value={deleteConfirmText}
                            onChange={(e) => {
                                setDeleteConfirmText(e.target.value);
                                setDeleteError('');
                            }}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        {deleteError && <p className="text-red-500 text-xs text-center">{deleteError}</p>}
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirmText('');
                                    setDeleteError('');
                                }}
                                className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;