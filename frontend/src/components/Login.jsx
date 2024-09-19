import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from "js-cookie"

const Login = () => {
    const { setAuthUser, login } = useAuth();  // Destructure login from useAuth
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const userInfo = {
            username: data.username,
            password: data.password
        };

        try {
            const response = await axios.post('/api/user/login', userInfo, {
                withCredentials: true, // Include cookies if needed
            });

            if (response.status === 200) {
                toast.success('Login successful');
                localStorage.setItem('FRS', JSON.stringify(response.data.user.username));
                const user = response.data.user;
                login(user); 
                // setAuthUser(response.data.user);
                // console.log(response.data.user); 

            } else {
                toast.error('Unexpected response from the server');
                console.log('Unexpected response from the server');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data && error.response.data.error) {
                    toast.error(`Error: ${error.response.data.error}`);
                } else {
                    toast.error('Server error occurred. Please try again.');
                }
            } else if (error.request) {
                toast.error('No response received from server. Please try again.');
            } else {
                toast.error("error occurred");
                console.log(error);
            }
        }
    };

    return (
        <div className='w-screen h-screen rounded-md text-white flex justify-center items-center px-6 py-4 bg-zinc-900'>
            <form onSubmit={handleSubmit(onSubmit)} className=' w-min-[30%] my-2 px-10 py-8 rounded-md border border-spacing-3'>
            <h1 className='text-sky-400 text-2xl text-center flex justify-center items-center'>
                    <img  className='inline w-[15%]' src="https://img.icons8.com/?size=100&id=21634&format=png&color=000000" alt="" />
                    <span className='text-2xl mr-2'>Let's </span> <span>Connect</span> 
                </h1>
                <h2 className='text-center text-xl py-4'>User Login</h2>

                <label className="input input-bordered flex items-center gap-2 mt-5 py-0.5">
                    <input
                        type="text"
                        className="grow  text-white bg-zinc-700 rounded-lg p-2 outline-none"
                        placeholder="Username"
                        {...register("username", { required: true })}
                    />
                </label>
                {errors.username && <span className="text-red-500 text-sm">Username is required</span>}

                <label className="input input-bordered flex items-center gap-2 mt-4 py-0.5">
                    <input
                        type="password"
                        className="grow text-white bg-zinc-700 rounded-lg p-2 outline-none"
                        placeholder="Password"
                        {...register("password", { required: true })}
                    />
                </label>
                {errors.password && <span className="text-red-500 text-sm">Password is required</span>}

                <div className='flex justify-center items-center gap-5 mt-6'>
                    <Link to="/register">Doesn't have an Account? <br /><span className='text-blue-500' >Create New Account...</span></Link>
                    <button
                        type="submit"
                        className='w-20 h-10 text-white rounded-md bg-white text-black hover:bg-zinc-300 border-0 p-2'
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
