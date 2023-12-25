import { Menu, Transition } from "@headlessui/react"
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import { Bars3BottomLeftIcon, BellIcon, TicketIcon } from "@heroicons/react/24/outline"
import PropTypes from "prop-types"
import { Fragment, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useClientContext } from "../../../context/client.context"

function classNames(...classes) {
    return classes.filter(Boolean).join(" ")
}

export default function AppNavigation({ userNavigation, handleSidebarOpen }) {
    const { search, setSearch, user } = useClientContext()
    const [text, settext] = useState("")

    const onChange = (e) => {
        const { value } = e.target
        settext(value)
    }

    useEffect(() => {
        if (search.key === "") settext("")
    }, [search.key])

    const onSubmit = (e) => {
        e.preventDefault()
        setSearch(prev => ({
            ...prev,
            time: new Date(),
            key: text
        }))
    }

    return (
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-gradient-to-b from-[#041368] to-[#010a3a] border-b border-[#32395e]">
            <button
                type="button"
                className="border-r border-[#32395e] px-4 text-gray-500 focus:outline-none focus:ring-inset focus:bg-[#32395e] md:hidden"
                onClick={() => handleSidebarOpen(true)}
            >
                <span className="sr-only">Open sidebar</span>
                <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex flex-1 justify-between px-4 ">
                <div className="flex flex-1">
                    <form className="flex items-center w-full md:ml-0" onSubmit={onSubmit} method="GET">
                        <label htmlFor="search-field" className="sr-only">
                            Search
                        </label>
                        <div className="relative w-full text-gray-400 focus-within:text-white">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                                <MagnifyingGlassIcon className="h-4 w-4 ml-2" aria-hidden="true" />
                            </div>
                            <input
                                id="search-field"
                                className="block max-w-[500px] rounded-[10px] text-white bg-[#010a3a] my-2 focus:bg-[#32395e] w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-[#32395e] focus:outline-none focus:ring-0 sm:text-sm"
                                placeholder="Search product, supplier or transaction"
                                autoComplete="off"
                                type="search"
                                name="search"
                                value={text}
                                onChange={onChange}
                            />
                        </div>
                    </form>
                </div>
                <div className="ml-4 flex items-center md:ml-6">
                    <span className="text-gray-300 text-xs italic mr-3">{user?.name?.toUpperCase()}</span>
                    <button
                        type="button"
                        className="rounded-full bg-[#010a3a] p-[7px] text-gray-400 hover:text-gray-500 focus:outline-none focus:bg-[#32395e] ml-2.5"
                    >
                        <span className="sr-only">View notifications</span>
                        <TicketIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        className="rounded-full bg-[#010a3a] p-[5px] text-gray-400 hover:text-gray-500 focus:outline-none focus:bg-[#32395e] ml-2.5"
                    >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <Menu as="div" className="relative ml-2.5">
                        <div>
                            <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2">
                                <span className="sr-only">Open user menu</span>
                                {/* <img
                                    className="h-8 w-8 rounded-full"
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt=""
                                /> */}
                                <span className="h-8 w-8 bg-gradient-to-r from-[#5701c7] to-[#6b0362] rounded-[50%] flex items-center justify-center text-lg font-bold border border-1 border-[#ec45de] text-white">
                                    {user?.name?.slice(0, 1) || "U"}
                                </span>
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
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {userNavigation.map((item) => (
                                    <Menu.Item key={item.name}>
                                        {({ active }) => (
                                            <Link
                                                to={item.href}
                                                className={classNames(
                                                    active ? "bg-gray-100" : "",
                                                    "block px-4 py-2 text-sm text-gray-700"
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        )}
                                    </Menu.Item>
                                ))}
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>
        </div>
    )
}

AppNavigation.propTypes = {
    userNavigation: PropTypes.array.isRequired,
    handleSidebarOpen: PropTypes.func.isRequired,
}
