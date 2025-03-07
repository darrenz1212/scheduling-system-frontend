// src/components/Navbar.jsx
import { useSelector } from "react-redux";
import {
  Navbar as MTNavbar,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import { UserCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";

export function Navbar() {
  const user = useSelector((state) => state.auth.user);

  return (
      <MTNavbar color="white" className="rounded-xl px-4 py-3 shadow-md">
        <div className="flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            Dashboard
          </Typography>

          <div className="flex items-center gap-4">
            <Typography color="blue-gray" className="font-medium">
              {user?.id}
            </Typography>

            <Menu>
              <MenuHandler>
                <IconButton variant="text" color="blue-gray">
                  <Avatar
                      src="https://i.pravatar.cc/40"
                      alt="User Avatar"
                      size="sm"
                      className="border-2 border-[#0db0bb]"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList className="w-max border-0">
                <MenuItem className="flex items-center gap-3">
                  <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                  <Typography variant="small" className="font-medium text-blue-gray-500">
                    Profile
                  </Typography>
                </MenuItem>
                <MenuItem className="flex items-center gap-3">
                  <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
                  <Typography variant="small" className="font-medium text-blue-gray-500">
                    Settings
                  </Typography>
                </MenuItem>
                <MenuItem className="text-red-500">
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </MTNavbar>
  );
}

export default Navbar;
