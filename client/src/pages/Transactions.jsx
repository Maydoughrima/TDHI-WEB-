import Sidebar from "../components/Layout/SideBar";
import TopCard from "../components/Layout/TopCard";
import RecentTransactionsTable from "../components/Composite/RecentTransactionsTable";
import { recentTransactionsMock } from "../data/mockAPI/recentTransactionsMock";

export default function Transactions(){
    return (
        <div className="flex flex-col md:flex-row gap-2 px-2 md:py-0 md:px-0">
            <Sidebar />

        <div className="bg-bgshade min-h-screen w-full md:px-4">

        <div className="container flex flex-col gap-6">
            <TopCard title="TRANSACTIONS" />

            <RecentTransactionsTable
            transactions={recentTransactionsMock}
            />

        </div>
        </div>
            

        </div>
    );
}