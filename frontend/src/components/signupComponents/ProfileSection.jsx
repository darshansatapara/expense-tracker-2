import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, DatePicker, Select, Upload, message } from "antd";
import { Mail, User, Phone, CalendarFold, ClipboardPen } from "lucide-react";
import { AiOutlinePhone, AiOutlineUpload } from "react-icons/ai";

const { Option } = Select;

export default function ProfileSection() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract user data from location.state
  const userData = location.state?.user || {};

  const [form] = Form.useForm();
  const [profilePic, setProfilePic] = useState(userData.profilePic || "");

  const handleFinish = (values) => {
    console.log("Form Submitted: ", values);
    message.success("Profile saved successfully!");
    navigate("/dashboard"); // Navigate to another page after success
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => setProfilePic(reader.result);
    reader.readAsDataURL(file);
    return false; // Prevent Ant Design's default upload behavior
  };

  return (
    <div className="min-h-screen bg-custom-bg flex items-center justify-center py-10 px-5 bg-[#D9EAFD] font-nunito">
      <div className="p-8 pt-0 max-w-lg w-full">
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
            profession: userData.profession || "",
          }}
          onFinish={handleFinish}
        >
          {/* Profile Picture */}
          <Form.Item className="text-center">
            <div className="mt-3 text-center">
              <Upload beforeUpload={handleFileUpload} showUploadList={false}>
                {/* <Button className="bg-blue-500 hover:bg-blue-600 hidden border-8 rounded-full">
                  Upload Profile Picture
                </Button> */}

                <img
                  src={
                    profilePic ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  }
                  alt="Profile"
                  className="w-24 h-24 mx-auto border-2 rounded-full border-[#79D7BE]"
                />
              </Upload>
            </div>
          </Form.Item>

          {/* Username */}
          <Form.Item
            name="username"
            label="Username "
            rules={[{ required: true, message: "Please enter your username!" }]}
            style={{ height: " 40px" }}
          >
            <Input
              prefix={<User className="text-red-500" />}
              placeholder="Name"
              disabled
              className="rounded"
            />
          </Form.Item>
          {/* Email */}
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter your email!" }]}
            style={{ height: " 40px", marginTop: "40px" }}
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
            style={{ height: " 40px", marginTop: "40px" }}
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
            style={{ height: " 40px", marginTop: "40px" }}
          >
            <DatePicker
              prefix={<CalendarFold className="text-sky-400" />}
              className="w-full rounded"
            />
          </Form.Item>

          {/* Category */}
          <Form.Item
            name="profession"
            label="Profession"
            rules={[{ required: true, message: "Please select a category!" }]}
            style={{ height: " 40px", marginTop: "40px" }}
          >
            <Select
              prefix={<ClipboardPen className="text-pink-600" />}
              placeholder="Select a category"
              className="rounded-md border-none font-nunito font-semibold"
            >
              <Option value="student">Student</Option>
              <Option value="student">Employee</Option>
              <Option value="professional">Elder</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="bg-blue-500 hover:bg-blue-600 text-white rounded mt-9"
            >
              Save Profile
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
