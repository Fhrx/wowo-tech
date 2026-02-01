export const mockUsers = [
  {
    id: 1,
    email: "admin@wowotech.com",
    password: "admin123",
    role: "admin",
    fullName: "Admin Wowo",
  },
  {
    id: 2,
    email: "user@wowotech.com",
    password: "user123",
    role: "user",
    fullName: "User Demo",
  },
]

export function loginService(email, password) {
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  )

  if (!user) throw new Error("Email atau password salah")

  return user
}