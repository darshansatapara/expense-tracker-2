import React, { useEffect, useState } from "react";
import { userCategoryStore } from "../../store/UserStore/userCategoryStore.js";
import { adminCategoryStore } from "../../store/AdminStore/adminCategoryStore.js";
import { Button, Modal, Select, Table, message } from "antd";

function CurrencyManagement() {
  const [currency, setCurrency] = useState("");
  const [adminCurrencies, setAdminCurrencies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);

  const {
    fetchCurrencyAndBudget,
    updateCurrencyAndBudget,
    deleteCurrencyAndBudget,
  } = userCategoryStore();
  const { fetchCurrencyCategories, allCurrencyCategories } =
    adminCategoryStore();

  const userId = "677bc096bd8c6f677ef507d3";

  useEffect(() => {
    const fetching = async () => {
      const userCurrency = await fetchCurrencyAndBudget(userId);
      setCurrency(userCurrency);
      await fetchCurrencyCategories();
    };
    fetching();
  }, []);

  useEffect(() => {
    if (allCurrencyCategories?.currencies) {
      setAdminCurrencies(allCurrencyCategories.currencies);
    }
  }, [allCurrencyCategories]);

  const handleAddCurrency = async () => {
    if (!selectedCurrencyId) {
      message.error("Please select a currency to add!");
      return;
    }
    const payload = { newCurrencyCategoryIds: [selectedCurrencyId] };
    try {
      await updateCurrencyAndBudget(userId, payload);
      const selectedCurrency = adminCurrencies.find(
        (c) => c._id === selectedCurrencyId
      );
      setCurrency({
        ...currency,
        currencyCategory: [
          ...(currency.currencyCategory || []),
          { currencyId: selectedCurrency, isCurrencyActive: true },
        ],
      });
      setIsModalOpen(false);
      setSelectedCurrencyId(null);
      message.success("Currency added successfully!");
    } catch (error) {
      message.error("Failed to add currency. Please try again.");
      console.error("Error adding currency:", error);
    }
  };

  const handleDeleteCurrency = async (currencyId) => {
    if (
      currency.defaultCurrency &&
      currency.defaultCurrency._id === currencyId
    ) {
      message.error(
        "Cannot delete the default currency. Please set another default first."
      );
      return;
    }
    try {
      const payload = { deleteCurrencyCategoryIds: [currencyId] };
      await deleteCurrencyAndBudget(userId, payload);

      // Update local state by removing the deleted currency
      const updatedCurrencies = (currency.currencyCategory || []).filter(
        (c) => c.currencyId._id !== currencyId
      );
      setCurrency({ ...currency, currencyCategory: updatedCurrencies });

      message.success("Currency deleted successfully!");
    } catch (error) {
      message.error("Failed to delete currency. Please try again.");
      console.error("Error deleting currency:", error);
    }
  };

  const handleSetDefault = async (currencyId) => {
    const selectedCurrency = adminCurrencies.find((c) => c._id === currencyId);
    if (
      currency.defaultCurrency &&
      currency.defaultCurrency._id === currencyId
    ) {
      message.info("This is already the default currency!");
      return;
    }
    try {
      await updateCurrencyAndBudget(userId, { defaultCurrency: currencyId });
      setCurrency({ ...currency, defaultCurrency: selectedCurrency });
      message.success(`${selectedCurrency.name} set as default currency!`);
    } catch (error) {
      message.error("Failed to set default currency. Please try again.");
      console.error("Error setting default currency:", error);
    }
  };

  const columns = [
    {
      title: "Currency",
      dataIndex: ["currencyId", "name"],
      key: "name",
      render: (text, record) =>
        `${record.currencyId.name} (${record.currencyId.symbol})`,
    },
    {
      title: "Code",
      dataIndex: ["currencyId", "currency"],
      key: "currency",
    },
    {
      title: "Status",
      dataIndex: "isCurrencyActive",
      key: "isCurrencyActive",
      render: (isActive) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Default",
      key: "isDefault",
      render: (_, record) =>
        currency.defaultCurrency &&
        currency.defaultCurrency._id === record.currencyId._id ? (
          <span className="text-blue-600 font-semibold">Yes</span>
        ) : (
          "No"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="link"
            danger
            onClick={() => handleDeleteCurrency(record.currencyId._id)}
            disabled={
              !record.isCurrencyActive ||
              (currency.defaultCurrency &&
                currency.defaultCurrency._id === record.currencyId._id)
            }
          >
            Delete
          </Button>
          <Button
            type="link"
            onClick={() => handleSetDefault(record.currencyId._id)}
            disabled={
              !record.isCurrencyActive ||
              (currency.defaultCurrency &&
                currency.defaultCurrency._id === record.currencyId._id)
            }
          >
            Set Default
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Currency Management
          </h1>
          <Button
            type="primary"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsModalOpen(true)}
          >
            Add Currency
          </Button>
        </div>
        {currency.defaultCurrency && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">
              Default Currency
            </h2>
            <p className="text-gray-600">
              {currency.defaultCurrency.name} ({currency.defaultCurrency.symbol}
              ) - {currency.defaultCurrency.currency}
            </p>
          </div>
        )}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Table
            dataSource={currency.currencyCategory || []}
            columns={columns}
            rowKey={(record) => record.currencyId._id}
            pagination={false}
            className="overflow-x-auto"
            locale={{ emptyText: "No currencies selected yet." }}
          />
        </div>
        <Modal
          title="Add New Currency"
          open={isModalOpen}
          onOk={handleAddCurrency}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedCurrencyId(null);
          }}
          okText="Add"
          cancelText="Cancel"
        >
          <Select
            placeholder="Select a currency"
            style={{ width: "100%" }}
            onChange={(value) => setSelectedCurrencyId(value)}
            value={selectedCurrencyId}
            showSearch
            optionFilterProp="children"
          >
            {Array.isArray(adminCurrencies) &&
              adminCurrencies
                .filter((adminCurrency) => {
                  const selectedCurrencyIds = new Set(
                    (currency.currencyCategory || []).map((userCurrency) =>
                      userCurrency?.currencyId?._id?.toString()
                    )
                  );
                  return !selectedCurrencyIds.has(adminCurrency._id.toString());
                })
                .map((filteredCurrency) => (
                  <Select.Option
                    key={filteredCurrency._id}
                    value={filteredCurrency._id}
                  >
                    {`${filteredCurrency.name} (${filteredCurrency.symbol}) - ${filteredCurrency.currency}`}
                  </Select.Option>
                ))}
          </Select>
        </Modal>
      </div>
    </div>
  );
}

export default CurrencyManagement;
