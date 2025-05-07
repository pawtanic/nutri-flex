'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { FaGoogle, FaUserCircle, FaSignOutAlt} from 'react-icons/fa'; // Import specific icons

export default function AuthComponent() {
  const { data: session } = useSession();

  if (session?.user != null) {
    return (
      <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg shadow-sm">
        <FaUserCircle className="text-xl text-gray-600" />
        <span className="font-medium text-lg">{session?.user?.name}</span>
        <button
          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
          onClick={() => signOut()}
        >
          <FaSignOutAlt className="text-white text-sm" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded flex items-center space-x-2 hover:bg-blue-600"
        onClick={() => signIn('google')}
      >
        <FaGoogle className="text-sm" />
        <span className="text-sm">Login</span>
      </button>
    </div>
  );
}
