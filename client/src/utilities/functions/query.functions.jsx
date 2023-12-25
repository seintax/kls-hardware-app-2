import { useMutation, useQueryClient } from "react-query"
import { useNotificationContext } from "../context/notification.context"
import useSystemTool from "../hooks/useSystem"

export const processForm = (id, name, updateFunc, createFunc, queryKey, callBack) => {
    const { handleNotification } = useNotificationContext()
    const { moveBack, dataErrorHandler } = useSystemTool()
    const queryClient = useQueryClient()

    const { mutate } = useMutation(id ? updateFunc : createFunc, {
        onSuccess: data => {
            if (data.success) {
                handleNotification({
                    type: 'success',
                    message: `${name} has been ${id ? 'updated' : 'added'}.`,
                })
                // moveBack()
            }
            else {
                handleNotification({
                    type: 'error',
                    message: dataErrorHandler(data),
                })
            }
        },
        onError: () => {
            handleNotification({
                type: 'error',
                message: 'An error occured during data mutation.',
            })
        },
        onSettled: async () => {
            if (callBack) await callBack()
            queryClient.invalidateQueries(queryKey || `${name?.toLowerCase()}-index`)
        }
    })

    return { mutate }
}