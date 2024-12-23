import React, { useState, useEffect } from "react";
import { Layout, Typography, Button, message, Drawer, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../store/userStore";
import {
  House,
  History,
  LogOut,
  Settings,
  FileChartPie,
  ChartPie,
  AlignJustify,
} from "lucide-react";

const { Header } = Layout;
const { Text } = Typography;

export default function Navbar() {
  const navigate = useNavigate();
  const { signout } = userStore();
  const [currentContent, setCurrentContent] = useState(0);
  const [open, setOpen] = useState(false);

  const showDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const content = [
    "Track your daily expenses effortlessly!",
    "Save more with smarter budgeting.",
    "Plan your finances for a brighter future.",
    "Stay on top of your spending habits.",
    "Visualize your financial goals today!",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentContent((prev) => (prev + 1) % content.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [content.length]);

  const logout = () => {
    signout();
    message.success("User logged out successfully!");
    navigate("/signin");
  };

  const menuItems = [
    {
      label: "Home Page",
      key: "home",
      icon: <House />,
      onClick: () => navigate("/"),
    },
    {
      label: "History",
      key: "history",
      icon: <History />,
      onClick: () => navigate("/history"),
    },
    {
      label: "Analysis",
      key: "analysis",
      icon: <ChartPie />,
      onClick: () => navigate("/analysis"),
    },
    {
      label: "Report",
      key: "report",
      icon: <FileChartPie />,
      onClick: () => navigate("/report"),
    },
    {
      label: "Setting",
      key: "setting",
      icon: <Settings />,
      onClick: () => navigate("/setting"),
    },
    { label: "Sign out", key: "signout", icon: <LogOut />, onClick: logout },
  ];

  return (
    <Layout className="bg-[#D9EAFD] rounded-xl shadow-lg px-6 py-4 font-nunito">
      <Header className="bg-[#D9EAFD] flex items-center justify-between rounded-md h-[10px] md:h-[25px]">
        <div className="hidden sm:block text-center max-w-[300px]">
          <Text className="text-gray-700 text-sm font-semibold font-nunito whitespace-nowrap">
            {content[currentContent]}
          </Text>
        </div>

        <Button
          type="primary"
          onClick={showDrawer}
          icon={<AlignJustify />}
          className="block md:hidden bg-[#cfcfcf] text-red-500 item-center hover:bg-red-600 font-nunito text-xl absolute right-4 "
        />

        <Button
          onClick={logout}
          className="hidden md:block bg-[#D9EAFD] text-red-500 hover:bg-red-600 font-nunito text-sm font-semibold"
          style={{
            borderRadius: "4px",
            padding: "5px 15px",
          }}
        >
          Sign Out
        </Button>
      </Header>

      <Drawer
        title="Menu"
        placement="left"
        onClose={closeDrawer}
        open={open}
        className="font-nunito font-semibold text-red-500 my-10"
      >
        <Menu
          mode="inline"
          className="h-full border-none font-nunito bg-[#D9EAFD]"
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: item.onClick,
          }))}
        />
      </Drawer>
    </Layout>
  );
}
