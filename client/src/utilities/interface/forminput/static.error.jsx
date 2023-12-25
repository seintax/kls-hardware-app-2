import { ExclamationCircleIcon } from "@heroicons/react/20/solid"

const StaticError = ({ name, errors }) => {
    return (
        (errors) ? (
            errors?.[name] && (
                <div className="flex pointer-events-none absolute inset-y-0 right-0 items-center pr-3">
                    <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                    />
                </div>
            )
        ) : null
    )
}

export default StaticError