import { QueryClient, QueryClientProvider } from "react-query"
import AppRoute from "./Route"
import ClientProvider from "./utilities/context/client.context"
import { NotificationProvider } from "./utilities/context/notification.context"
import NotificationContainer from "./utilities/interface/notification/notification.container"
import "./utilities/prototype/array.prototype"
import "./utilities/prototype/datetime.prototype"
import "./utilities/prototype/number.prototype"
import "./utilities/prototype/string.prototype"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ClientProvider>
                <NotificationProvider>
                    <div className="h-screen text-black">
                        <AppRoute />
                        <NotificationContainer />
                    </div>
                    {/* <div className="absolute top-0 left-0 z-[50] w-screen h-screen bg-black bg-opacity-[50%] flex items-center justify-center">
                        <div className="w-[500px] h-[350px] bg-gradient-to-r from-[#f5a906] to-[#fa0376] bg-opacity-[90%] text-lg flex items-center justify-center text-center px-10 rounded-[20px] text-white font-bold border border-[5px] border-white">
                            THIS SITE IS CURRENTLY UNDERMAINTENANCE UPTO AN UNDETERMINED DURATION. <br /><br /> MIGRATION IS ON-GOING. <br /> Please wait patiently.
                        </div>
                    </div> */}
                </NotificationProvider>
            </ClientProvider>
        </QueryClientProvider>
    )
}

export default App
