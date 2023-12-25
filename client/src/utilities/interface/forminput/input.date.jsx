import StaticContainer from "./static.container"
import StaticError from "./static.error"
import StaticLabel from "./static.label"
import StaticNotice from "./static.notice"
import StaticWrapper from "./static.wrapper"

export default function Date(props) {
    const {
        name,
        label,
        style,
        wrapper,
        placeholder,
        optional,
        errors,
        register,
        ...rest
    } = props

    return (
        <StaticContainer style={wrapper}>
            <StaticLabel name={name} label={label} optional={optional} />
            <StaticWrapper>
                <input
                    id={name}
                    type="date"
                    className={`${errors?.[name] ? "input-field-error" : "input-field"} ${style}`}
                    placeholder={placeholder}
                    {...register(name)}
                    {...rest}
                />
                <StaticError name={name} errors={errors} />
            </StaticWrapper>
            <StaticNotice name={name} errors={errors} />
        </StaticContainer>
    )
}