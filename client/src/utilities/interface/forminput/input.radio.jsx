export default function Radio(props) {
    const {
        name,
        label,
        style,
        wrapper,
        description,
        options,
        register,
        ...rest
    } = props

    return (
        <StaticContainer style={wrapper}>
            <div className="mb-10">
                <label className="text-sm font-medium text-gray-900">{label}</label>
                <p className="text-sm font-medium leading-5 text-gray-500">{description}</p>
                <fieldset className="mt-4">
                    <div className="space-y-4">
                        {options.map((option) => (
                            <div key={option.key} className="flex items-center">
                                <input
                                    id={option.key}
                                    type="radio"
                                    className={`h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500 ${style}`}
                                    defaultChecked={option.checked}
                                    value={option.value}
                                    {...register(name)}
                                    {...rest}
                                />
                                <label
                                    htmlFor={option.key}
                                    className="ml-3 block text-sm font-medium text-gray-700"
                                >
                                    {option.key}
                                </label>
                            </div>
                        ))}
                    </div>
                </fieldset>
            </div>
        </StaticContainer>
    )
}