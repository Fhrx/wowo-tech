import useAuth from "../../stores/hooks/useAuth"

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-xl font-bold">Profile</h1>
      <p>Nama: {user.fullName}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  )
}