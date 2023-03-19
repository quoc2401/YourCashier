import { FC, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import ModalCreateGroup from "./components/ModalCreateGroup";

const GroupView: FC = () => {
  const [groups, setGroups] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
  });
  const [openModalGroup, setOpenModalGroup] = useState(false);

  const header = () => {
    return (
      <div className="flex justify-between items-center px-2">
        <Button
          label="Create new group"
          icon="pi pi-plus"
          className="font-semibold p-button-primary"
          onClick={() => setOpenModalGroup(true)}
        />

        <div className="flex">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />

            <InputText
              className="rounded-md"
              placeholder="Search group name "
            />
          </span>
        </div>
      </div>
    );
  };

  const actionBodyTemplate = () => {
    return (
      <div className="">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-text"
        />
      </div>
    );
  };

  return (
    <>
      <ModalCreateGroup
        title="New Group"
        isOpen={openModalGroup}
        setIsOpen={setOpenModalGroup}
      />

      <div className="px-4">
        <h3 className="font-semibold text-slate-500 text-lg mb-3">My Groups</h3>
      </div>

      <DataTable
        value={groups}
        paginator
        dataKey="id"
        rows={10}
        rowsPerPageOptions={[10, 20, 50, 100]}
        totalRecords={totalRecords}
        loading={loading}
        header={header}
        emptyMessage="No groups found"
        stripedRows
        lazy
        responsiveLayout="scroll"
        size="small"
        rowHover
      >
        <Column field="order" style={{ minWidth: "8rem", width: "8rem" }} />

        <Column
          field="name"
          header="Group name"
          style={{ minWidth: "14rem" }}
        />

        <Column
          field="supervisor"
          header="Leader"
          style={{ minWidth: "14rem" }}
        />

        <Column field="income" header="Income" style={{ minWidth: "10rem" }} />

        <Column
          field="expense"
          header="Expense"
          style={{ minWidth: "10rem" }}
        />

        <Column
          field="id"
          body={actionBodyTemplate}
          style={{ minWidth: "6rem" }}
        />
      </DataTable>
    </>
  );
};

export default GroupView;
