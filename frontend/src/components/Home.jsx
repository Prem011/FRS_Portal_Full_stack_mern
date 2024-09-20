import React, { useState, useEffect } from 'react';
import Head from './Head';
import axios from 'axios';
import { toast } from 'react-toastify';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [friendRecommendations, setFriendRecommendations] = useState([]); 
  const [hoveredFriend, setHoveredFriend] = useState(null); // For hover effects on recommendations
  const [ currentFriendRequestStatus ,setcurrentFriendReqStatus] = useState("")

  // Unfriend a friend
  const handleUnfriend = async (friendId) => {
    try {
      const response = await axios.delete(`/api/friend/friends/unfriend/${friendId}`);
      if (response.status === 200) {
        toast.success('Friend removed successfully:', response.data);
        setFriends(friends.filter(friend => friend._id !== friendId));
        // window.location.reload();
        setTimeout(() => {
          window.location.reload();
        }, 3000)
      } else {
        toast.error('Error removing friend:', response.data.message);
      }
    } catch (error) {
      toast.error('Error removing friend:', error);
    }
  };

  useEffect((e) => {
    // e.preventDefault();

    const fetchData = async () => {
      try {
        const usersResponse = await axios.get('/api/user/users');
        const usersData = usersResponse.data.users;
        setUsers(Array.isArray(usersData) ? usersData : []);
        
        const friendsResponse = await axios.get('/api/friend/friends');
        const friendsData = friendsResponse.data;
        const uniqueFriends = friendsData.filter((friend, index, self) =>
          index === self.findIndex(f => f._id === friend._id)
        );
        setFriends(uniqueFriends);
        
        // Fetch friend recommendations
        const recommendationsResponse = await axios.get('/api/friend/friends/recommendations');
        const recommendationsData = recommendationsResponse.data;
        setFriendRecommendations(Array.isArray(recommendationsData) ? recommendationsData : []);
      } catch (error) {
        toast.error('Error fetching data:', error);
      }
    };

    if(currentFriendRequestStatus === "pending") {

    }
    
    fetchData();
  }, []);

 

  const handleAddFriend = async (friendId) => {
    try {
      const response = await axios.post(`/api/friend/add/${friendId}`);
      console.log(response.data.currentFriendRequestStatus);
      
      if (response.status === 200) {
        toast.success('Friend request sent successfully');
        setPendingRequests([...pendingRequests, friendId]);
        setShowModal(true);
        setTimeout(() => setShowModal(false), 3000);
      } else {
        toast.error('Error sending friend request:', response.data.message);
      }
      console.log(response.data.currentFriendRequestStatus)
      
      setcurrentFriendReqStatus(response.data.currentFriendRequestStatus);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
    } else {
        toast.error('Server error while sending the request.');
    }
    }
  };

  const isPending = (userId) => pendingRequests.includes(userId);
  
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-screen h-full min-h-screen  bg-gray-900 text-white flex flex-col items-center">
      <Head />
      <main className="flex-1 w-[45%] max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="w-full space-y-8">

          {/* Search Bar */}
          <div className="w-full max-w-md mx-auto">
            <input
                type="text"
                value={search}
                onChange={handleSearch}
                className="w-full bg-gray-700 text-white rounded-lg p-3 outline-none"
                placeholder="Search users..."
            />
            </div>
          

          {/* Friend Recommendations */}
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-4">Friend Recommendations</h2>
            {friendRecommendations.length === 0 ? (
              <div>
                <p>No friend recommendations at the moment.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {friendRecommendations.map(recommendation => (
                  <li
                    key={recommendation._id}
                    className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center"
                  >
                    <span className="text-lg">{recommendation.username}</span>
                    {isPending(recommendation._id) ? (
                      <div className="relative">
                        <button
                          className="bg-yellow-500 text-white py-1 px-3 rounded-lg cursor-default"
                          onMouseEnter={() => setHoveredFriend(recommendation._id)}
                          onMouseLeave={() => setHoveredFriend(null)}
                        >
                          Pending
                        </button>

                        {hoveredFriend === recommendation._id && (
                          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white p-2 rounded-lg shadow-lg">
                            Friend request sent successfully!
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 mt-4 sm:mt-0"
                        onClick={() => handleAddFriend(recommendation._id)}
                      >
                        Add Friend
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Users List */}
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-4">Users</h2>
            {filteredUsers.length === 0 ? (
              <div>
                <p>No users are available right now.</p>
              </div>
             ) : ( 
              <ul className="space-y-4">
                {users.map(user => (
                  <li
                    key={user._id}
                    className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center"
                  >
                    <span className="text-lg">{user.username}</span>
                    <div className="flex space-x-10 mt-4 sm:mt-0">
                      {isPending(user._id) ? (
                        <div className="relative">
                          <button
                            className="bg-gray-500 text-white py-1 px-3 rounded-lg"
                            disabled
                          >
                            Pending
                          </button>
                          {showModal && (
                            <div className="absolute bg-gray-700 text-white p-2 rounded-lg shadow-lg top-10">
                              Friend request sent successfully!
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600"
                          onClick={() => handleAddFriend(user._id)}
                        >
                          Add Friend
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
             )}
          </div>

          {/* Friends List */}
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-4">Friends</h2>
            {friends.length === 0 ? (
              <div>
                <p>You currently have no friends added.</p>
                <p>Send requests to users to make friends and enjoy wonderful conversations!</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {friends.map(friend => (
                  <li
                    key={friend._id}
                    className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center"
                  >
                    <span className="text-lg">{friend.username}</span>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 mt-4 sm:mt-0"
                      onClick={() => handleUnfriend(friend._id)}
                    >
                      Unfriend
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>









        </div>
      </main>
    </div>
  );
};

export default Home;
