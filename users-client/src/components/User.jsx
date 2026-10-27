import { useEffect, useState } from "react";
import EditUser from "./EditUser";

const API_URL = "https://localhost:7163/api/users";

export default function User({ user, setLoadNewUsers }) {
    const [editing, setEditing] = useState(false);
    const editUser = () => {
        setEditing(true);
    }

    const deleteUser = (id) => {
        console.log(`Deleting user with ID: ${id}, Name: ${user.id}`);
        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
            fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            })
                .then((response) => {
                    console.log("Delete response:", response);
                    if (!response.ok) throw new Error("Could not delete user");
                    else setLoadNewUsers(true);
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                });
        }
    }

    return (
        <>
            <li className="user" key={user.id}>
                <span className="avatar">
                    {user.name?.charAt(0)?.toUpperCase() || "?"}
                </span>
                <span>
                    <strong>{user.name}</strong>
                    <span className="email">{user.email}</span>
                </span>
                <span>
                    <button className="editDeleteButtons" onClick={() => editUser(user.id)}>Edit</button>
                    <button className="editDeleteButtons" onClick={() => deleteUser(user.id)}>Delete</button>
                </span>
            </li>
            {editing && <EditUser user={user}
                setEditing={setEditing}
                setLoadNewUsers={setLoadNewUsers} />}
        </>
    );
}