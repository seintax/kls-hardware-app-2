import { useLocation, useNavigate, useParams } from "react-router-dom"

export default function useSystemTool() {
    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams()

    function moveBack() {
        let prevLoc = location.pathname.split("/").filter(f => f !== id).slice(0, -1).join("/")
        navigate(prevLoc)
    }

    function dataErrorHandler(response) {
        let error = "Submission has encountered an error."
        if (response?.error?.code === "ER_DUP_ENTRY") {
            error = "You have entered a duplicate record."
        }
        else {
            console.error(response)
        }
        return error
    }

    return {
        moveBack,
        dataErrorHandler
    }
}
