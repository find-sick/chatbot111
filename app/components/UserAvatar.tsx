'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut } from '@/utils/auth';

interface UserAvatarProps {
  className?: string;
}

export default function UserAvatar({ className = '' }: UserAvatarProps) {
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const success = await signOut();
    if (success) {
      router.push('/login');
    }
  };

  return (
    <div 
      className={`relative cursor-pointer ${className}`}
      onMouseEnter={() => setIsLogoutVisible(true)}
      onMouseLeave={() => setIsLogoutVisible(false)}
    >
      <Image
        src={"/globe.svg"}
        alt={user?.email || "用户头像"}
        width={40}
        height={40}
        className="rounded-full"
      />
      
      {isLogoutVisible && (
        <div className="absolute right-0 top-full mt-2 w-48  bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2">
          <div className="text-center px-3 h-6  py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
            {user?.email}
          </div>
          <button 
            className="w-full text-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            onClick={handleLogout}
          >
            退出登录
          </button>
        </div>
      )}
    </div>
  );
}