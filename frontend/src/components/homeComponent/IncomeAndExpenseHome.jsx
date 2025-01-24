import { useEffect, useState } from "react";
import TableList from "./TableList";
import TotalDataCard from "./TotalDataCard";

export default function IncomeAndExpenseHome({ activeTab, filteredData }) {
  // console.log(activeTab, filteredData);
  const [weeklyTotal, setweeklyTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  const [todayData, setTodayData] = useState([]);
  const [yesterdayData, setYesterdayData] = useState([]);

  useEffect(() => {
    if (filteredData) {
      setweeklyTotal(filteredData.currentWeek.totals);
      setMonthlyTotal(filteredData.currentMonth.totals);
      setTodayData(filteredData.today);
      setYesterdayData(filteredData.yesterday);
    }
  }, [filteredData]);

  // console.log("Active Tab:", activeTab);
  // console.log("Weekly Total:", weeklyTotal);
  // console.log("Monthly Total:", monthlyTotal);
  // console.log("todayData", todayData);
  // console.log("yesterdayData", yesterdayData);
  return (
    <div className="h-full">
      {/* Graphs Section */}
      <div className="flex flex-col md:flex-row gap-5 ">
        {/* Graph Container 1: Expense */}
        <div className="w-full h-full lg:w-[49%] border-2 border-indigo-500 rounded-lg p-1">
          {/* // weekly expense or income card  */}
          <TotalDataCard cardData={weeklyTotal} lable="Weekly" />
        </div>

        {/* Graph Container 2: Income */}
        <div className="w-full lg:w-[49%]  border-2 border-indigo-500 rounded-lg p-1">
          {/* // monthly expense or income card  */}

          <TotalDataCard cardData={monthlyTotal} lable="Monthly" />
        </div>
      </div>

      {/* Expense List Section */}
      <div className="mt-5">
        <div className="border-2 border-indigo-500 rounded-lg p-3">
          <TableList
            today={todayData}
            yesterday={yesterdayData}
            activeTab={activeTab === "Expense" ? true : ""}
          />
        </div>
      </div>
    </div>
  );
}
