import { FC, useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import ModalCreateGroup from "./components/ModalCreateGroup";
import { API_GROUP } from "@/services/axiosClient";
import { Group } from "@/utils/response_interfaces";
import { useStore } from "@/services/stores";

const GroupView: FC = () => {
  const currentUser = useStore((state) => state.currentUser);
  const [groups, setGroups] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilter] = useState("");
  const lazyTimeOut = useRef<ReturnType<typeof setTimeout>>();
  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 10,
    page: 1,
  });
  const [openModalGroup, setOpenModalGroup] = useState(false);

  useEffect(() => {
    lazyTimeOut.current = setTimeout(async () => {
      loadGroups();
    }, 500);
    return () => clearTimeout(lazyTimeOut.current);
  }, [lazyState, filters]);

  const loadGroups = async () => {
    setLoading(true);

    const res = await API_GROUP.API_GROUP.apiGetGroupByUser(
      currentUser?.id,
      lazyState,
      filters
    );

    console.log(res);

    setGroups(res.data);
    setTotalRecords(10);
    setLoading(false);
  };

  const onPageChange = (e: any) => {
    setLazyState(e);
  };

  const header = () => {
    return (
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center px-2">
        <Button
          label="Create new group"
          icon="pi pi-plus"
          className="font-semibold p-button-primary"
          onClick={() => setOpenModalGroup(true)}
        />

        <div className="flex w-full sm:w-2/4 lg:w-1/4">
          <span className="p-input-icon-left w-full">
            <i className="pi pi-search" />

            <InputText
              value={filters}
              className="rounded-md w-full"
              placeholder="Search group name"
              maxLength={200}
              onChange={(e) => setFilter(e.target.value)}
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
        rows={lazyState.rows}
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
        onPage={onPageChange}
      >
        <Column style={{ minWidth: "8rem", width: "8rem" }} />

        <Column
          field="name"
          header="Group name"
          style={{ minWidth: "14rem" }}
        />

        {/* <Column
          field="supervisor"
          header="Leader"
          style={{ minWidth: "14rem" }}
        /> */}

        <Column
          field="created_date"
          header="Create date"
          style={{ minWidth: "14rem" }}
        />

        {/* <Column
          field="users"
          header="Members"
          body={actionBodyTemplate}
          style={{ minWidth: "6rem" }}
        /> */}
      </DataTable>
    </>
  );
};

export default GroupView;
