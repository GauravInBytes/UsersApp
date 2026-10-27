import { useState } from "react";

const API_URL = "https://localhost:7163/api/users";

export default function EditUser({ user, setEditing, setLoadNewUsers }) {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,       
            [event.target.name]: event.target.value  
        });
    };

    const saveUser = async () => {
        const response = await fetch(API_URL, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Id: user.id,
                Name: formData.name,
                Email: formData.email,
            }),
        });

        if (!response.ok) throw new Error("Could not update user");
        else {
            setEditing(false);
            setLoadNewUsers(true);
        }
    }

    return (
        <div className="modal-backdrop" onClick={() => setEditing(false)}>
            <section
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-user-title"
                onClick={(event) => event.stopPropagation()}
            >
                <h2>Edit user</h2>

                <label>
                    Name
                    <input name="name" value={formData.name} onChange={handleChange} />
                </label>

                <label>
                    Email
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </label>

                <div className="modal-actions">
                    <button type="button" onClick={() => setEditing(false)}>Cancel</button>
                    <button type="button" onClick={saveUser}>Save User</button>
                </div>
            </section>
        </div>
    );
}