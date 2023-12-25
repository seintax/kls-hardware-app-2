import { EyeIcon } from "@heroicons/react/24/solid"
import { useState } from "react"
import StaticContainer from "./static.container"
import StaticError from "./static.error"
import StaticLabel from "./static.label"
import StaticNotice from "./static.notice"
import StaticWrapper from "./static.wrapper"

export default function Password(props) {
    const [view, setview] = useState("password")
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
                    type={view}
                    className={`${errors?.[name] ? "input-field-error" : "input-field"} ${style}`}
                    placeholder={placeholder}
                    {...register(name)}
                    {...rest}
                />
                <div className="absolute right-0 mr-1 cursor-pointer p-2" onMouseDown={() => setview("text")} onMouseUp={() => setview("password")} onMouseLeave={() => setview("password")}>
                    <EyeIcon className="w-4 h-4" />
                </div>
                <StaticError name={name} errors={errors} />
            </StaticWrapper>
            <StaticNotice name={name} errors={errors} />
        </StaticContainer>
    )
}