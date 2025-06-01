import { Drawer, Collapse } from "antd";
import React from "react";

const { Panel } = Collapse;

const ViewExpenseItemDrawer = ({ visible, onClose, data }) => {
  return (
    <Drawer
      title="Xərc Maddəsi Məlumatı"
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
    >
      {data ? (
        <div className="space-y-4">
          <p><strong>Maddə kodu:</strong> {data.itemCode}</p>
          <p><strong>Açıqlama:</strong> {data.description}</p>
          <p><strong>Məbləğ:</strong> {data.amount} AZN</p>
          <p>
            <strong>Tip:</strong>{" "}
            {data.isInternal ? "Büdcə daxili" : "Büdcə xarici"}
          </p>

          {data.purchaseHistory && data.purchaseHistory.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mt-6 mb-2">Alış Tarixçəsi</h3>
              <Collapse accordion>
                {[...data.purchaseHistory].reverse().map((item, index) => (
                  <Panel
                    header={`${item.description} — ${item.amount} AZN`}
                    key={index}
                  >
                    <p><strong>Tarix:</strong> {item.purchaseDate}</p>
                    <p><strong>Məbləğ:</strong> {item.amount} AZN</p>
                    {item.note && <p><strong>Qeyd:</strong> {item.note}</p>}
                  </Panel>
                ))}
              </Collapse>
            </div>
          )}
        </div>
      ) : (
        <p>Məlumat tapılmadı.</p>
      )}
    </Drawer>
  );
};

export default ViewExpenseItemDrawer;
