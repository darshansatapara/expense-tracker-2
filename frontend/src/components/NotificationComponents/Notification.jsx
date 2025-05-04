import React from "react";
import { Modal } from "antd";

const NotificationModal = ({ showModal, notifications, onClose }) => {
  return (
    <Modal
      open={showModal}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      className="notification-modal"
    >
      <div className="bg-gradient-to-br from-purple-600 to-blue-500 p-6 rounded-lg shadow-lg">
        {notifications.length > 0 ? (
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Notification Header */}
            <h2 className="text-2xl font-bold text-white tracking-wide">
              📢 Notification
            </h2>

            {/* Date and Time */}
            <div className="flex justify-between w-full text-sm ">
              <span className=" text-purple-600  rounded-md shadow-sm font-semibold">
                 {notifications[0].date}
              </span>
              <span className=" text-white-600 px-3 py-1 rounded-md shadow-sm font-semibold">
                 {notifications[0].time}
              </span>
            </div>

            {/* Message */}
            <p className="text-lg font-medium text-white leading-relaxed">
              {notifications[0].message}
            </p>
          </div>
        ) : (
          <div className="text-center text-white">
            <p>No notifications to display</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NotificationModal;
