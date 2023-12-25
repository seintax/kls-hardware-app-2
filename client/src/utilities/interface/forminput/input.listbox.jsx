import { useEffect, useState } from "react"
import StaticContainer from "./static.container"
import StaticError from "./static.error"
import StaticLabel from "./static.label"
import StaticNotice from "./static.notice"
import StaticWrapper from "./static.wrapper"

export default function Listbox(props) {
    const [list, setlist] = useState([])
    const [selected, setselected] = useState([])
    const {
        name,
        label,
        style,
        wrapper,
        items,
        setter,
        values,
        optional,
        register,
        errors,
        ...rest
    } = props

    useEffect(() => {
        if (items) setlist(items)
    }, [items])

    useEffect(() => {
        if (values && items) {
            let value = values[name]
            if (value) {
                let stored = JSON.parse(value)
                setlist(items.map(lst => {
                    if (stored?.includes(lst.value)) {
                        return { ...lst, selected: !lst.selected }
                    }
                    return { ...lst }
                }))
            }
        }
    }, [values])

    useEffect(() => {
        if (list) {
            let selectionKey = []
            let selectionVal = []
            list.map(item => {
                if (item.selected) {
                    selectionKey.push(item.key)
                    selectionVal.push(item.value)
                }
            })
            if (setter) setter(name, JSON.stringify(selectionVal))
            setselected(selectionKey)
        }
    }, [list])

    const selectItem = (item) => {
        setlist(list.map(lst => {
            if (lst.key === item.key) {
                return { ...lst, selected: !lst.selected }
            }
            return { ...lst }
        }))
    }

    return (
        <StaticContainer style={wrapper}>
            {label && (<StaticLabel name={name} label={label} optional={optional} />)}
            <StaticWrapper>
                <div className="w-full min-h-[100px] max-h-[200px] overflow-auto rounded-[5px] border border-1 border-gray-300 flex flex-col">
                    {
                        list?.map((item, index) => (
                            <div key={index} className="px-2 py-3 flex items-center cursor-pointer hover:bg-gray-300" onClick={() => selectItem(item)}>
                                {/* <div className="w-[50px]">{item?.selected ? <CheckIcon className="h-4 w-4" /> : ""}</div> */}
                                <div className="w-[50px]">{item?.selected ? <span className="text-[12px]">&#9745;</span> : <span>&#9744;</span>}</div>
                                <div>{item?.key || item}</div>
                            </div>
                        ))
                    }
                </div>
                <div className="flex text-sm font-medium mt-2 flex-wrap text-gray-500 italic">
                    Selected {selected.length > 0 ? `(${selected.length})` : ""}:&nbsp;
                    {
                        (selected?.length) ? (
                            selected?.map((select, index) => (
                                <span key={index}>
                                    <font className="hover:underline">{select}</font>
                                    {index === selected.length - 1 ? "" : <>,&nbsp;</>}
                                </span>
                            ))
                        ) : "None"
                    }
                </div>
                <input
                    id={name}
                    type="hidden"
                    className={`${errors?.[name] ? "input-field-error" : "input-field"} ${style}`}
                    {...register(name)}
                    {...rest}
                />
                <StaticError name={name} errors={errors} />
            </StaticWrapper>
            <StaticNotice name={name} errors={errors} />
        </StaticContainer>
    )
}