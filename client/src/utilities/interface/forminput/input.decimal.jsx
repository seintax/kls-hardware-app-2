import StaticContainer from "./static.container"
import StaticError from "./static.error"
import StaticLabel from "./static.label"
import StaticNotice from "./static.notice"
import StaticWrapper from "./static.wrapper"

export default function Decimal(props) {
    const {
        name,
        label,
        style,
        wrapper,
        placeholder,
        optional,
        register,
        errors,
        ...rest
    } = props

    return (
        <StaticContainer style={wrapper}>
            <StaticLabel name={name} label={label} optional={optional} />
            <StaticWrapper>
                <input
                    id={name}
                    type="number"
                    className={`${errors?.[name] ? "input-field-error" : "input-field"} ${style}`}
                    placeholder={placeholder}
                    min="0.00"
                    step="0.001"
                    presicion={2}
                    {...register(name)}
                    {...rest}
                />
                <StaticError name={name} errors={errors} />
            </StaticWrapper>
            <StaticNotice name={name} errors={errors} />
        </StaticContainer>
    )
}