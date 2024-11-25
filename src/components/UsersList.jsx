import React, { useEffect, useState } from "react";
import ApiService from "../services/ApiServices";
import useAuth from "../hooks/useAuth";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import EditUserNameDialog from "./EditUserNameDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false); // Control dialog visibility
  const [userToRemoveId,setUserToRemoveId] = useState(null);
  const { keycloak } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`Token of admin: ${keycloak.token}`)
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const users = await ApiService.listAllUsers(keycloak.token);
        setUsers(users);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(()=>{
    console.log("updated users list: ", users)
  },[users])

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleSaveUsername = async (newUsername) => {
    console.log(`Trying to save new username of ${newUsername}`)
    
    try {
      await ApiService.updateUserName(selectedUser.id, newUsername, keycloak.token);
      // Refresh user list after update
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, username: newUsername } : u));
    } catch (error) {
      setError("Failed to update username");      
      console.log("Error when saving is: " , error)

    }
      
  };

  const handleViewAuctions = (userId) =>{
    navigate(`/my-auctions/${userId}`);  // Navigate to the MyAuctions page with the userId

  }
  const handleDelete = (userId) =>{
    setIsDeleteUserDialogOpen(true);
    setUserToRemoveId(userId);
  }
  const handleConfirmDeleteUser = () =>{
    handleDeleteUser();
  }
  const handleCancelDeleteUser = () =>{
    setIsDeleteUserDialogOpen(false);
  }
  const handleDeleteUser = async  () =>{
    setLoading(true);
    console.log(`Deleting user with userId ${userToRemoveId}`)
    try{

      //Make sure id of user to remove isn't null and token of the logged in admin is valid
      if (!keycloak.token || userToRemoveId == null) {
        throw new Error("Token or user to delete id invalid");
      }

      //perform API call to remove the user by its userId 
      await ApiService.deleteUserByUserId(userToRemoveId, keycloak.token);

      //Update the users state so that the removed user is excluded from it (filter)
      const updatedUsers = users.filter(user => user.id !== userToRemoveId);
      setUsers(updatedUsers);

      setUserToRemoveId(null);
      setIsDeleteUserDialogOpen(false);

    }catch(err){
      setError(err);
      console.log(`Error occured while removing user ${err}`)
    }finally{
      setLoading(false)
    }
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
                      <li key={index}>{role === "admin" ? "Admin" : "User"}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-6">
                    {/* Edit user Button */}
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <FaEdit size={20} />
                    </button>

                      {/* View users auctions Button */}
                    <button
                      onClick={() => handleViewAuctions(user.id)}
                      className="text-gray-600  hover:text-gray-900 hover:scale-125 focus:outline-none transition duration-200"
                    >
                      <FaEye size={20} />
                    </button>

                      {/* Delete Button */}
                      <button
                      onClick={() => handleDelete(user.id)}
                      className="text-gray-600  hover:text-gray-900 hover:scale-125 focus:outline-none transition duration-200"
                    >
                      <FaTrashAlt size={20} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <EditUserNameDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          user={selectedUser}
          onSave={handleSaveUsername}
        />
      )}

            {/* Delete User dialog */}
            <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <DialogContent className="w-full sm:max-w-[500px] md:max-w-[700px] lg:max-w-[800px] h-[20vh] min-h-[200px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="bg-red-600 text-white rounded-xl px-4 py-2 hover:bg-red-700"
              onClick={handleConfirmDeleteUser} // Handle deletion on confirm
            >
              Confirm
            </Button>
            <Button
              className="bg-neutral-800 text-white rounded-xl px-4 py-2 hover:bg-gray-700"
              onClick={handleCancelDeleteUser} // Handle cancellation
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UsersList;
