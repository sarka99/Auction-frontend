import React, { useEffect, useState } from "react";
import ApiService from "../services/ApiServices";
import useAuth from "../hooks/useAuth";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa"; // Importing the icons
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { keycloak } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        console.log(
          `The token of the person trying to fetch all users is: ${keycloak.token}`
        );
        const users = await ApiService.listAllUsers(keycloak.token);
        setUsers(users);
        console.log(`Users fetched : ${users}`);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);


  const handleViewAuctions = (userId) =>{
    navigate(`/my-auctions/${userId}`);  // Navigate to the MyAuctions page with the userId

  }
  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6">Users List</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Username
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                First Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Last Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Active
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Roles
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{user.username}</td>
                <td className="px-6 py-4">{user.firstName}</td>
                <td className="px-6 py-4">{user.lastName}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  {user.active ? "Active" : "Inactive"}
                </td>
                <td className="px-6 py-4">
                  <ul>
                    {user.roles.map((role, index) => (
                      <li key={index}>{role === "admin" ? "Admin" : "User"}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-6">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(user.id)}
                      className="text-gray-600  hover:text-gray-900 hover:scale-125 focus:outline-none transition duration-200"
                    >
                      <FaEdit size={20} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-gray-600  hover:text-gray-900 hover:scale-125 focus:outline-none transition duration-200"
                    >
                      <FaTrashAlt size={20} />
                    </button>

                    {/* View Auctions Button */}
                    <button
                      onClick={() => handleViewAuctions(user.id)}
                      className="text-gray-600  hover:text-gray-900 hover:scale-125 focus:outline-none transition duration-200"
                    >
                      <FaEye size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default UsersList;
