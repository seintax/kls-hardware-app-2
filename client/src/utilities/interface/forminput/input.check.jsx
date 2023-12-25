import StaticContainer from "./static.container"

export default function Check(props) {
    const {
        name,
        label,
        style,
        wrapper,
        description,
        register,
        ...rest
    } = props

    return (
        <StaticContainer style={wrapper}>
            <fieldset className="space-y-5">
                <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                        <input
                            id={name}
                            type="checkbox"
                            className={`h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 ${style}`}
                            {...register(name)}
                            {...rest}
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label
                            htmlFor={name}
                            className="font-medium text-gray-700"
                        >
                            {label}
                        </label>
                        <p className="text-gray-500">{description}</p>
                    </div>
                </div>
            </fieldset>
        </StaticContainer>
    )
}