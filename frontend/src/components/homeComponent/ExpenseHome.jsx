import { useState, useEffect } from "react";
import LineGraph from "./Graph";
import dayjs from "dayjs"; // A library for date manipulation
import ExpenseList from "../ExpenseComponent/ExpenseList";
import WeeklyAverageExpenses from "../ExpenseComponent/WeeklyExpenseAvg";

export default function ExpenseHome() {
  return (
    <div className="h-full">
      {/* Graphs Section */}
      <div className="flex flex-col md:flex-row gap-5 ">
        {/* Graph Container 1: Expense */}
        <div className="w-full h-full lg:w-[50%] border-2 border-indigo-500 rounded-lg p-1">
          <WeeklyAverageExpenses />
        </div>

        {/* Graph Container 2: Income */}
        <div className="w-full lg:w-[50%]  border-2 border-indigo-500 rounded-lg p-1">
          <WeeklyAverageExpenses />
        </div>
      </div>

      {/* Expense List Section */}
      <div className="mt-5">
        <div className="w-full border-2 border-indigo-500 rounded-lg p-2">
          <ExpenseList />
        </div>
      </div>
    </div>
  );
}
