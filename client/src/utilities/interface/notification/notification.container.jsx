import React, { useContext } from 'react'
import { NotificationContext } from "../../context/notification.context"
import Notification from "./notification.component"

const NotificationContainer = () => {
    const { notifications, setNotifications } = useContext(NotificationContext)

    const deleteNotification = async (notificationId) => {
        const notificationList = await notifications.filter(
            (n) => n.id !== notificationId
        )
        setNotifications(notificationList)
    }

    return (
        <div
            aria-live="assertive"
            className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
        >
            <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                {notifications.map((notif) => (
                    <Notification
                        key={notif.id}
                        notification={notif}
                        deleteNotification={deleteNotification}
                    />
                ))}
            </div>
        </div>
    )
}

export default NotificationContainer