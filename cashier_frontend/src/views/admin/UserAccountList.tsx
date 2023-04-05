import { useStore } from "@/services/stores";
import { User } from "@/utils/responseInterfaces";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { FC, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { Avatar } from "primereact/avatar";
import { formatDate } from "@/utils";
import { API_ADMIN } from "@/services/axiosClient";
import { toast } from "react-toastify";

const UserAccountList: FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const currentUser = useStore((state) => state.currentUser);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0)
  const [lazyParams, setLazyParams] = useState({
    page: 1,
    pageSize: 10,
    kw: '',
    fromDate: null,
    toDate: null,
  })
  const [date, setDate] = useState<Date | Date[] | undefined>(undefined);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const timeOut = setTimeout(() => loadUsers(), 300)

    return () => clearTimeout(timeOut)
  }, [lazyParams])

  useEffect(() => {
    setLazyParams(prev => {
      const _lazyParams = {
        ...prev,
        first: 0,
        page: 1,  
        fromDate: date ? date[0] : null,
        toDate: date ? date[1] : null,
      }
      return _lazyParams
    })
  }, [date])

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data: res } = await API_ADMIN.API_ADMIN.apiGetUsers(lazyParams)
      setUsers(res.data);
      setTotalRecords(res.totalRecords);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const activeUser = async (uuid: string) => {
    try {
      const res = await API_ADMIN.API_ADMIN.apiActiveUser(uuid)
      if(res.status == 200)
        toast.success("Success!")
    } catch (error) {
      throw new Error(error)
    }
  }
  
  const handleSearch = (e: any) => {
    setLazyParams(prev => {
      const _lazyParams = {
        ...prev,
        first: 0,
        page: 1,
        kw: e.target.value
      }
      return _lazyParams
    })
  }
  
  const onPage = (e: any) => {
    setLazyParams(prev => {
      const _lazyParams = {
        ...lazyParams,
        page: e.page + 1,
        pageSize: e.rows,
        first: e.first,
      }

      return _lazyParams
    })
  }

  const handleActive = async (rowData: User) => {
    setLoading(true)
    const index = users.findIndex(u => u.id === rowData.id)
    let _users = [...users]
    const user = _users[index]
    user.is_active = !user.is_active
    _users[index] = user

    setUsers(_users)
    try {
      await activeUser(user.uuid)
    } catch (error) {
      console.log(error)
      setUsers(users)
      toast.error('failed to update')
    }
    setLoading(false)
  }

  const header = () => {
    return (
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center px-2">
        <Button
          label="Create new user"
          icon="pi pi-plus"
          className="font-semibold p-button-primary flex-0"
          onClick={() => setOpenModal(true)}
        />

        <Calendar
          value={date}
          v-model="filterParams.search.orderDate"
          touchUI={false}
          selectionMode="range"
          className="w-full sm:w-2/4 lg:w-1/4 ml-auto"
          dateFormat="dd/mm/yy"
          placeholder="From date - To date"
          readOnlyInput
          onChange={(e) => setDate(e.value)}
        />

        <div className="flex w-full sm:w-1/4">
          <span className="p-input-icon-left w-full">
            <i className="pi pi-search" />

            <InputText
              value={lazyParams.kw}
              className="rounded-md w-full"
              placeholder="Search group name"
              maxLength={200}
              onChange={handleSearch}
            />
          </span>
        </div>
      </div>
    );
  };

  
  const bodyUserTemplate = (rowData: User) => {
    return (
      <div className="flex items-center">
        <Avatar
          image={
            rowData.profile_picture ||
            `https://res.cloudinary.com/dynupxxry/image/upload/v1660532211/non-avatar_nw91c3.png`
          }
          className="mr-2"
          size="normal"
          shape="circle"
        />

        <span>
          {rowData.first_name} {rowData.last_name}
        </span>
      </div>
    );
  };


  const isActiveBodyTemplate = (rowData: User) => {
    return (
      <div className="cursor-pointer" onClick={e => handleActive(rowData)}>
        {rowData.is_active == true ? (
          <div className="bg-green-200 rounded-sm font-bold text-center text-green-500">
            Yes
          </div>
        ) : (
          <div className="bg-red-200 rounded-sm font-bold text-center text-red-500">
            No
          </div>
        )}
      </div>
    )
  }

  const isStaffBodyTemplate = (rowData: User) => {
    if (rowData.is_staff == true)
      return (
        <div className="bg-green-200 rounded-sm font-bold text-center text-green-500">
          Yes
        </div>
      )
    else
      return (
        <div className="bg-red-200 rounded-sm font-bold text-center text-red-500">
          No
        </div>
      )
  }

  return (
    <>
      {/* <ModalCreateGroup
        title="New Group"
        isOpen={openModalGroup}
        setIsOpen={setOpenModalGroup}
        setGroupList={pushNewGroup}
      /> */}

      <div className="px-4">
        <h3 className="font-semibold text-slate-500 text-lg mb-3">Users Administration</h3>
      </div>

      <DataTable
        value={users}
        paginator
        dataKey="id"
        rows={lazyParams.pageSize}
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
        onPage={onPage}
      >
        <Column style={{ width: "6rem" }} />

        <Column
          field="uuid"
          header="UUID"
          style={{ minWidth: "14rem" }}
        />

        <Column
          header="User"
          style={{ minWidth: "14rem" }}
          body={bodyUserTemplate}
        />

        <Column
          field="email"
          header="Email address"
          style={{ minWidth: "14rem" }}
        />

        <Column
          field="is_staff"
          header="Staff member"
          style={{ minWidth: "6rem" }}
          body={isStaffBodyTemplate}
        />

        <Column
          field="created_date"
          header="Create date"
          style={{ minWidth: "14rem" }}
          body={(value) => formatDate(value.created_date)}
        />

        <Column
          field="is_active"
          header="Active"
          style={{ minWidth: "6rem" }}
          body={isActiveBodyTemplate}
        />
      </DataTable>
    </>
  );
};

export default UserAccountList;
