"use client";
import { FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Team } from "@/types";
import getTeams from "@/app/util/getTeams";
import SearchBarForm from "@/app/components/searchBar/searchBarFrom";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";




const navigation = [
  { name: "Home", href: "/", },
  { name: "Results", href: "/results", },
  { name: "Contact", href: "/contact", },
  { name: "Login", href: "/login", },
  { name: "Register", href: "/register", },


];



function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar: FC = () => {
  const [teamsData, setTeamData] = useState<Team[]>([]);
  const notify = () => toast('Logging out...');
  const loggedOut = () => toast('Logged out');

  const pathname = usePathname();

  const handleLogout = (event: { preventDefault: () => void; }) => {
    event.preventDefault(); // Prevent page reload
    localStorage.removeItem('token'); // Remove the token
    notify();
    // Redirect after a short delay to allow toast to display
    setTimeout(() => {
      window.location.href = '/login';

    }, 2000); // Redirect to the login page

    setTimeout(() => {
      loggedOut();
    }, 5000);
  }
  const fetchTeams = async () => {
    try {
      let result: Team[] = await getTeams();
      setTeamData(result);
    } catch (error) { }
  };


  useEffect(() => {
    fetchTeams()
    return () => {

    };
  }, []);

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-4 flex items-center sm:hidden gap-8">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block h-6 w-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-6 w-6 group-data-[open]:block"
              />
            </DisclosureButton>

            <div className="sm:hidden items-center justify-center relative w-[30px] h-[30px]  ">
              <Image
                src="/football-info.png"
                alt="icon"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center ">
              <Link href="/" className="flex items-center space-x-2">
                <div className="hidden md:block relative w-[30px] h-[30px] ">
                  <Image
                    src="/football-info.png"
                    alt="icon"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-2xl text-teal-500 font-bold none md:block hidden">
                  Oracle
                </span>
              </Link>

            </div>

            {/* Search Bar Section */}
            <div className="ml-4 w-2/6 flex justify-center items-center">
              <SearchBarForm teamsData={teamsData} />

            </div>

            <div className="ml-6 hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  const isCurrent = pathname === item.href;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={isCurrent ? "page" : undefined}
                      className={classNames(
                        isCurrent
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                    >
                      {item.name}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

            {pathname && pathname.includes("/admin") && (
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="h-8 w-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <a
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                    >
                      Admin Dashboard
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                    >
                      Sign out
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            )}


          </div>
        </div>
      </div>
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => {
            const isCurrent = pathname === item.href;
            return (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={isCurrent ? "page" : undefined}
                className={classNames(
                  isCurrent
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </DisclosureButton>
            );
          })}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};


export default Navbar;
