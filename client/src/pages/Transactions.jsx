import { useState, useEffect } from "react";
import Sidebar from "../components/Layout/SideBar";
import TopCard from "../components/Layout/TopCard";
import RecentTransactionsTable from "../components/Composite/RecentTransactionsTable";
import { fetchTransactions } from "../../../server/api/transactionsAPI";
//import { recentTransactionsMock } from "../data/mockAPI/recentTransactionsMock";

export default function Transactions(){

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load(){
            try{
                const data = await fetchTransactions();
                setTransactions(data);
            } catch (err){
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return (
        <div className="flex flex-col md:flex-row gap-2 px-2 md:py-0 md:px-0">
            <Sidebar />

        <div className="bg-bgshade min-h-screen w-full md:px-4">

        <div className="container flex flex-col gap-6">
            <TopCard title="TRANSACTIONS" />

                      {loading && (
            <div className="bg-bg p-6 rounded-md shadow-md text-gray-500">
              Loading transactions…
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-6 rounded-md shadow-md">
              {error}
            </div>
          )}

          {!loading && !error && (
            <RecentTransactionsTable transactions={transactions} />
          )}

        </div>
        </div>
            

        </div>
    );
}