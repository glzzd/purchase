import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Switch } from "antd";

const EditExpenseItemModal = ({ visible, onClose, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title="Xərc Maddəsini Redaktə Et"
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Yadda saxla"
      cancelText="Ləğv et"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="itemCode"
          label="Maddə kodu"
          rules={[{ required: true, message: "Zəhmət olmasa maddə kodunu daxil edin" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Açıqlama"
          rules={[{ required: true, message: "Zəhmət olmasa açıqlama daxil edin" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Məbləğ (AZN)"
          rules={[{ required: true, message: "Zəhmət olmasa məbləği daxil edin" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="isInternal"
          label="Büdcə daxili?"
          valuePropName="checked"
        >
          <Switch checkedChildren="Daxili" unCheckedChildren="Xarici" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditExpenseItemModal;
