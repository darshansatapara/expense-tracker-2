import React from "react";
import { Input, Button } from "antd";
import { Mail, Lock } from "lucide-react";

export default function First() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#D9EAFD] font-Mono">
      <div className=" p-8  rounded-md  w-96 ">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center mb-5">
          Welcome Back!
        </h2>
        <p className="text-gray-600 text-center mb-7">
          Login to your account to continue
        </p>
        <form>
          <div className="mb-7">
            <Input
              prefix={<Mail className="text-blue-500" />}
              placeholder="Email"
              size="large"
              className="rounded-md"
            />
          </div>
          <div className="mb-7">
            <Input.Password
              prefix={<Lock className="text-yellow-500" />}
              placeholder="Password"
              size="large"
              className="rounded-md"
            />
          </div>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 border-none text-white font-semibold rounded-md hover:from-purple-600 hover:to-pink-600"
          >
            Sent OTP
          </Button>
        </form>
        <div className="text-center mt-7">
          <p className="text-gray-600">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
