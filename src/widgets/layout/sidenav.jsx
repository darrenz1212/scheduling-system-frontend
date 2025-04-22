import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import {
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "../../context";

export function Sidenav({ routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType, openSidenav } = controller;
  const user = useSelector((state) => state.auth.user);

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-[#0db0bb] shadow-sm",
    transparent: "bg-transparent",
  };

  return (
      <aside
          className={`${sidenavTypes[sidenavType]} ${
              openSidenav ? "translate-x-0" : "-translate-x-80"
          } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72  rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100 bg-[#0db0bb] text-white`}
      >
        <div className="relative text-center py-8">
          <Link to="/">
            <Typography
                variant="h4"
                className="text-2xl font-bold tracking-wide text-white"
            >
              {user?.username || "User"}
            </Typography>
          </Link>
          <IconButton
              variant="text"
              color="white"
              size="sm"
              ripple={false}
              className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
              onClick={() => setOpenSidenav(dispatch, false)}
          >
            <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
          </IconButton>
        </div>

        {/* Menu */}
        <div className="m-4">
          {routes.map(({ title, pages }, key) => (
              <ul key={key} className="mb-6 flex flex-col gap-2">
                {title && (
                    <li className="mx-4 mt-4 mb-2">
                      <Typography
                          variant="small"
                          className="text-lg font-bold uppercase opacity-85"
                      >
                        {title}
                      </Typography>
                    </li>
                )}
                {pages.map(({ icon, name, path, onClick }) => (
                    <li key={name} className="border-b border-white/20 py-1">
                      {path ? (
                          <NavLink to={path}>
                            {({ isActive }) => (
                                <Button
                                    variant="text"
                                    onClick={onClick}
                                    className={`flex items-center gap-4 px-5 py-3 rounded-lg transition-all text-lg ${
                                        isActive
                                            ? "bg-white text-[#0db0bb] shadow-md"
                                            : "text-white hover:bg-[#0a99a1] hover:shadow-md"
                                    }`}
                                    fullWidth
                                >
                                  {icon}
                                  <Typography className="font-semibold capitalize">
                                    {name}
                                  </Typography>
                                </Button>
                            )}
                          </NavLink>
                      ) : (
                          <Button
                              variant="text"
                              onClick={onClick}
                              className="flex items-center gap-4 px-5 py-3 rounded-lg transition-all text-lg text-white hover:bg-[#0a99a1] hover:shadow-md"
                              fullWidth
                          >
                            {icon}
                            <Typography className="font-semibold capitalize">
                              {name}
                            </Typography>
                          </Button>
                      )}
                    </li>
                ))}

              </ul>
          ))}
        </div>
      </aside>
  );
}

Sidenav.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
