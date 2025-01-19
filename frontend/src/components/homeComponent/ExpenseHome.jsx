import React from "react";
import LineGraph from "./Graph";
import ExpenseList from "../ExpenseComponent/ExpenseList";
import { Card } from "antd";

export default function ExpenseHome() {
  return (
    <div className="h-full overflow-auto">
      {/* Graphs Section */}
      <div className="flex flex-col md:flex-row gap-5 ">
        {/* Graph Container 1: Expense */}
        <div className="w-full h-full lg:w-[50%] border-2 border-indigo-500 rounded-lg p-1">
          <LineGraph
            title="Expense"
            // Light blue background for Expense graph
          />
        </div>

        {/* Graph Container 2: Income */}
        <div className="w-full lg:w-[50%]  border-2 border-indigo-500 rounded-lg p-1">
          <LineGraph
            title="Income"
            bgColor="bg-green-100" // Light green background for Income graph
          />
        </div>
      </div>

      {/* Expense List Section */}
      <div className="mt-5">
        <div className="w-full border-2 border-indigo-500 rounded-lg p-2">
          <ExpenseList />
        </div>
      </div>

      {/* Additional Graphs Section */}
      <div className="flex flex-col md:flex-row gap-5 mt-5 ">
        {/* Graph Container 3: Expense */}
        <div className="w-full md:w-[50%]  border-2 border-indigo-500 rounded-lg ">
          <LineGraph
            title="Expense"
            bgColor="bg-blue-100" // Light blue background for Expense graph
          />
        </div>

        {/* Graph Container 4: Income */}
        <div className="w-full md:w-[50%] border-2 border-indigo-500 rounded-lg ">
          <LineGraph
            title="Income"
            bgColor="bg-green-100" // Light green background for Income graph
          />
        </div>
      </div>
    </div>
  );
}
