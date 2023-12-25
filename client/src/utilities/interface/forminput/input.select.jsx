import StaticContainer from "./static.container"
import StaticError from "./static.error"
import StaticLabel from "./static.label"
import StaticNotice from "./static.notice"
import StaticWrapper from "./static.wrapper"

export default function Select(props) {
    const {
        name,
        label,
        style,
        wrapper,
        options,
        optional,
        register,
        errors,
        ...rest
    } = props

    const renderOptions = (options) => {
        register(`${name}data`)
        return (
            (options?.length) ? (
                <>
                    <option value=""></option>
                    {
                        options?.map((option, index) => (
                            <option key={index} value={option.value || option}>
                                {option.key || option}
                            </option>
                        ))
                    }
                </>
            ) : (
                <option value="" disabled>
                    No options provided.
                </option>
            )
        )
    }

    return (
        <StaticContainer style={wrapper}>
            {label && (
                <StaticLabel name={name} label={label} optional={optional} />
            )}
            <StaticWrapper>
                <select
                    id={name}
                    className={`${errors?.[name] ? "input-field-error" : "select-field"} ${style}`}
                    {...register(name)}
                    {...rest}
                >
                    {renderOptions(options)}
                </select>
                <StaticError name={name} errors={errors} />
            </StaticWrapper>
            <StaticNotice name={name} errors={errors} />
        </StaticContainer>
    )
}