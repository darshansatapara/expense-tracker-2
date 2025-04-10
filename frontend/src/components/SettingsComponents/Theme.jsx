// import React, { useState, useEffect } from 'react';
// import { Switch, Select, Slider } from 'antd'; // Ant Design's components
// import { SunOutlined, MoonOutlined } from '@ant-design/icons'; // Icons for light and dark mode

// const { Option } = Select;

// const ThemeSetting = () => {
//   // State variables for theme and font settings
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [fontFamily, setFontFamily] = useState('Nunito');
//   const [fontSize, setFontSize] = useState(16); // Font size in px
//   const [fontColor, setFontColor] = useState('#696d75'); // Light text color by default

//   // Load saved theme and settings from localStorage
//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     const savedFontFamily = localStorage.getItem('fontFamily');
//     const savedFontSize = localStorage.getItem('fontSize');
//     const savedFontColor = localStorage.getItem('fontColor');

//     if (savedTheme === 'dark') {
//       setIsDarkMode(true);
//       document.body.classList.add('dark');
//     } else {
//       document.body.classList.remove('dark');
//     }

//     if (savedFontFamily) setFontFamily(savedFontFamily);
//     if (savedFontSize) setFontSize(Number(savedFontSize));
//     if (savedFontColor) setFontColor(savedFontColor);
//   }, []);

//   // Toggle theme (dark/light mode)
//   const toggleTheme = (checked) => {
//     setIsDarkMode(checked);
//     if (checked) {
//       document.body.classList.add('dark');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       document.body.classList.remove('dark');
//       localStorage.setItem('theme', 'light');
//     }
//   };

//   // Handle font family change
//   const handleFontFamilyChange = (value) => {
//     setFontFamily(value);
//     localStorage.setItem('fontFamily', value);
//   };

//   // Handle font size change
//   const handleFontSizeChange = (value) => {
//     setFontSize(value);
//     localStorage.setItem('fontSize', value);
//   };

//   // Handle font color change
//   const handleFontColorChange = (value) => {
//     setFontColor(value);
//     localStorage.setItem('fontColor', value);
//   };

//   return (
//     <div
//       className="min-h-screen flex justify-center items-start bg-light-bg dark:bg-dark-bg transition-all duration-300 p-8"
//       style={{ fontFamily }}
//     >
//       <div className="w-full max-w-md">
//         <h2 className="text-3xl font-bold text-left text-light-text dark:text-dark-text mb-6">
//           Theme Settings
//         </h2>
//         <p className="text-left mt-2 text-light-text dark:text-dark-text mb-8">
//           Customize your theme, font size, and font color.
//         </p>

//         <div className="mt-6">
//           <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Theme Mode</h3>
//           <div className="flex items-center justify-between mt-4">
//             <span className="text-sm text-light-text dark:text-dark-text">Light Mode</span>
//             <Switch
//               checked={isDarkMode}
//               onChange={toggleTheme}
//               checkedChildren={<MoonOutlined />}
//               unCheckedChildren={<SunOutlined />}
//             />
//             <span className="text-sm text-light-text dark:text-dark-text">Dark Mode</span>
//           </div>
//         </div>

//         <div className="mt-6">
//           <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Font Family</h3>
//           <Select
//             value={fontFamily}
//             onChange={handleFontFamilyChange}
//             className="w-full mt-2"
//             style={{ fontFamily }}
//           >
//             <Option value="Nunito">Nunito</Option>
//             <Option value="Roboto">Roboto</Option>
//             <Option value="Arial">Arial</Option>
//             <Option value="Courier New">Courier New</Option>
//           </Select>
//         </div>

//         <div className="mt-6">
//           <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Font Size</h3>
//           <Slider
//             min={12}
//             max={30}
//             value={fontSize}
//             onChange={handleFontSizeChange}
//             tooltipVisible
//             className="mt-2"
//           />
//         </div>

//         <div className="mt-6">
//           <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Font Color</h3>
//           <input
//             type="color"
//             value={fontColor}
//             onChange={(e) => handleFontColorChange(e.target.value)}
//             className="w-full mt-2 border-none"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ThemeSetting;
