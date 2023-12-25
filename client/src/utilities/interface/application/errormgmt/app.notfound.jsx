import React from 'react'
import { Link } from "react-router-dom"
import PageNotFoundImage from "../../../../assets/404_1.png"

const AppPageNotFound = () => {
    return (
        <div className="flex flex-wrap items-center h-full mx-auto max-w-full md:max-w-7xl sm:px-6 lg:px-8 p-10">
            <div className="flex-1">
                <h1 className="text-5xl sm:text-6xl font-bold">Whooops!</h1>
                <p className="my-5">
                    The page you are looking for does not exist. Maybe it was taken by
                    someone.
                </p>
                <Link
                    to="/dashboard"
                    className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded text-white"
                >
                    Go to Home
                </Link>
            </div>
            <img
                src={PageNotFoundImage}
                alt="404 image"
                className="flex-1 mt-28 sm:mt-0"
            />
        </div>
    )
}

export default AppPageNotFound
