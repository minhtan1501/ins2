/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dropdown({ options = [], Icon }) {
  return (
    <Menu as="div" className=" inline-block text-left relative">
      <div>
        <Menu.Button className="mx-2 text-2xl dark:text-dark-subtle text-light-subtle hover:opacity-60">
          {Icon ? <Icon /> : "..."}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className=" origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-secondary drop-shadow ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1 ">
            {options.map(({ title, Icon, onClick = null }, index) => {
              return (
                <Menu.Item key={index}>
                  {({ active }) => (
                    <div
                      onClick={onClick}
                      className={classNames(
                        "flex items-center space-x-2 cursor-pointer",
                        active
                          ? "dark:bg-secondary dark:text-dark-subtle bg-gray-100 text-light-subtle"
                          : "text-black dark:text-white",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      <Icon size={24} />
                      <p>{title}</p>
                    </div>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
