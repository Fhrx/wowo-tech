import { useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../stores/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      register(form);

      toast.success(
        "Akun berhasil dibuat. Silakan login menggunakan akun tersebut."
      );

      // optional: reset form biar ga ke-submit ulang
      setForm({
        fullName: "",
        email: "",
        password: "",
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card w-96 bg-base-100 shadow p-6"
    >
      <h2 className="text-xl font-bold mb-4 text-center">
        Register
      </h2>

      <input
        placeholder="Nama Lengkap"
        className="input input-bordered w-full mb-3"
        value={form.fullName}
        onChange={(e) =>
          setForm({ ...form, fullName: e.target.value })
        }
      />

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

      <button className="btn btn-primary w-full">
        Register
      </button>

      <p className="text-sm text-center mt-3">
        Sudah punya akun?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-primary cursor-pointer underline"
        >
          Login
        </span>
      </p>
    </form>
  );
}