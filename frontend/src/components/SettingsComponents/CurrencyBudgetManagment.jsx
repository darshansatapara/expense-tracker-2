import React, { useEffect, useState } from "react";
import { userCategoryStore } from "../../store/UserStore/userCategoryStore.js";
import { adminCategoryStore } from "../../store/AdminStore/adminCategoryStore.js";
import { Button, Modal, Select, Table, InputNumber, message } from "antd";
import { userStore } from "../../store/UserStore/userAuthStore";
function CurrencyManagement() {
  const { currentUser } = userStore();
  const [currency, setCurrency] = useState({});
  const [adminCurrencies, setAdminCurrencies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);
  const [onlineBudget, setOnlineBudget] = useState(""); // Start empty, fill from fetch
  const [offlineBudget, setOfflineBudget] = useState(""); // Start empty, fill from fetch
  const [loading, setLoading] = useState(true);

  const {
    fetchCurrencyAndBudget,
    updateCurrencyAndBudget,
    deleteCurrencyAndBudget,
  } = userCategoryStore();
  const { fetchCurrencyCategories, allCurrencyCategories } = adminCategoryStore();

  const userId = currentUser?._id;

  useEffect(() => {
    const fetching = async () => {
      try {
        const userCurrency = await fetchCurrencyAndBudget(userId);
        setCurrency(userCurrency || {});
        if (userCurrency?.budget?.length > 0) {
          setOnlineBudget(parseInt(userCurrency.budget[0].onlineBudget) || "");
          setOfflineBudget(parseInt(userCurrency.budget[0].offlineBudget) || "");
        }
        await fetchCurrencyCategories();
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetching();
  }, [fetchCurrencyAndBudget, fetchCurrencyCategories]);

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
    if (currency.defaultCurrency && currency.defaultCurrency._id === currencyId) {
      message.error(
        "Cannot delete the default currency. Please set another default first."
      );
      return;
    }
    try {
      const payload = { deleteCurrencyCategoryIds: [currencyId] };
      await deleteCurrencyAndBudget(userId, payload);
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
    if (currency.defaultCurrency && currency.defaultCurrency._id === currencyId) {
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

  const handleBudgetUpdate = async () => {
    if (!onlineBudget || !offlineBudget || onlineBudget < 500 || offlineBudget < 500) {
      message.error("Budgets must be at least 500 and cannot be empty.");
      return;
    }
    try {
      const budgetPayload = { onlineBudget, offlineBudget };
      await updateCurrencyAndBudget(userId, budgetPayload);
      setCurrency({
        ...currency,
        budget: [{ onlineBudget, offlineBudget }],
      });
      message.success("Budgets updated successfully!");
    } catch (error) {
      message.error("Failed to update budgets. Please try again.");
      console.error("Error updating budgets:", error);
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
          className={`px-2 py-1 rounded-full text-xs font-semibold ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Currency and Budget Management
          </h1>
        </div>

        {/* Budget Management Section */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Budget Management
          </h2>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Online Budget (min 500)
              </label>
              <InputNumber
                value={onlineBudget}
                min={500}
                onChange={(value) => setOnlineBudget(value || "")}
                className="w-full"
                formatter={(value) => (value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                placeholder="Enter online budget"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Offline Budget (min 500)
              </label>
              <InputNumber
                value={offlineBudget}
                min={500}
                onChange={(value) => setOfflineBudget(value || "")}
                className="w-full"
                formatter={(value) => (value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                placeholder="Enter offline budget"
              />
            </div>
          </div>
          <Button
            type="primary"
            className="bg-green-600 hover:bg-green-700"
            onClick={handleBudgetUpdate}
          >
            Update Budgets
          </Button>
        </div>

        {/* Add Currency Button (After Budget Management) */}
        <div className="mb-6 flex justify-end">
          <Button
            type="primary"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsModalOpen(true)}
          >
            Add Currency
          </Button>
        </div>

        {/* Default Currency Section */}
        {currency.defaultCurrency && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">
              Default Currency
            </h2>
            <p className="text-gray-600">
              {currency.defaultCurrency.name} ({currency.defaultCurrency.symbol}) -{" "}
              {currency.defaultCurrency.currency}
            </p>
          </div>
        )}

        {/* Currency Table */}
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

        {/* Add Currency Modal */}
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