import Sidebar from "../components/Layout/SideBar";
import TopCard from "../components/Layout/TopCard";
import ReportsHeader from "../components/Composite/ReportsHeader";
import { useState, useEffect } from "react";
import {getReports} from "../data/mockAPI/getReports";
import ReportExpenditures from "../components/Composite/ReportExpenditures";

export default function Reports() {

    const [filters, setFilters] = useState({
        paycode: "",
        type: "expenditures",
    });
    
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (!filters.paycode) return;

        setLoading(true);

        getReports(filters)
        .then(setRows)
        .finally(()=>setLoading(false));
    }, [filters]);

    return(
        <div className="flex flex-col md:flex-row gap-2 px-2 md:px-0">
            <Sidebar />

            <div className="bg-bgshade min-h-screen w-full md:px-4 overflow-x-hidden">
                <div className="container flex flex-col gap-6">
                    {/* PAGE HEADER */}
                    <TopCard 
                    title="REPORTS"
                    />

                    {/* REPORT HEADER */}
                    <ReportsHeader
                    filters={filters}
                    onChange={setFilters}
                    />

                    {filters.type === "expenditures" &&(
                    <ReportExpenditures
                    filters={filters}
                    />
                    )}
                </div>
            </div>
        </div>
    );
}