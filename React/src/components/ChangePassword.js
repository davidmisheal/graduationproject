import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";

export default function ChangePassword({ email }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { user } = useUser(); // Assuming `user` includes the user's token

  const handleChangePassword = async () => {
    if (!user || !user.token) {
      alert("User is not logged in or token is not available");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      console.log("Token being used:", user.token);
      await axios.patch(
        "http://localhost:3000/api/v1/users/updateMyPassword",
        {
          passwordCurrent: currentPassword,
          password: newPassword,
          passwordConfirm: confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password.");
    }
  };

  const handleForgotPassword = async () => {
    try {
      if (!email) {
        alert("User email is not available");
        return;
      }

      await axios.post("http://localhost:3000/api/v1/users/forgotPassword", {
        email: email,
      });

      alert("Password reset email sent!");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      alert("Failed to send password reset email.");
    }
  };

  return (
    <div className="change-main">
      <label>
        <p>Current Password:</p>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </label>
      <label>
        <p>New Password:</p>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </label>
      <label>
        <p>Re-write New Password:</p>
        <input
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
      </label>
      <button onClick={handleChangePassword}>Change Password</button>
      <button onClick={handleForgotPassword}>Forgot Password?</button>
    </div>
  );
}
