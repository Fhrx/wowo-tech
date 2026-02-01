import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../stores/hooks/useAuth";

export default function LoginForm() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            toast.error("Email dan password wajib diisi");
            return;
        }

        try {
            const role = login(form);
            toast.success("Login berhasil");

            if (role === "admin") {
                navigate("/admin");
            } else {
                navigate("/products");
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="card w-96 bg-base-100 shadow p-6"
        >
            <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

            <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full mb-3"
                value={form.email}
                onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                }
            />

            <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full mb-3"
                value={form.password}
                onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                }
            />

            <button className="btn btn-primary w-full">Login</button>

            <div className="divider">Quick Login</div>

            <button
                type="button"
                className="btn btn-outline w-full mb-2"
                onClick={() =>
                    setForm({
                        email: "admin@wowotech.dev",
                        password: "admin123",
                    })
                }
            >
                Autofill Admin
            </button>

            <button
                type="button"
                className="btn btn-outline w-full"
                onClick={() =>
                    setForm({
                        email: "user@wowotech.dev",
                        password: "user123",
                    })
                }
            >
                Autofill User
            </button>

        </form>
    );
}