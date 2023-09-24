import { useState } from 'react';
import { auth } from "../components/firebase";

export default function Settings (){
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = async () => {
        //use a try/catch in case of password change error
        try {
            const user = auth.currentUser;

            if(user) { //check if user is signed in
                await user.updatePassword(newPassword);
                setMessage('Password updated successfully');
            }
            else{
                setMessage('No user is signed in')
            }
        }
        catch (error) {
            setMessage('Error changing password ' +error.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-rose-700"> Change Password</h2>
          <div className="mb-4">
            <label className="block text-rose-700">Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-rose-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <button onClick={handleChange}
          className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded"
          >
              Change Password
          </button>
          {message && <p className="mt-2 text-rose-600">{message}</p>}
        </div>
      );

}