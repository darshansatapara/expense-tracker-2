import React, { useState } from "react";
import { Input } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  size,
  required,
}) {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <Input
      type={visible ? "text" : "password"}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      size={size || "large"}
      className="rounded-md"
      required={required}
      suffix={
        visible ? (
          <EyeOutlined
            onClick={toggleVisibility}
            style={{ cursor: "pointer" }}
          />
        ) : (
          <EyeInvisibleOutlined
            onClick={toggleVisibility}
            style={{ cursor: "pointer" }}
          />
        )
      }
    />
  );
}
