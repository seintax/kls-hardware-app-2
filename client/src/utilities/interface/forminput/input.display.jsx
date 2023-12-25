import StaticContainer from "./static.container"
import StaticLabel from "./static.label"
import StaticWrapper from "./static.wrapper"

export default function Display(props) {
    const {
        name,
        label,
        style,
        wrapper,
        register,
        ...rest
    } = props

    return (
        <StaticContainer style={wrapper}>
            <StaticLabel name={name} label={label} />
            <StaticWrapper>
                <input
                    id={name}
                    type="text"
                    className={`input-field ${style}`}
                    readOnly={true}
                    {...register(name)}
                    {...rest}
                />
            </StaticWrapper>
        </StaticContainer>
    )
}