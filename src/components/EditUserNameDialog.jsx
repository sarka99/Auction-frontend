import React, { useState } from "react";
// Use relative path since EditUserNameDialog.jsx is inside src/components

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";  // Adjusted path
import { Button } from "./ui/button"; 
import { Label } from "./ui/label"; 
import { Input } from "./ui/input"; 

const EditUserNameDialog = ({ isOpen, onClose, user, onSave }) => {
  const [newUsername, setNewUsername] = useState(user.username);

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const handleSubmit = () => {
    onSave(newUsername);
    onClose(); // Close dialog after save
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-[425px] md:max-w-[600px] lg:max-w-[600px] h-auto">
        <DialogHeader>
          <DialogTitle>Edit Username</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-5">
            <Label htmlFor="username" className="text-left">
              New Username
            </Label>
            <Input
              id="username"
              value={newUsername}
              onChange={handleUsernameChange}
              className="p-2 border rounded-xl"
              placeholder="Enter new username"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="bg-blue-600 text-white rounded-xl px-4 py-2 mt-2 hover:bg-blue-500">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserNameDialog;
