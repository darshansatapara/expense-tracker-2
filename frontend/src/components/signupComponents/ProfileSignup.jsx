import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, DatePicker, Select, Upload, message } from "antd";
import {
  Mail,
  User,
  Phone,
  CalendarFold,
  ClipboardPen,
  Lock,
} from "lucide-react";
import { userStore } from "../../store/userStore.js";

const { Option } = Select;

export default function ProfileSignup() {
  const location = useLocation();
  const navigate = useNavigate();
  const signup = userStore((state) => state.signup);

  const userData = location.state?.user || {};
  const [form] = Form.useForm();
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(false);
  const handleFileUpload = (file) => {
    // console.log(file);
    const rawFile = file.originFileObj || file; // Access the raw file

    if (!rawFile) return;

    const reader = new FileReader();

    reader.readAsDataURL(rawFile);

    reader.onload = () => {
      const base64Image = reader.result;
      // console.log(base64Image);
      setProfilePic(base64Image);
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      message.error("Failed to read the file. Please try again.");
    };

    return false; // Prevent the default upload behavior
  };

  const handleFinish = async (values) => {
    setLoading(true);

    const payload = {
      ...values,
      profilePic,
    };

    try {
      await signup(payload);
      message.success("Profile saved successfully!");
      navigate("/cetegory");
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-custom-bg flex items-center justify-center py-10 px-5 bg-[#D9EAFD] font-nunito">
      <div className="bg-[#78B3CE] p-5 rounded-lg max-w-lg w-full">
        <h1 className="text-center text-2xl font-semibold text-gray-700 mb-6">
          Complete Your Profile
        </h1>

        <Form
          className="font-nunito"
          form={form}
          layout="vertical"
          initialValues={{
            profilePic: userData.profilePic || "",
            username: userData.name || "",
            email: userData.email || "",
            mobile_no: userData.mobile_no || "",
            date_of_birth: userData.date_of_birth || null,
            category: userData.category || "",
          }}
          onFinish={handleFinish}
        >
          {/* Profile Picture */}
          <Form.Item>
            <div className="text-center">
              <Upload
                beforeUpload={handleFileUpload}
                showUploadList={false}
                accept="image/*"
              >
                <Button className="hidden" />
                <img
                  src={
                    profilePic ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full mx-auto border-4 border-[#79D7BE] object-contain"
                />
              </Upload>
            </div>
          </Form.Item>

          {/* Username */}
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input
              prefix={<User className="text-red-500" />}
              placeholder="Username"
              disabled
              className="rounded"
            />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input
              prefix={<Mail className="text-blue-500" />}
              placeholder="Email"
              disabled
              className="rounded"
            />
          </Form.Item>

          {/* Mobile Number */}
          <Form.Item
            name="mobile_no"
            label="Mobile Number"
            rules={[
              { required: true, message: "Please enter your mobile number!" },
            ]}
          >
            <Input
              prefix={<Phone className="text-green-500" />}
              placeholder="Mobile Number"
              className="rounded"
            />
          </Form.Item>

          {/* Date of Birth */}
          <Form.Item
            name="date_of_birth"
            label="Date of Birth"
            rules={[
              { required: true, message: "Please select your date of birth!" },
            ]}
          >
            <DatePicker
              className="w-full rounded"
              prefix={<CalendarFold className="text-purple-400" />}
            />
          </Form.Item>

          {/* Category */}
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select
              placeholder="Select a Profession"
              className="rounded-md"
              prefix={<ClipboardPen className="text-pink-700" />}
            >
              <Option value="student">Student</Option>
              <Option value="employee">Employee</Option>
              <Option value="householder">Householder</Option>
            </Select>
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter your password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
              {
                pattern:
                  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                message:
                  "Password must contain letters, numbers, and a special character!",
              },
            ]}
          >
            <Input.Password
              prefix={<Lock className="text-blue-500" />}
              placeholder="Enter your password"
              className="rounded"
              visibilityToggle
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="bg-blue-500 hover:bg-blue-600 text-white rounded mt-3 font-semibold"
              loading={loading}
            >
              Complete Signup
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
