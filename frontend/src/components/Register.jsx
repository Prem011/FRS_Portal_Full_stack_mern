import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { toast } from 'react-toastify';
import axios from 'axios';

const Register = () => {
    const { login } = useAuth();
    const navigate = useNavigate(); 

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const userInfo = {
            username: data.username,
            email: data.email,
            password: data.password
        };

        try {
            const response = await axios.post('/api/user/register', userInfo);

            if (response.status === 200) {
                toast.success('Signup successful');
                const user = response.data;
                localStorage.setItem('FRS', JSON.stringify(user));
                login(user); // Call login function from context
                navigate('/login');
            } else {
                toast.error('Registration failed');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error('Error: ' + error.response.data.error);
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };

    return (
        <div className='w-screen h-screen rounded-md text-white flex justify-center items-center px-6 py-4 bg-zinc-900'>
            <form onSubmit={handleSubmit(onSubmit)} className='w-[min-30%] drop-shadow-2xl my-2 px-10 py-8 rounded-md border border-spacing-3'>
                <h1 className='text-sky-400 text-2xl text-center flex justify-center items-center'>
                    <img  className='inline w-[15%]' src="https://img.icons8.com/?size=100&id=21634&format=png&color=000000" alt="" />
                    <span className='text-2xl mr-2'>Let's </span> <span>Connect</span> 
                </h1>
                <h2 className='text-center text-xl py-4'>Accout Creation Form</h2>

                <label className="input input-bordered flex items-center gap-2 mt-5 mb-1">
                    <input
                        type="text"
                        className="grow text-white bg-zinc-700 rounded-lg p-2 outline-none"
                        placeholder="Username"
                        {...register("username", { required: true })}
                    />
                </label>
                    {errors.username && <span className="text-red-500 text-sm">Username is required</span>}
                <br />

                <label className="input input-bordered flex items-center gap-2 mb-1">
                    <input
                        type="email"
                        className="grow text-white bg-zinc-700 rounded-lg p-2 outline-none"
                        placeholder="Email Address"
                        {...register("email", { required: true })}
                    />
                </label>
                    {errors.email && <span className="text-red-500 text-sm">Email is required</span>}
                <br />

                <label className="input input-bordered flex items-center gap-2 mb-1">
                    <input
                        type="password"
                        className="grow text-white bg-zinc-700 rounded-lg p-2 outline-none"
                        placeholder="Password"
                        {...register("password", { required: true })}
                    />
                </label>
                    {errors.password && <span className="text-red-500 text-sm">Password is required</span>}
                <br />

                <div className='flex justify-center items-center gap-5'>
                    <Link to="/login">Already have an account? <span className='text-blue-500' >Login</span></Link>
                    <button
                        type="submit"
                        className='w-40 h-10 text-white rounded-md bg-white text-black hover:bg-zinc-300 border-0 p-2'
                    >
                        Create Account
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register;
