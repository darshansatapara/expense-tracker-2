import React from "react";
import LineGraph from "./Graph";
import ExpenseList from "../ExpenseComponent/ExpenseList";
import { Card } from "antd";

export default function Main() {
  return (
    <div className="p-4  gap-10 bg-gray-100 min-h-screen">
      {/* Graphs Section */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Graph Container 1: Expense */}
        <Card className="w-full h-full lg:w-[48%]  border  border-blue-400">
          <LineGraph
            title="Expense"
            // Light blue background for Expense graph
          />
        </Card>

        {/* Graph Container 2: Income */}
        <Card className="w-full lg:w-[48%] bg-green-100 border border-green-400">
          <LineGraph
            title="Income"
            bgColor="bg-green-100" // Light green background for Income graph
          />
        </Card>
      </div>

      {/* Expense List Section */}
      <div className="mt-14">
        <Card className="w-full bg-[#D9D9D9] border border-green-400">
          <ExpenseList />
        </Card>
      </div>

      {/* Additional Graphs Section */}
      <div className="flex flex-col md:flex-row gap-10 mt-14">
        {/* Graph Container 3: Expense */}
        <Card className="w-full md:w-[48%] bg-blue-100 border  border-blue-400">
          <LineGraph
            title="Expense"
            bgColor="bg-blue-100" // Light blue background for Expense graph
          />
        </Card>

        {/* Graph Container 4: Income */}
        <Card className="w-full md:w-[48%] bg-green-100 border border-green-400">
          <LineGraph
            title="Income"
            bgColor="bg-green-100" // Light green background for Income graph
          />
        </Card>
      </div>
    </div>
  );
}
