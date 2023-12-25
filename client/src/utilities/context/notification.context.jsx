import { createContext, useContext, useState } from "react"

export const NotificationContext = createContext()

export function useNotificationContext() {
    return useContext(NotificationContext)
}

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([])

    function ShowNotification(type, message) {
        let notificationProperties = null
        notificationProperties = {
            id: crypto.randomUUID(),
            type: type,
            message: message,
        }
        setNotifications([...notifications, notificationProperties])
    }

    function handleNotification(params) {
        ShowNotification(params.type, params.message)
    }

    return (
        <NotificationContext.Provider
            value={{
                handleNotification,
                notifications,
                setNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    )
}
