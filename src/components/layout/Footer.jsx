export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 text-sm mt-10">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between gap-4">
        <p>© {new Date().getFullYear()} WowoTech. All rights reserved.</p>

        <div className="flex gap-4">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Support</span>
        </div>
      </div>
    </footer>
  )
}