import { FC, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import ExpenseView from "./ExpenseView";
import IncomeView from "./IncomeView";
import { TabView, TabPanel } from "primereact/tabview";
import { API_USER } from "@/services/axiosClient";
import { formatCurrency } from "@/utils";
import { Calendar } from "primereact/calendar";

const UserView: FC = () => {
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const [totalDifference, setTotalDifference] = useState(0)
  const [date, setDate] = useState<Date | Date[] | undefined>(undefined);
  const [lazyParams, setLazyParams] = useState({
    fromDate: null,
    toDate: null,
  })
  
  useEffect(() => {
    const timeOut = setTimeout(() => loadTotals(), 300)
    return () => clearTimeout(timeOut)
  }, [lazyParams])

  useEffect(() => {
      setLazyParams(prev => {
        const _lazyParams = {
          fromDate: date ? date[0] : null,
          toDate: date ? date[1] : null,
        }
        return _lazyParams
      })
  }, [date])

  const loadTotals = async () => {
    try {
      const res = await API_USER.API_USER.apiGetTotal(lazyParams)
      const data = res.data

      setTotalIncome(data.totalIncome)
      setTotalExpense(data.totalExpense)
      setTotalDifference(data.totalDifference)
    } catch (error) {
      console.log(error)
    }
  }

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
          <IncomeView date={date} setDate={setDate}/>
        </TabPanel>

        <TabPanel header="Expenses">
          <ExpenseView date={date} setDate={setDate}/> 
        </TabPanel>
      </TabView>
    </>
  );
};

export default UserView;
