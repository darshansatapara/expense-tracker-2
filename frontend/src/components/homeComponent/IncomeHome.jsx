import React from "react";
import LineGraph from "./Graph";
import ExpenseList from "../ExpenseComponent/ExpenseList";
import { Card } from "antd";

export default function IncomeHome() {
  return (
    <div className="pt-4 bg-[#fff] min-h-full ">
      {/* Graphs Section */}
      <div className="flex flex-col md:flex-row gap-10 ">
        {/* Graph Container 1: Expense */}
        <Card className="w-full h-full lg:w-[48%] border-2 border-indigo-500  ">
          <LineGraph
            title="Expense"
            // Light blue background for Expense graph
          />
        </Card>

        {/* Graph Container 2: Income */}
        <Card className="w-full lg:w-[48%]  border-2 border-indigo-500">
          <LineGraph
            title="Income"
            bgColor="bg-green-100" // Light green background for Income graph
          />
        </Card>
      </div>

      {/* Expense List Section */}
      <div className="mt-14">
        <Card className="w-full  border-2 border-indigo-500">
          <ExpenseList />
        </Card>
      </div>

      {/* Additional Graphs Section */}
      <div className="flex flex-col md:flex-row gap-10 mt-14">
        {/* Graph Container 3: Expense */}
        <Card className="w-full md:w-[48%]  border-2 border-indigo-500 ">
          <LineGraph
            title="Expense"
            bgColor="bg-blue-100" // Light blue background for Expense graph
          />
        </Card>

        {/* Graph Container 4: Income */}
        <Card className="w-full md:w-[48%] border-2 border-indigo-500">
          <LineGraph
            title="Income"
            bgColor="bg-green-100" // Light green background for Income graph
          />
        </Card>
      </div>
    </div>
  );
}
