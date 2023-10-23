import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { updateUserFirstName, updateUserLastName, updateUserAge, updateUserPicture } from "@/utils/client_side/clientDbInterface";
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData({
                    ...formData,
                    picture: e.target.result as string,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const saveChanges = async () => {
        if (user) {
            await updateUserFirstName(user, formData.firstName, setUser);
            await updateUserLastName(user, formData.lastName, setUser);
            await updateUserAge(user, parseInt(formData.age, 10), setUser);
            await updateUserPicture(user, formData.picture, setUser);

            router.push('/profile')
        }
    };

    return (
        <div className="flex flex-col items-center justify-center pt-16 gap-10">
            <div className="container mx-auto px-4 pt-16">
                <div className="bg-gray-800 rounded-lg p-8">
                    <h1 className="text-6xl font-bold text-center"> Mutuals.</h1>

                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className='mb-5'></div>
                        <div className="flex items-center">
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
