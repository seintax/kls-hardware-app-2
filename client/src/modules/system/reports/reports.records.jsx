import { PresentationChartLineIcon } from "@heroicons/react/20/solid"
import React, { useState } from 'react'
import TemplateDailyInventory from "./template.daily.inventory"
import TemplateDailyReceivables from "./template.daily.receivables"
import TemplateDailyReturn from "./template.daily.return"
import TemplateDailySales from "./template.daily.sales"
import TemplateDailySummary from "./template.daily.summary"
import TemplateMaintenance from "./template.maintenance"
import TemplateReceivableCollection from "./template.receivable.collection"

const ReportsRecords = ({ setter, manage, refetch, data }) => {
    const [report, setreport] = useState("")

    const reports = [
        { name: "Daily Sales", template: "daily-sales" },
        { name: "Daily Summary", template: "daily-summary" },
        { name: "Daily Receivables", template: "daily-receivables" },
        { name: "Daily Inventory", template: "daily-inventory" },
        { name: "Daily Returns", template: "daily-return" },
        { name: "Receivable Collection", template: "receivable-collection" },
        { name: "Running Inventory" },
        // { name: "Maintenance", template: "maintenance" },
        // { name: "Daily Summary Range" },
    ]

    const toggleReport = (template) => {
        setreport(template)
    }

    const toggleOff = () => {
        setreport("")
    }

    return (
        <div className="flex flex-wrap mt-8 gap-[15px]">
            {
                reports?.map((report, index) => (
                    <div key={index} className={`flex flex-col h-[300px] w-[250px] p-2rounded-[10px] justify-between items-center relative cursor-pointer ${report?.template ? "bg-[#010a3a] hover:bg-[#101c63]" : "bg-gray-400"}`} onClick={() => toggleReport(report?.template || "")}>
                        <div className="justify-self-start pt-5">
                            <PresentationChartLineIcon className="h-36 w-36 text-[#4053bb]" />
                        </div>
                        <div className="w-full text-center text-white py-5">
                            {report.name}
                        </div>
                        <div className={`absolute text-white font-bold z-2 text-xl mt-16 ${report?.template ? "hidden" : ""}`}>Not Yet Available</div>
                    </div>
                ))
            }
            <TemplateDailySales report={report} toggle={toggleOff} />
            <TemplateDailySummary report={report} toggle={toggleOff} />
            <TemplateReceivableCollection report={report} toggle={toggleOff} />
            <TemplateDailyReceivables report={report} toggle={toggleOff} />
            <TemplateDailyInventory report={report} toggle={toggleOff} />
            <TemplateDailyReturn report={report} toggle={toggleOff} />
            <TemplateMaintenance report={report} toggle={toggleOff} />
        </div>
    )
}

export default ReportsRecords