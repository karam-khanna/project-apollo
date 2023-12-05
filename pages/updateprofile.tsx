import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { updateUserFirstName, updateUserLastName, updateUserAge, updateUserPicture, updateUserPoker, updateUserBasketball } from "@/utils/client_side/clientDbInterface";
import {useRouter} from 'next/router';

const ProfileModificationPage: React.FC = () => {
    const { user, setUser } = useContext(UserContext);
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: user ? user.firstName : '',
        lastName: user ? user.lastName : '',
        age: user ? user.age : '',
        picture: user ? user.picture : '',
    });

    //populate user interest options and show current selections
    const [prevInterests, setPrevInterests] = useState(() => {
        const interests = [];
        if (user?.poker) {
            interests.push('Poker');
        }
        if (user?.basketball) {
            interests.push('Basketball');
        }
        return interests;
    });



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Function to handle changes in checkboxes
    const handleCheckboxChange = (interest: any, isChecked: any) => {
        if (isChecked) {
            // If checked, add the interest to prevInterests
            setPrevInterests((prevInterests: any) => [...prevInterests, interest]);
        } else {
            // If unchecked, remove the interest from prevInterests
            setPrevInterests((prevInterests: any) => prevInterests.filter((item: any) => item !== interest));
        }
    };


    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                const result = e.target?.result as string | null;
                if (result) {
                    setFormData({
                        ...formData,
                        picture: result,
                    });
                }
            };

            reader.readAsDataURL(file);
        }
    };



    const saveChanges = async () => {
        if (user) {
            const updatePromises = [
                updateUserFirstName(user, formData.firstName, setUser),
                updateUserLastName(user, formData.lastName, setUser),
                updateUserAge(user, parseInt(formData.age, 10), setUser),
                updateUserPicture(user, formData.picture, setUser),
            ];
    
            const updatedUser = { ...user }; // Create a copy of the user object

            updatedUser.firstName = formData.firstName;
            updatedUser.lastName = formData.lastName;
            updatedUser.age = formData.age.toString();
            updatedUser.picture = formData.picture;
    
            if (prevInterests.includes('Poker')) {
                await updateUserPoker(updatedUser, true, (updated) => setUser(updated));
                updatedUser.poker = true; // Update local user object
            } else {
                await updateUserPoker(updatedUser, false, (updated) => setUser(updated));
                updatedUser.poker = false; // Update local user object
            }
    
            if (prevInterests.includes('Basketball')) {
                await updateUserBasketball(updatedUser, true, (updated) => setUser(updated));
                updatedUser.basketball = true; // Update local user object
            } else {
                await updateUserBasketball(updatedUser, false, (updated) => setUser(updated));
                updatedUser.basketball = false; // Update local user object
            }
    
            // Update the user context/state with the modified interests
            setUser(updatedUser);
    
            // All updates are complete
            router.push('/profile');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center pt-16 gap-10">

            <div className="container mx-auto px-4 pt-16 w-2/3 mb-10">
                <div className="rounded-lg p-8" style={{ backgroundColor: 'rgba(218, 150, 148, 0.5)' }}>
                    <h1 className="text-6xl font-bold text-center"> Mutuals.</h1>

                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className='mb-5'></div>
                        <div className="flex items-center justify-center">
                            <Avatar>
                                <div style={{ width: '100px', height: '100px' }}>
                                    <AvatarImage src={formData.picture} /> {/* Use the picture URL from the formData */}
                                </div>
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            name="picture"
                            onChange={handlePictureChange}
                        />
                        <div className='mb-4'></div>

                        <div className="bg-black p-2 text-white rounded-xl w-64 h-16 text-center">
                        <div className="text-xs text-pink">Interests:</div>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', alignItems: 'center' }}>
                            <label style={{ marginRight: '20px' , marginLeft: '20px'}}>
                                Basketball:
                                <input
                                type="checkbox"
                                name="basketball"
                                checked={prevInterests.includes('Basketball')}
                                onChange={(e) => handleCheckboxChange('Basketball', e.target.checked)}
                                />
                            </label>
                            <br />
                            <label>
                                Poker:
                                <input
                                type="checkbox"
                                name="poker"
                                checked={prevInterests.includes('Poker')}
                                onChange={(e) => handleCheckboxChange('Poker', e.target.checked)}
                                />
                            </label>
                        </div></div>

                        <div className="bg-black p-2 text-white rounded-xl w-64 h-16 text-center">
                            <div className="text-xs text-pink">First Name:</div>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className='bg-black text-center'
                            />
                        </div>
                        <div className="bg-black p-2 text-white rounded-xl w-64 h-16 text-center">
                            <div className="text-xs text-pink">Last Name:</div>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className='bg-black text-center'
                            />
                        </div>
                        <div className="bg-black p-2 text-white rounded-xl w-64 h-16 text-center">
                            <div className="text-xs text-pink">Age:</div>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                className='bg-black text-center'
                            />
                        </div>
                        <Button onClick={saveChanges}>Save Changes</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModificationPage;
