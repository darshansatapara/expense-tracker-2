import React from "react";
import LineGraph from "./Graph";
import ExpenseList from "../ExpenseComponent/ExpenseList";
import { Card } from "antd";

export default function Main() {
  function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0"); // Ensures two digits
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
  }

  return (
    <div className=" p-4 gap-10 bg-gray-100 min-h-screen">
      {/* Graph Container 1: Expense */}
      <div className="flex gap-10 ">
        <Card className=" sm:w-full lg:w-[48%] bg-blue-100 border border-blue-400 ">
          <LineGraph
            title="Expense"
            bgColor="bg-blue-100" // Light blue background for Expense graph
          />
        </Card>

        {/* Graph Container 2: Income */}
        <Card className=" sm:w-full lg:w-[48%]  bg-green-100 border border-green-400">
          <LineGraph
            title="Income"
            bgColor="bg-green-100" // Light green background for Income graph
          />
        </Card>
      </div>
      {/* Expense List */}
      <div className="flex mt-14 justify-center ">
        <Card className="w-full bg-[#D9D9D9] border border-green-400">
          <ExpenseList
            userId="67792e48b3085a94fc47b110"
            startDate="05-01-2025"
            endDate="05-01-2025"
          />
        </Card>
      </div>
      <div className="flex gap-10 mt-14 ">
        <Card className=" sm:w-full lg:w-[48%] bg-blue-100 border border-blue-400 ">
          <LineGraph
            title="Expense"
            bgColor="bg-blue-100" // Light blue background for Expense graph
          />
        </Card>

        {/* Graph Container 2: Income */}
        <Card className=" sm:w-full lg:w-[48%]  bg-green-100 border border-green-400">
          <LineGraph
            title="Income"
            bgColor="bg-green-100" // Light green background for Income graph
          />
        </Card>
      </div>
    </div>
  );
}
