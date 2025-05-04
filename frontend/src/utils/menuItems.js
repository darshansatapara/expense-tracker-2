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
