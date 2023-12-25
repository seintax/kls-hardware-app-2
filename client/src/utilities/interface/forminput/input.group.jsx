
export default function Group({ style, children }) {
    return (
        <div className={`w-full flex gap-[20px] ${style}`}>
            {children}
        </div>
    )
}