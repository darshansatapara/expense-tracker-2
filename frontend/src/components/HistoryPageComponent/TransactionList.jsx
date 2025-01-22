import React, { useState } from "react";
import { Table, Button, Select } from "antd";

export const TransactionList = ({ transactions, isExpense }) => {
  const [selectedMode, setSelectedMode] = useState("All");

  // Filter transactions based on the selected mode
  const filteredTransactions =
    selectedMode === "All"
      ? transactions
      : transactions.filter(
          (transaction) =>
            transaction.mode?.toLowerCase() === selectedMode.toLowerCase()
        );
  // Define the columns with Ant Design filter for "Mode"
  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <span>₹{amount ? parseFloat(amount).toFixed(2) : "N/A"}</span>
      ),
    },
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
      filters: [
        { text: "Online", value: "Online" },
        { text: "Offline", value: "Offline" },
      ],
      filterMultiple: false, // Allow single selection
      onFilter: (value, record) =>
        record.mode?.toLowerCase() === value.toLowerCase(),
      filterDropdown: ({ confirm }) => (
        <div className="flex flex-col items-start p-1  bg-white shadow-md rounded-md">
          <Select
            id="mode-filter"
            value={selectedMode}
            onChange={(value) => {
              setSelectedMode(value);
              confirm();
            }}
            style={{
              minWidth: "100%",
              maxWidth: "100%",
              marginTop: "2%",
            }}
            options={[
              { value: "All", label: "All" },
              { value: "Online", label: "Online" },
              { value: "Offline", label: "Offline" },
            ]}
          />
        </div>
      ),
    },

    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => <span>{category || "N/A"}</span>,
    },
    ...(isExpense
      ? [
          {
            title: "Sub-Category",
            dataIndex: "subcategory",
            key: "subcategory",
            render: (subcategory) => <span>{subcategory || "N/A"}</span>,
          },
        ]
      : []),
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="link" className="text-blue-500 hover:underline">
          View & Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-2">
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredTransactions.map((transaction, index) => ({
            ...transaction,
            key: index, // Unique key for each row
          }))}
          pagination={false}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          }
          className="border-collapse  w-full table-auto"
        />
      </div>
    </div>
  );
};
