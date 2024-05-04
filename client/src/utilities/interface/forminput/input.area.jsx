import StaticContainer from "./static.container"
import StaticError from "./static.error"
import StaticLabel from "./static.label"
import StaticNotice from "./static.notice"
import StaticWrapper from "./static.wrapper"

export default function Area(props) {
    const {
        name,
        label,
        style,
        wrapper,
        placeholder,
        optional,
        register,
        errors,
        rows,
        cols,
        values,
        ...rest
    } = props

    return (
        <StaticContainer style={wrapper}>
            <StaticLabel name={name} label={label} optional={optional} />
            <StaticWrapper>
                <div className="flex flex-col w-full">
                    <textarea
                        id={name}
                        type="text"
                        className={`${errors?.[name] ? "input-field-error" : "input-field"} ${style}`}
                        placeholder={placeholder}
                        rows={rows}
                        cols={cols}
                        {...register(name)}
                        {...rest}
                    ></textarea>
                </div>
                <StaticError name={name} errors={errors} />
            </StaticWrapper>
            <StaticNotice name={name} errors={errors} />
        </StaticContainer>
    )
}