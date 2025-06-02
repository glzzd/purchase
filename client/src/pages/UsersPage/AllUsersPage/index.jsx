import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Button, Tooltip, Modal, Input, Form, message, Checkbox, Select } from "antd";
import { Info, Plus } from "lucide-react";
import axios from "axios";

ModuleRegistry.registerModules([AllCommunityModule]);

const AllUsersPage = () => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [passwordForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [form] = Form.useForm();

  const columnDefs = [
    { headerName: "Ad", field: "name", flex: 1 },
    { headerName: "Soyad", field: "surname", flex: 1 },
    { headerName: "Email", field: "email", flex: 1 },
    { headerName: "Rol", field: "systemRole", flex: 1 },
    {
      headerName: "Əməliyyat",
      field: "edit",
      cellRenderer: (params) => {
        return (
          <div className="flex gap-2 items-center">
            <Button
              style={{
                backgroundColor: "goldenrod",
                color: "#242424",
              }}
              type="text"
              onClick={() => handleEdit(params.data)}
            >
              Redaktə Et
            </Button>
            <Button
              style={{
                backgroundColor: "#3B82F6",
                color: "white",
              }}
              type="text"
              onClick={() => openPasswordModal(params.data)}
            >
              Şifrəni Dəyiş
            </Button>
          </div>
        );
      },
      flex: 1,
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://localhost:5001/api/user/all-users")
      .then((res) => {
        setRowData(res.data.users || []);
      })
      .catch((err) => {
        console.error("İstifadəçilər yüklənərkən xəta baş verdi:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleUpdate = () => {
    form.validateFields().then((values) => {
      axios
        .post(`http://localhost:5001/api/user/update`, {
          ...values,
          _id: editingUser._id,
        })
        .then(() => {
          message.success("İstifadəçi uğurla yeniləndi");
          setIsModalVisible(false);
          fetchUsers();
        })
        .catch(() => {
          message.error("Yeniləmə zamanı xəta baş verdi");
        });
    });
  };

  const handlePasswordUpdate = () => {
    passwordForm.validateFields().then((values) => {
      axios
        .post(`http://localhost:5001/api/user/new-password`, {
          _id: editingUser._id,
          password: values.password,
        })
        .then(() => {
          message.success("Şifrə uğurla yeniləndi");
          setIsPasswordModalVisible(false);
          passwordForm.resetFields();
        })
        .catch(() => {
          message.error("Şifrə yenilənərkən xəta baş verdi");
        });
    });
  };

  const handleAddUser = () => {
  addForm.validateFields().then((values) => {
    console.log("Form values:", values);
    // values.structure içinde nested structure olmalı
    axios.post("http://localhost:5001/api/user/add", values)
      .then(res => {
        if (res.data.success) {
          message.success("İstifadəçi uğurla əlavə olundu");
          setIsAddModalVisible(false);
          addForm.resetFields();
          fetchUsers();
          if (res.data.password) {
            alert(`Yeni istifadəçi üçün şifrə: ${res.data.password}`);
          }
        } else {
          message.error(res.data.message || "Əlavəetmə zamanı xəta baş verdi");
        }
      })
      .catch(() => {
        message.error("Əlavəetmə zamanı xəta baş verdi");
      });
  });
};


  const openPasswordModal = (user) => {
    setEditingUser(user);
    setIsPasswordModalVisible(true);
  };
  return (
    <div className="bg-white rounded-md p-4 flex flex-col">
      <div className="flex justify-between">
        <div className="flex items-center gap-5">
          <span className="text-2xl font-bold">
            İstifadəçilərin İdarə Edilməsi
          </span>
          <Tooltip title="Bu bölmədə bütün istifadəçiləri görə bilərsiniz">
            <Info className="text-blue-500" />
          </Tooltip>
        </div>
        <div>
          <Button  onClick={() => setIsAddModalVisible(true)}>
            <Plus /> Yeni İstifadəçi
          </Button>
        </div>
      </div>

      <div className="py-5 text-gray-200 flex">
        <hr />
      </div>

      <div style={{ height: 560 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
        />
      </div>

      <Modal
        title="İstifadəçini Redaktə Et"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleUpdate}
        okText="Yadda saxla"
        cancelText="Bağla"
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Ad" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Soyad" name="surname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Rol" name="systemRole" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Şifrəni Yenilə"
        open={isPasswordModalVisible}
        onCancel={() => {
          setIsPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        onOk={handlePasswordUpdate}
        okText="Yadda saxla"
        cancelText="Bağla"
      >
        <Form layout="vertical" form={passwordForm}>
          <Form.Item
            label="Yeni Şifrə"
            name="password"
            rules={[
              {
                required: true,
                message: "Zəhmət olmasa yeni şifrəni daxil edin",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
  title="Yeni İstifadəçi Əlavə Et"
  open={isAddModalVisible}
  onCancel={() => setIsAddModalVisible(false)}
  onOk={handleAddUser}
  okText="Əlavə et"
  cancelText="Bağla"
>
  <Form layout="vertical" form={addForm}>
    <Form.Item label="Ad" name="name" rules={[{ required: true, message: 'Ad daxil edin' }]}>
      <Input />
    </Form.Item>

    <Form.Item label="Soyad" name="surname" rules={[{ required: true, message: 'Soyad daxil edin' }]}>
      <Input />
    </Form.Item>

    <Form.Item label="Ata adı" name="fathername" rules={[{ required: true, message: 'Ata adı daxil edin' }]}>
      <Input />
    </Form.Item>

    <Form.Item
      label="Cins"
      name="gender"
      rules={[{ required: true, message: 'Cins seçin' }]}
    >
      <Select placeholder="Cins seçin">
        <Select.Option value="male">Kişi</Select.Option>
        <Select.Option value="female">Qadın</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item
      label="Email"
      name="email"
      rules={[
        { required: true, message: 'Email daxil edin' },
        { type: 'email', message: 'Düzgün email formatı daxil edin' }
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Telefon"
      name="phone"
      rules={[{ pattern: /^[0-9+-]{6,20}$/, message: 'Düzgün telefon nömrəsi daxil edin', required: false }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Status"
      name="status"
      initialValue="active"
    >
      <Select>
        <Select.Option value="active">Aktiv</Select.Option>
        <Select.Option value="passive">Passiv</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item
      label="Rol"
      name="systemRole"
      initialValue="user"
      rules={[{ required: true, message: 'Rol seçin' }]}
    >
      <Select>
        <Select.Option value="superadmin">Superadmin</Select.Option>
        <Select.Option value="admin">Admin</Select.Option>
        <Select.Option value="user">User</Select.Option>
        <Select.Option value="purchase_admin">Purchase Admin</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item label="Rütbə" name="rank">
      <Input />
    </Form.Item>

    <Form.Item label="Vəzifə" name="position">
      <Input />
    </Form.Item>
    <Form.Item label="Head Office" name={['structure', 'head_office']}>
      <Input type="number" />
    </Form.Item>

    <Form.Item label="Office" name={['structure', 'office']}>
      <Input type="number" />
    </Form.Item>

    <Form.Item label="Department" name={['structure', 'department']}>
      <Input type="number" />
    </Form.Item>

    <Form.Item label="Division" name={['structure', 'division']}>
      <Input type="number" />
    </Form.Item>

    <Form.Item name={['structure', 'isIndependent_office']} valuePropName="checked">
      <Checkbox>Independent Office</Checkbox>
    </Form.Item>

    <Form.Item name={['structure', 'isIndependent_department']} valuePropName="checked">
      <Checkbox>Independent Department</Checkbox>
    </Form.Item>

    <Form.Item name={['structure', 'isIndependent_division']} valuePropName="checked">
      <Checkbox>Independent Division</Checkbox>
    </Form.Item>
  </Form>
   

</Modal>


    </div>
  );
};

export default AllUsersPage;
