import { useStore } from "@/services/stores";
import { FC, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Income } from "@/utils/responseInterfaces";
import { moneyBodyTemplate } from "./components/templates";
import { API_USER } from "@/services/axiosClient";


const IncomeView: FC = () => {
  const currentUser = useStore((state) => state.currentUser);
  const [incomes, setIncomes] = useState<Array<Income>>([]);
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

  useEffect(() => {
    loadIncomes()
  }, [])

  const loadIncomes = async () => {
    const res = await API_USER.API_USER.apiGetIncomes(currentUser?.id)
    const data = res.data
    setIncomes(data)
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

      <div className="px-4">
        <h3 className="font-semibold text-slate-500 text-lg mb-3">My incomes</h3>
      </div>

      <DataTable
        value={incomes}
        paginator
        dataKey="id"
        rows={10}
        rowsPerPageOptions={[10, 20, 50, 100]}
        totalRecords={totalRecords}
        loading={loading}
        header={header}
        emptyMessage="No incomes found"
        stripedRows
        lazy
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

export default IncomeView;
