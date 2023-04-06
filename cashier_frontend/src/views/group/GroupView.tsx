import { FC, useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import ModalCreateGroup from "./components/ModalCreateGroup";
import { API_GROUP } from "@/services/axiosClient";
import { Group } from "@/utils/responseInterfaces";
import { useStore } from "@/services/stores";
import { formatDate } from "@/utils";
import { Avatar } from "primereact/avatar";
import { AvatarGroup } from "primereact/avatargroup";
import { Calendar } from "primereact/calendar";
import { useNavigate } from "react-router-dom";

const GroupView: FC = () => {
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
  const [groups, setGroups] = useState<Array<Group>>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilter] = useState("");
  const [date, setDate] = useState<Date | Date[] | undefined>(undefined);
  const lazyTimeOut = useRef<ReturnType<typeof setTimeout>>();
  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 10,
    page: 1,
    fromDate: null,
    toDate: null,
  });
  const [openModalGroup, setOpenModalGroup] = useState(false);
  const firstUpdate = useRef<any>(null);

  useEffect(() => {
    loadGroups();
  }, [lazyState]);

  useEffect(() => {
    if (firstUpdate.current) {
      lazyTimeOut.current = setTimeout(async () => {
        loadGroups();
      }, 500);
    } else {
      firstUpdate.current = true;
    }
    return () => clearTimeout(lazyTimeOut.current);
  }, [filters, date]);

  useEffect(() => {
    setLazyState((prev) => {
      const _lazyParams = {
        ...prev,
        first: 0,
        page: 1,
        fromDate: date ? date[0] : null,
        toDate: date ? date[1] : null,
      };
      return _lazyParams;
    });
  }, [date]);

  const loadGroups = async () => {
    setLoading(true);

    const { data: res } = await API_GROUP.API_GROUP.apiGetGroupByUser(
      currentUser?.id,
      lazyState,
      filters
    );

    setGroups(res.data);
    setTotalRecords(res.totalRecords);
    setLoading(false);
  };

  const pushNewGroup = (group: Group) => {
    setGroups([...groups, group]);
  };

  const onPageChange = (e: any) => {
    setLazyState({ ...e, page: e.page + 1 });
  };

  const onRowDoubleClick = (e: any) => {
    navigate(`/group/${e.data.id}`);
  };

  const header = () => {
    return (
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center px-2">
        <Button
          label="Create new group"
          icon="pi pi-plus"
          className="font-semibold p-button-primary flex-0"
          onClick={() => setOpenModalGroup(true)}
        />

        <Calendar
          value={date}
          v-model="filterParams.search.orderDate"
          touchUI={false}
          selectionMode="range"
          className="w-full sm:w-2/4 lg:w-1/4 ml-auto"
          inputClassName="rounded-md"
          dateFormat="dd/mm/yy"
          placeholder="From date - To date"
          onChange={(e) => setDate(e.value)}
        />

        <div className="flex w-full sm:w-1/4">
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

  const bodySupervisor = (rowData: Group) => {
    return (
      <div className="flex items-center">
        <Avatar
          image={
            rowData.supervisor.profile_picture ||
            `https://res.cloudinary.com/dynupxxry/image/upload/v1660532211/non-avatar_nw91c3.png`
          }
          className="mr-2"
          size="normal"
          shape="circle"
        />

        <span>
          {rowData.supervisor.first_name} {rowData.supervisor.last_name}
        </span>
      </div>
    );
  };

  const bodyUsers = (rowData: Group) => {
    return (
      <div className="flex items-center">
        <AvatarGroup className="mb-3">
          {rowData.users.map((user, index) =>
            index < 5 ? (
              <Avatar
                key={user.id}
                image={
                  user.profile_picture ||
                  `https://res.cloudinary.com/dynupxxry/image/upload/v1660532211/non-avatar_nw91c3.png`
                }
                size="normal"
                shape="circle"
              />
            ) : null
          )}

          {rowData.users.length >= 6 && (
            <Avatar
              label={`+${(rowData.users.length - 5).toString()}`}
              shape="circle"
              size="normal"
              style={{ backgroundColor: "#9c27b0", color: "#ffffff" }}
            />
          )}
        </AvatarGroup>
      </div>
    );
  };

  return (
    <>
      <ModalCreateGroup
        title="New Group"
        isOpen={openModalGroup}
        setIsOpen={setOpenModalGroup}
        setGroupList={pushNewGroup}
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
        onRowDoubleClick={onRowDoubleClick}
      >
        <Column style={{ width: "6rem" }} />

        <Column
          field="name"
          header="Group name"
          style={{ minWidth: "14rem" }}
        />

        <Column
          field="supervisor"
          header="Leader"
          style={{ minWidth: "14rem" }}
          body={bodySupervisor}
        />

        <Column
          field="created_date"
          header="Create date"
          style={{ minWidth: "14rem" }}
          body={(value) => formatDate(value.created_date)}
        />

        <Column
          field="users"
          header="Members"
          body={bodyUsers}
          style={{ minWidth: "14rem" }}
        />
      </DataTable>
    </>
  );
};

export default GroupView;
