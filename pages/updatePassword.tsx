import {useState} from 'react';
// import { auth } from "../components/firebase";
//
// export default function Settings (){
//     const [newPassword, setNewPassword] = useState('');
//     const [message, setMessage] = useState('');
//
//     const handleChange = async () => {
//         //use a try/catch in case of password change error
//         try {
//             const user = auth.currentUser;
//
//             if(user) { //check if user is signed in
//                 await user.updatePassword(newPassword);
//                 setMessage('Password updated successfully');
//             }
//             else{
//                 setMessage('No user is signed in')
//             }
//         }
//         catch (error) {
//             setMessage('Error changing password ' +error.message);
//         }
//     };
//
//     return (
//         <div className="flex flex-col items-center justify-center pt-16 gap-9">
//             <div className="container mx-auto px-4">
//                 <h1 className="text-4xl font-bold text-center mb-4">Change Password</h1>
//
//                 <form className="flex flex-col gap-2 mx-auto w-full md:w-96">
//
//                     <div className="mb-4">
//                         <input
//                             type="password"
//                             placeholder="New Password"
//                             value={newPassword}
//                             onChange={(e) => setNewPassword(e.target.value)}
//                             className="bg-black border rounded w-full p-2"
//                         />
//                     </div>
//                     <button onClick={handleChange}
//                         className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded w-full"
//                     >
//                         Reset Password
//                     </button>
//                 </form>
//
//                 {/* Message Styling */}
//                 {message && <div className="text-lg text-center mt-4 text-white">{message}</div>}
//             </div>
//         </div>
//     );
//
// }

// add default export
export default function UpdatePassword() {
    return (<h2>in prog</h2>)
}