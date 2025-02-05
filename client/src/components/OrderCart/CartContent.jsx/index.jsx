import React from "react";
import { Button } from "antd";

const CartContent = (
  <div className="bg-white rounded-lg p-4 w-[500px]">
    {/* Header */}
    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
      <span className="text-xl font-semibold text-gray-800">Səbətim</span>
      <span className="text-blue-500 font-medium cursor-pointer hover:underline">
        Ətraflı
      </span>
    </div>

    {/* Table */}
    <table className="table-auto w-full text-sm text-left mt-3">
      <thead>
        <tr className="text-gray-500">
          <th className="px-4 py-2 font-semibold">İstehlakçı</th>
          <th className="px-4 py-2 font-semibold">Məhsul</th>
          <th className="px-4 py-2 font-semibold">Sifariş Sayı</th>
          <th className="px-4 py-2 font-semibold">Əməliyyatlar</th>
        </tr>
      </thead>
      <tbody>
        <tr className="hover:bg-gray-100">
          <td className="px-4 py-2">Ali Veli</td>
          <td className="px-4 py-2">Monitor</td>
          <td className="px-4 py-2 text-center">2</td>
          <td className="px-4 py-2 text-center">
            <Button type="primary" size="small" danger className="">
              Sil
            </Button>
          </td>
        </tr>
        <tr className="hover:bg-gray-100">
          <td className="px-4 py-2">Ayşe Demir</td>
          <td className="px-4 py-2">Ürün 2</td>
          <td className="px-4 py-2 text-center">1</td>
          <td className="px-4 py-2 text-center">
            <Button type="primary" size="small" danger className="">
              Sil
            </Button>
          </td>
        </tr>
        <tr className="hover:bg-gray-100">
          <td className="px-4 py-2">Mehmet Yılmaz</td>
          <td className="px-4 py-2">Ürün 3</td>
          <td className="px-4 py-2 text-center">3</td>
          <td className="px-4 py-2 text-center">
            <Button type="primary" size="small" danger className="">
              Sil
            </Button>
          </td>
        </tr>
      </tbody>
    </table>

    {/* Confirmation Note */}
    <div className="mt-4">
      <span className="text-[12px] text-red-600">
        *Səbətinizdəki bütün məhsullar üçün <strong>sadəcə 1 raport</strong> generasiya ediləcək
      </span>
    </div>

    {/* Total Price */}
    <div className="mt-4 flex justify-between items-center font-semibold">
      <span className="text-gray-800">Ümumi:</span>
      <span className="text-lg text-blue-600">3 sifariş</span>
    </div>

    {/* Confirm Button */}
    <div className="mt-6">
      <Button
        type="primary"
        size="large"
        block
        className="bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:bg-blue-700"
      >
        Raport yarat
      </Button>
    </div>
  </div>
);

export default CartContent;
