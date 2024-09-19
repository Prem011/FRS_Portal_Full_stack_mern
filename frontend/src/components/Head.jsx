import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import axios from 'axios';
import { FaUserFriends } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from 'react-toastify';

const Head = () => {
  const { logout } = useAuth(); 
  const navigate = useNavigate(); 
  const [username, setUsername] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);


  // localhost:5001/friend/friends/getFriendRequests

  

  const handleDecline = async (requestId) => {
    await axios.post(`/api/friend/declineFriendReq/${requestId}`);
    setFriendRequests(friendRequests.filter(req => req.id !== requestId));
    toast.error("Successfully declined Friend Request")
    setTimeout(() => {
      window.location.reload(); // Reload the page (if needed)
      
    }, 1500);
  };

  
  useEffect(() => {
    // Fetch notifications (mock data for example)
    setNotifications([
      // { id: 1, message: 'Friend request from John Doe' },
      { id: 2, message: 'Message from Jane Smith' },
      // { id: 3, message: 'Reminder: Upcoming event' }
    ]);

    const userData = localStorage.getItem('FRS');
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user?.username || "User : User");
    }

    const fetchFriendRequests = async () => {
      const response = await axios.get('/api/friend/friends/getFriendRequests');
      
      setFriendRequests(response.data);
    }
    
    fetchFriendRequests();

  }, [])

  const handleAccept = async (requestId) => {
    await axios.post(`/api/friend/acceptFriendREq/${requestId}`);
    setFriendRequests(friendRequests.filter(req => req.id !== requestId));
    setFriends([...friends, { id: requestId }]); // Update friends list
    toast.success("New friend Added");
    setTimeout(() => {
      window.location.reload(); // Reload the page (if needed)
      
    }, 1500);
  };

  
 
 

  const handleLogout = async () => {
    try {
      await axios.post('/api/user/logout');
      logout(); 
      navigate('/login'); 
    } catch (error) {
      toast.error('Logout error:', error);
    }
  };

  return (
    <header className="w-full bg-gray-800 text-white px-4 py-2 md:px-8 flex items-center justify-between">
      {/* Logo and app name */}
      
      <div className="w-[80%] flex items-center space-x-6">
        <div className="w-full flex items-center space-x-4">
          <Link 
        to={"/"} 
        className='w-[full] px-3 sm:w-[20%] md:w-[15%] lg:w-[9%] h-[80%] flex justify-center items-center bg-slate-300 p-2 sm:p-3 md:p-4 rounded-es-3xl rounded-ee-3xl rounded-se-3xl shadow-lg shadow-zinc-700/200'>
        
        <img 
          width="30" 
          height="30" 
          className='w-[35px] h-[25px] sm:w-[30px] sm:h-[30px] md:w-[35px] md:h-[35px] lg:w-[40px] lg:h-[40px]' 
          src="https://img.icons8.com/?size=100&id=7859&format=png&color=1A1A1A" 
          alt="Logo" 
        />
        
        <p className='text-xs sm:text-sm md:text-base lg:text-sm font-semibold text-black px-2 pb-1'>
          Let's Connect
        </p>
      </Link>


    
      
          {friendRequests.length === 0 ? (
            <div className="flex flex-col items-center">
              <FaUserFriends size={40} />
              <p className="text-sm text-gray-300">No Requests</p>
            </div>
          ) : (
            <div className="relative" onMouseEnter={() => setModalOpen(true)} onClick={() => setModalOpen(false)}>
              <div className="flex flex-col items-center">
                <FaUserFriends size={40} />
                <h1 className="text-lg text-white">New Request!</h1>
                
              </div>
      
              {isModalOpen && (
                <div className="absolute w-[22vw] max-h-[50vh] left-[-120%] top-[130%] bg-gray-700 rounded-lg shadow-lg p-4 z-20 overflow-y-scroll">
                 
                 <div className='flex justify-between mb-3' >
                  <h2 className="text-lg text-white">Pending Requests</h2>
                  <img className='w-[6%] h-[3%] cursor-pointer ' onClick={() => setModalOpen(false)} src="https://img.icons8.com/?size=100&id=83149&format=png&color=ffffff" alt="" />
                 </div>


                 {friendRequests.map((request) => (
                    <div 
                      key={request._id} // Use a unique identifier here
                      className="request-item flex items-center justify-between p-2 rounded-md bg-gray-900 text-gray-300 mb-2"
                    >
                      <div className='flex w-full h-full gap-2'> 
                        <img 
                          className='bg-red-600 rounded-full w-[8.5%]' 
                          src="" 
                          alt="" 
                        />
                        <p>
                          {request.sender.username}
                        </p>
                      </div>
                      
                      <div className='flex gap-2'>
                        <button onClick={() => handleAccept(request.sender._id)} className="bg-blue-500 p-1 rounded-md">
                          <FaCheck />
                        </button>
                        <button onClick={() => handleDecline(request.sender._id)} className="bg-red-500 p-1 rounded-md">
                          <IoCloseSharp />
                        </button>
                      </div>
                    </div>
                  ))}

                </div>
              )}
            </div>
          )}
      


        
      </div>
      </div>

      


      {/* Username and Notification Section */}
      <div className="flex w-[20%]  items-center space-x-6">
        <div className="flex w-full items-center space-x-4">
          <h1 className="text-lg md:text-xl">
            <img className="inline w-5 mr-2" src="https://img.icons8.com/material/24/40C057/sphere--v1.png" alt="" />
            {username}
          </h1>

          {/* Notification icon */}
          <div
            className="relative cursor-pointer"
           onMouseEnter={() => setShowNotifications(true)}
            onClick={() => setShowNotifications(false)}
          >
            <img
              className="w-6 h-6"
              src={notifications.length > 0
                ? "https://img.icons8.com/?size=100&id=40401&format=png&color=ffffff"
                : "https://img.icons8.com/?size=100&id=11642&format=png&color=ffffff"
              }
              alt="Notifications"
            />

            {/* Notification Modal */}
            {showNotifications && (
              <div className="absolute w-[20vw] right-0 mt-2  bg-gray-700 rounded-lg shadow-lg p-4 z-10">

                <div className='w-full flex justify-between' >
                  <h3 className="text-lg text-white mb-2">Notifications</h3>
                  <img onClick={() => setShowNotifications(false)} className='w-[5%] h-[7%] ' src="https://img.icons8.com/?size=100&id=83149&format=png&color=ffffff" alt="Close" />
                </div>
                <ul>
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <li key={notification.id} className="text-sm text-gray-300 mb-1">
                        {notification.message}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-300">No notifications</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-500 px-2 py-1 md:px-3 md:py-2 rounded-lg text-sm md:text-md"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Head;
