// components/AddExpenseItemModal.jsx
import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, Switch } from "antd";

const AddExpenseItemModal = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Yeni Xərc Maddəsi əlavə et"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Əlavə et"
      cancelText="Ləğv et"
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Maddə kodu"
          name="itemCode"
          rules={[{ required: true, message: "Maddə kodunu daxil edin" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Açıqlama" name="description">
          <Input.TextArea />
        </Form.Item>
        <div className="flex gap-4 justify-center">

        <Form.Item
          label="Məbləğ"
          name="amount" 
          rules={[{ required: true, message: "Məbləği daxil edin" }]}
          >
          <InputNumber className="w-full" min={0} />
        </Form.Item>
        <Form.Item
          label="Büdcə daxili?"
          name="isInternal"
          valuePropName="checked"
          >
          <Switch defaultChecked />
        </Form.Item>
            </div>
      </Form>
    </Modal>
  );
};

export default AddExpenseItemModal;
