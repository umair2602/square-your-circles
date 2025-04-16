'use client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import { setUsername } from '@/store/slices/ideaCreationSlice';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const UsernameMenu = () => {
  const { user, logout } = useAuth();
  const dispatch = useDispatch();
  const { username } = useSelector((state: any) => state.ideaCreation);
  const router = useRouter();

  useEffect(() => {
    if (!username) {
      const randomName = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        separator: '',
        style: 'lowerCase',
      });
      const number = Math.floor(10 + Math.random() * 90);
      const tempUsername = randomName + number;
      dispatch(setUsername(tempUsername));
    }
  }, [dispatch, username]);

  const handleAuthAction = () => {
    if (user) {
      logout();
    } else {
      router.push('/login');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="px-2.5 py-2 text-xl font-semibold bg-white">
          Hi, {username}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleAuthAction}>{user ? 'Log out' : 'Log in'}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UsernameMenu;
