import { HomeIcon } from "@heroicons/react/20/solid"
import { Link } from "react-router-dom"

const AppBreadcrumbs = ({ pages }) => {

    return (
        <nav
            className="hidden sm:flex bg-white shadow top-0 z-11 py-2 pl-4 no-select text-sm"
            aria-label="Breadcrumb"
        >
            <ol role="list" className="flex items-center space-x-2">
                <li>
                    <div>
                        <Link to="/dashboard" className="text-gray-400 hover:text-primary-500 ">
                            <HomeIcon
                                className="h-5 w-5 flex-shrink-0 fill-[#010a3a] hover:fill-[#132061]"
                                aria-hidden="true"
                            />
                            <span className="sr-only">Home</span>
                        </Link>
                    </div>
                </li>
                {pages?.map((page) => (
                    <li key={page.name} className={!isNaN(page.name) ? "hidden" : ""}>
                        <div className="flex items-center">
                            {/* <svg
                                className="h-5 w-5 flex-shrink-0 text-gray-300"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                            >
                                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                            </svg> */}
                            <span className="mx-2 text-gray-400">&#10095;</span>
                            {page.current ? (
                                <span className="ml-2 text-md text-[#ffffff] bg-gradient-to-r from-[#1b0372] to-[#700474] border border-1 border-[#b317a3] px-2 rounded-[5px] py-1">{page.name}</span>
                            ) : (
                                <Link
                                    to={page.href}
                                    className="ml-2 text-md font-medium text-[#66055c] border border-1 border-[#ffffff] hover:border-[#b317a3] px-2 rounded-[5px] py-1"
                                    aria-current={page.current ? "page" : undefined}
                                >
                                    {page.name}
                                </Link>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    )
}

export default AppBreadcrumbs