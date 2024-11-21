import React, { useEffect, useState } from "react";
import ApiService from "../services/ApiServices";
import useAuth from "../hooks/useAuth";

function UsersList(){
    const [users,setUsers] = useState([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);
    const {keycloak} = useAuth();
    useEffect(()=>{
        const fetchUsers = async () =>{
            try{
                setLoading(true);
                console.log(`The token of the person trying to fetch all users is: ${keycloak.token}`)
                const users = await ApiService.listAllUsers(keycloak.token);
                setUsers(users);
                console.log(`Users fetched : ${users}`);
        
            }catch(err){
                setError("Failed to fetch users");

            }finally{
                setLoading(false);
            }
        };
        fetchUsers();

    }, []);

    if(loading) return <div>Loading users...</div>
    if(error) return <div>{error}</div>
    return(
        <div className="container mx-auto p-6">
        <h2 className="text-3xl font-semibold mb-6">Users List</h2>
        
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Username</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">First Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Last Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Active</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Roles</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.firstName}</td>
                  <td className="px-6 py-4">{user.lastName}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.active ? "Active" : "Inactive"}</td>
                  <td className="px-6 py-4">
                    <ul>
                      {user.roles.map((role, index) => (
                        <li key={index}>{role}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEditUser(user.id)}
                      className="text-blue-500 hover:text-blue-700 font-semibold mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
}
export default UsersList;