import { FC, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import ExpenseView from "./ExpenseView";
import IncomeView from "./IncomeView";
import { TabView, TabPanel } from "primereact/tabview";
import { API_USER } from "@/services/axiosClient";
import { formatCurrency } from "@/utils";

const UserView: FC = () => {
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const [totalDifference, setTotalDifference] = useState(0)
  
  useEffect(() => {
    loadTotals()
  }, [])

  const loadTotals = async () => {
    try {
      const res = await API_USER.API_USER.apiGetTotal()
      const data = res.data

      setTotalIncome(data.totalIncome)
      setTotalExpense(data.totalExpense)
      setTotalDifference(data.totalDifference)
    } catch (error) {
      console.log(error)
    }
  }

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
      <div className="p-4 border border-slate-200 bg-slate-50 flex items-center">
        <div className="flex flex-col justify-center items-center flex-1">
          <div className="text-green-500 text-xl font-bold">{formatCurrency(totalIncome)}</div>

          <div className="">Total income</div>
        </div>

        <i className="pi pi-angle-right text-2xl text-slate-500" />

        <div className="flex flex-col justify-center items-center flex-1">
          <div className="text-red-500 text-xl font-bold">{formatCurrency(totalExpense)}</div>

          <div className="">Total expense</div>
        </div>

        <i className="pi pi-angle-right text-2xl text-slate-500" />

        <div className="flex flex-col justify-center items-center flex-1">
          <div className={`${totalIncome < totalExpense ? "text-red-500" : "text-green-500"} text-xl font-bold`}>
            {formatCurrency(totalDifference)}
          </div>
          <div className="">Total difference</div>
        </div>
      </div>
      <TabView>
        <TabPanel header="Incomes">
          <IncomeView />
        </TabPanel>

        <TabPanel header="Expenses">
          <ExpenseView /> 
        </TabPanel>
      </TabView>
    </>
  );
};

export default UserView;
