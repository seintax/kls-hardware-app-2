import React from 'react'

const DataPagination = ({ itemsperpage, totalitems, itemcount, page, pages, setPage, keep, scrollToTop }) => {
    const lastItemIndex = page * itemsperpage
    const firstItemIndex = lastItemIndex - itemsperpage

    const firstPage = () => {
        if (page > 1) {
            setPage(1)
            scrollToTop()
        }
    }

    const prevPage = () => {
        if (page > 1) {
            setPage(prev => prev - 1)
            scrollToTop()
        }
    }

    const nextPage = () => {
        if (page < pages) {
            setPage(prev => prev + 1)
            scrollToTop()
        }
    }

    const lastPage = () => {
        if (page < pages) {
            setPage(pages)
            scrollToTop()
        }
    }

    return (
        <nav
            className={`${totalitems > itemsperpage || keep ? "flex" : "hidden"} flex-none items-center justify-between border-t border-gray-200 bg-white px-0 py-3 sm:px-0 no-select`}
            aria-label="Pagination"
        >
            <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                    Showing (<span className="font-medium">{totalitems ? firstItemIndex + 1 : 0}</span> to <span className="font-medium">{firstItemIndex + itemcount}</span>) out of{' '}
                    <span className="font-medium">{totalitems}</span> results
                </p>
            </div>
            <div className="flex flex-1 gap-[10px] justify-between sm:justify-end">
                <span
                    className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${(page === 1 ? "text-gray-400 bg-gray-300 cursor-default" : "text-gray-700 bg-white hover:bg-gray-200 cursor-pointer")}`}
                    onClick={firstPage}
                >
                    First
                </span>
                <span
                    className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${(page === 1 ? "text-gray-400 bg-gray-300 cursor-default" : "text-gray-700 bg-white hover:bg-gray-200 cursor-pointer")}`}
                    onClick={prevPage}
                >
                    Prev
                </span>
                <span
                    className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${(page === pages ? "text-gray-400 bg-gray-300 cursor-default" : "text-gray-700 bg-white hover:bg-gray-200 cursor-pointer")}`}
                    onClick={nextPage}
                >
                    Next
                </span>
                <span
                    className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${(page === pages ? "text-gray-400 bg-gray-300 cursor-default" : "text-gray-700 bg-white hover:bg-gray-200 cursor-pointer")}`}
                    onClick={lastPage}
                >
                    Last
                </span>
            </div>
        </nav>
    )
}

export default DataPagination