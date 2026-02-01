import { create } from "zustand";
import { persist } from "zustand/middleware";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const ADMIN_CREDENTIAL = {
  email: "admin@wowotech.dev",
  password: bcrypt.hashSync("admin123", 10),
  fullName: "Admin WowoTech",
  role: "admin",
};

const DEMO_USER = {
  email: "user@wowotech.dev",
  password: bcrypt.hashSync("user123", 10),
  fullName: "Demo User",
  role: "user",
};

const initialUsers = [
  {
    id: uuidv4(),
    ...ADMIN_CREDENTIAL,
    createdAt: Date.now(),
  },
  {
    id: uuidv4(),
    ...DEMO_USER,
    createdAt: Date.now(),
  },
];

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      users: initialUsers,
      isAuthenticated: false,

      register: ({ email, password, fullName }) => {
        const users = get().users;
        const exists = users.find((u) => u.email === email);

        if (exists) throw new Error("Email sudah terdaftar");

        const newUser = {
          id: uuidv4(),
          email,
          fullName,
          password: bcrypt.hashSync(password, 10),
          role: "user",
          createdAt: Date.now(),
        };

        set({
          users: [...users, newUser],
          user: newUser,
          isAuthenticated: true,
        });

        return newUser.role;
      },

      login: ({ email, password }) => {
        if (!email || !password) {
          throw new Error("Email dan password wajib diisi");
        }

        const user = get().users.find((u) => u.email === email);
        if (!user) throw new Error("User tidak ditemukan");

        const match = bcrypt.compareSync(password, user.password);
        if (!match) throw new Error("Password salah");

        set({
          user,
          isAuthenticated: true,
        });

        return user.role;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    { name: "wowotech-auth" }
  )
);

export default useAuthStore;