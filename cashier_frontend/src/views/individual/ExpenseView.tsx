import { useStore } from "@/services/stores";
import { FC, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Expense } from "@/utils/responseInterfaces";
import { moneyBodyTemplate } from "./components/templates";
import { API_USER } from "@/services/axiosClient";

const ExpenseView: FC = () => {
  const currentUser = useStore((state) => state.currentUser);
  const [expenses, setExpenses] = useState<Array<Expense>>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 1,
    page_size: 10,
    kw: "",
  });
  const [openModalGroup, setOpenModalGroup] = useState(false);
  
  useEffect(() => {
    const timeOut = setTimeout(() => loadExpenses(), 300)

    return () => clearTimeout(timeOut)
  }, [lazyParams])

  const loadExpenses = async () => {
    try {
      setLoading(true)
      const res = await API_USER.API_USER.apiGetExpenses(currentUser?.id, lazyParams)
      const data = res.data
      setExpenses(data.data)
      setTotalRecords(data.totalRecords)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }
  
  const header = () => {
    return (
      <div className="flex justify-between items-center px-2">
        <Button
          label="Create new"
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
              value={lazyParams.kw}
              onChange={handleSearch}
            />
          </span>
          <span className="p-input-icon-right">
            <i 
              className={`pi pi-times ${lazyParams.kw == "" ? "hidden": ""} cursor-pointer`}
              onClick={handleCancelSearch}
            />
          </span>
        </div>
      </div>
    );
  };

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

  const handleCancelSearch = (e: any) => {
    setLazyParams(prev => {
      const _lazyParams = {
        ...prev,
        first: 0,
        page: 1,
        kw: ""
      }
      return _lazyParams
    })
  }

  const onPage = (e: any) => {
    setLazyParams(prev => {
      const _lazyParams = {
        ...lazyParams,
        page: e.page + 1,
        page_size: e.rows,
        first: e.first,
      }

      return _lazyParams
    })
  }

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
      <div className="px-4">
        <h3 className="font-semibold text-slate-500 text-lg mb-3">My expenses</h3>
      </div>

      <DataTable
        value={expenses}
        paginator
        dataKey="id"
        rows={lazyParams.page_size}
        rowsPerPageOptions={[10, 20, 50, 100]}
        totalRecords={totalRecords}
        loading={loading}
        header={header}
        emptyMessage="No groups found"
        stripedRows
        lazy
        onPage={onPage}
        first={lazyParams.first}
        responsiveLayout="scroll"
        size="small"
        rowHover
      >
        <Column field="order" style={{ minWidth: "8rem", width: "8rem" }} />

        <Column
          field="description"
          header="Description"
          style={{ minWidth: "14rem" }}
        />

        <Column
          field="amount"
          header="Money Amount"
          style={{ minWidth: "14rem" }}
          body={moneyBodyTemplate}
        />

        <Column field="created_date" header="Created Date" style={{ minWidth: "10rem" }} />
      </DataTable>
    </>
  );
};

export default ExpenseView;
