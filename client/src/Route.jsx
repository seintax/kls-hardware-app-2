import React, { lazy } from 'react'
import { Route, Routes } from "react-router-dom"
import DashboardIndex from "./modules/feature/dashboard/dashboard.index"
import DashboardPanel from "./modules/feature/dashboard/dashboard.panel"
import ViewerIndex from "./modules/feature/viewer/viewer.index"
import UserAccount from "./modules/system/account/account.login"
import PrintBase from "./modules/system/prints/print.base"
import PrintChequeMonitor from "./modules/system/prints/print.cheque.monitor"
import PrintDailyInventory from "./modules/system/prints/print.daily.inventory"
import PrintDailyReceivables from "./modules/system/prints/print.daily.receivables"
import PrintDailyReturn from "./modules/system/prints/print.daily.return"
import PrintDailySales from "./modules/system/prints/print.daily.sales"
import PrintDailySummary from "./modules/system/prints/print.daily.summary"
import PrintDeliveryPayables from "./modules/system/prints/print.delivery.payables"
import PrintDeliveryReceived from "./modules/system/prints/print.delivery.received"
import PrintInventory from "./modules/system/prints/print.inventory"
import PrintReceivableCollection from "./modules/system/prints/print.receivable.collection"
import PrintRunningStocks from "./modules/system/prints/print.running.stocks"
import AppEmpty from "./utilities/interface/application/errormgmt/app.empty"
import AppErrorFallback from "./utilities/interface/application/errormgmt/app.fallback"
import AppPageNotFound from "./utilities/interface/application/errormgmt/app.notfound"
import AppLazy from "./utilities/interface/application/navigation/app.lazyload"

const ProfileIndex = lazy(() => import('./modules/system/account/account.profile'))
const MasterlistIndex = lazy(() => import('./modules/feature/masterlist/masterlist.index'))
const InventoryIndex = lazy(() => import('./modules/feature/inventory/inventory.index'))
const InventoryView = lazy(() => import('./modules/feature/inventory/inventory.registry'))
const InventoryHistory = lazy(() => import('./modules/feature/inventory/inventory.history'))
const InventoryLedger = lazy(() => import('./modules/feature/inventory/inventory.ledger'))
const DeliveryIndex = lazy(() => import('./modules/feature/delivery/delivery.index'))
const DeliveryView = lazy(() => import('./modules/feature/delivery/delivery.registry'))
const TransferIndex = lazy(() => import('./modules/feature/transfer/transfer.index'))
const TransferView = lazy(() => import('./modules/feature/transfer/transfer.registry'))
const SupplierIndex = lazy(() => import('./modules/feature/supplier/supplier.index'))
const SupplierView = lazy(() => import('./modules/feature/supplier/supplier.registry'))
const CasheringIndex = lazy(() => import('./modules/feature/cashering/cashering.index'))
const CreditsIndex = lazy(() => import('./modules/feature/credits/credits.index'))
const CreditsView = lazy(() => import('./modules/feature/credits/credits.registry'))
const CreditsPaid = lazy(() => import('./modules/feature/credits/credits.paid'))
const RequestIndex = lazy(() => import('./modules/feature/request/request.index'))
const MonitorIndex = lazy(() => import('./modules/feature/monitor/monitor.index'))
const CustomerIndex = lazy(() => import('./modules/library/customer/customer.index'))
const CategoryIndex = lazy(() => import('./modules/library/category/category.index'))
const DiscountIndex = lazy(() => import('./modules/library/discount/discount.index'))
const MeasurementIndex = lazy(() => import('./modules/library/measurement/measurement.index'))
const AccountIndex = lazy(() => import('./modules/system/account/account.index'))
const ReportsIndex = lazy(() => import('./modules/system/reports/reports.index'))
const ActivityIndex = lazy(() => import('./modules/system/activity/activity.index'))
const ConfigIndex = lazy(() => import('./modules/system/config/config.index'))

const AppRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<UserAccount />} />
            <Route path="/print" element={<PrintBase />} >
                <Route index element={<AppEmpty />} />
                <Route path="daily-sales" >
                    <Route index element={<PrintDailySales />} />
                    <Route path=":id" element={<PrintDailySales />} />
                </Route>
                <Route path="daily-summary" >
                    <Route index element={<PrintDailySummary />} />
                    <Route path=":id" element={<PrintDailySummary />} />
                </Route>
                <Route path="daily-receivables" >
                    <Route index element={<PrintDailyReceivables />} />
                    <Route path=":id" element={<PrintDailyReceivables />} />
                </Route>
                <Route path="delivery-payables" >
                    <Route index element={<PrintDeliveryPayables />} />
                    <Route path=":id" element={<PrintDeliveryPayables />} />
                </Route>
                <Route path="delivery-received" >
                    <Route index element={<PrintDeliveryReceived />} />
                    <Route path=":id" element={<PrintDeliveryReceived />} />
                </Route>
                <Route path="inventory" >
                    <Route index element={<PrintInventory />} />
                    <Route path=":id" element={<PrintInventory />} />
                </Route>
                <Route path="receivable-collection" >
                    <Route index element={<PrintReceivableCollection />} />
                    <Route path=":id" element={<PrintReceivableCollection />} />
                </Route>
                <Route path="daily-inventory" >
                    <Route index element={<PrintDailyInventory />} />
                    <Route path=":id" element={<PrintDailyInventory />} />
                </Route>
                <Route path="daily-return" >
                    <Route index element={<PrintDailyReturn />} />
                    <Route path=":id" element={<PrintDailyReturn />} />
                </Route>
                <Route path="cheque-monitor" >
                    <Route index element={<PrintChequeMonitor />} />
                    <Route path=":id" element={<PrintChequeMonitor />} />
                </Route>
                <Route path="running-stocks" >
                    <Route index element={<PrintRunningStocks />} />
                    <Route path=":id" element={<PrintRunningStocks />} />
                </Route>
            </Route>
            <Route element={<DashboardIndex />}>
                <Route path="/dashboard" element={<DashboardPanel />} />
                <Route
                    path="/masterlist"
                    element={<AppLazy><MasterlistIndex /></AppLazy>} />
                <Route path="/inventory">
                    <Route index element={<AppLazy><InventoryIndex /></AppLazy>} />
                    <Route path="conversion" element={<AppLazy><InventoryView /></AppLazy>} />
                    <Route path=":id/history" element={<AppLazy><InventoryHistory /></AppLazy>} />
                    <Route path=":id/ledger" element={<AppLazy><InventoryLedger /></AppLazy>} />
                </Route>
                <Route path="/delivery">
                    <Route index element={<AppLazy><DeliveryIndex /></AppLazy>} />
                    <Route path=":id/view" element={<AppLazy><DeliveryView /></AppLazy>} />
                </Route>
                <Route path="/transfer">
                    <Route index element={<AppLazy><TransferIndex /></AppLazy>} />
                    <Route path=":id/view" element={<AppLazy><TransferView /></AppLazy>} />
                </Route>
                <Route path="/suppliers">
                    <Route index element={<AppLazy><SupplierIndex /></AppLazy>} />
                    <Route path=":id/view" element={<AppLazy><SupplierView /></AppLazy>} />
                    <Route path=":id/delivery" element={<AppLazy><DeliveryView /></AppLazy>} />
                </Route>
                <Route
                    path="/cashering"
                    element={<AppLazy><CasheringIndex /></AppLazy>} />
                <Route path="/credits">
                    <Route index element={<AppLazy><CreditsIndex /></AppLazy>} />
                    <Route path=":id/view" element={<AppLazy><CreditsView /></AppLazy>} />
                    <Route path=":id/paid" element={<AppLazy><CreditsPaid /></AppLazy>} />
                </Route>
                <Route
                    path="/viewer/:id"
                    element={<ViewerIndex />} />
                <Route
                    path="/returns"
                    element={<AppLazy><RequestIndex /></AppLazy>} />
                <Route
                    path="/monitor"
                    element={<AppLazy><MonitorIndex /></AppLazy>} />
                <Route
                    path="/customer"
                    element={<AppLazy><CustomerIndex /></AppLazy>} />
                <Route
                    path="/category"
                    element={<AppLazy><CategoryIndex /></AppLazy>} />
                <Route
                    path="/discount"
                    element={<AppLazy><DiscountIndex /></AppLazy>} />
                <Route
                    path="/measurement"
                    element={<AppLazy><MeasurementIndex /></AppLazy>} />
                <Route
                    path="/users"
                    element={<AppLazy><AccountIndex /></AppLazy>} />
                <Route
                    path="/reports"
                    element={<AppLazy><ReportsIndex /></AppLazy>} />
                <Route
                    path="/profile"
                    element={<AppLazy><ProfileIndex /></AppLazy>} />
                <Route
                    path="/activity"
                    element={<AppLazy><ActivityIndex /></AppLazy>} />
                <Route
                    path="/config"
                    element={<AppLazy><ConfigIndex /></AppLazy>} />
            </Route>
            <Route path="/error" element={<AppErrorFallback />} />
            <Route path="*" element={<AppPageNotFound />} />
        </Routes>
    )
}

export default AppRoute