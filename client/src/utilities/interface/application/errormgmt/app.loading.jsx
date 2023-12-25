import React from 'react'

const AppLoading = ({ loading }) => {
    return (
        (loading) ? (
            <div className="fixed top-0 left-0 w-screen h-screen bg-gradient-to-b from-[#81818190] to-[#00000090] bg-opacity-[50%] z-20 flex items-center justify-center flex-col">
                <div className="w-[100px] h-[100px] bg-gradient-to-r from-[#1b0372] to-[#700474] flex items-center justify-center border border-2 border-[#b317a3]">
                    <svg
                        className="animate-spin h-10 w-10 text-[#ca0627]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </div>
                <div className="w-[100px] text-center text-white mt-5"><b>P</b>LEASE <b>W</b>AIT</div>
            </div>
        ) : null
    )
}

export default AppLoading