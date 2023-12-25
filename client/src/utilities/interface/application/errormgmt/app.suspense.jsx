const AppSuspense = () => {
    return (
        <div className="w-full h-full flex items-center justify-center no-select">
            <div className="flex flex-col gap-[15px] w-[500px] items-center text-center">
                Your network is unexpectedly running slow. <br />
                Please wait while we load your data.

                <div className="w-[50px] h-[50px] rounded-[50%] bg-white flex items-center justify-center border border-[8px] border-[#b4b4b4] border-t-[#003cff] animate-spin">
                    <div className="w-[20px] h-[20px] bg-[#003cff] rounded-[50%] animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}
export default AppSuspense