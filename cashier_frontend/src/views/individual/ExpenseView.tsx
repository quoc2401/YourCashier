import { useStore } from "@/services/stores";
import { FC, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Expense } from "@/utils/responseInterfaces";
import { dateBodyTemplate, deleteBodyTemplate, moneyBodyTemplate } from "./components/templates";
import { API_USER } from "@/services/axiosClient";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { Expense as RExpense } from "@/utils/requestInterfaces";
import * as Yup from 'yup'
import CreateFormModal from "./components/CreateFormModal";
import { Calendar } from "primereact/calendar";

interface ExpenseViewProps {
  date: Date | Date[] | undefined
  setDate: (date: Date | Date[] | undefined) => void
}


const ExpenseView: FC<ExpenseViewProps> = ({date, setDate}) => {
  const currentUser = useStore((state) => state.currentUser);
  const [expenses, setExpenses] = useState<Array<Expense>>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editingRows, setEditingRows] = useState([])
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 1,
    pageSize: 10,
    kw: "",
    fromDate: null,
    toDate: null,
  });
  const [openModal, setOpenModal] = useState(false);
  
  useEffect(() => {
    const timeOut = setTimeout(() => loadExpenses(), 300)

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
  
  
  const formik = useFormik<RExpense>({
    initialValues: {
      amount: 0,
      description: ''
    },
    validationSchema: Yup.object({
      amount: Yup.number().required(),
      description: Yup.string().required()
    }),
    onSubmit: async value => {
      setLoading(true)
      try {
        const res = await API_USER.API_USER.apiCreateExpense(value)
        const data = res.data

        if (res.status === 200) {
          toast.success('Create success')
          setExpenses(prev => {
            prev = [
              data,
              ...prev
            ]
            return prev
          })
        //   setCategories(prev => {
        //     prev = prependArray(data, prev)
        //     return prev
        //   })
          formik.setValues(formik.initialValues)
          setOpenModal(false)
        }
      } catch (error) {
        toast.error('Failed to create')
        console.log(error)
      }
      setLoading(false)
    }
  })

  const header = () => {
    return (
      <div className="flex justify-between items-center px-2">
        <Button
          label="Create new"
          icon="pi pi-plus"
          className="font-semibold p-button-primary"
          onClick={() => setOpenModal(true)}
        />

        <Calendar
          value={date}
          v-model="filterParams.search.orderDate"
          touchUI={false}
          selectionMode="range"
          className="w-full sm:w-2/4 lg:w-1/4 ml-auto mr-4"
          dateFormat="dd/mm/yy"
          placeholder="From date - To date"
          readOnlyInput
          onChange={(e) => setDate(e.value)}
        />
        <span className="p-input-icon-right">
          <i 
            className={`pi pi-times ${date == null ? "hidden": ""} cursor-pointer mr-5`}
            onClick={() => setDate(undefined)}
          />
        </span>

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
        pageSize: e.rows,
        first: e.first,
      }

      return _lazyParams
    })
  }

  
  const onRowEditChange = (e: any) => {
    setEditingRows(e.data)
  }

  
  // update
  const onRowEditComplete = async (e: any) => {
    setLoading(true)
    const _expenses = [...expenses]
    const { newData, index } = e

    _expenses[index] = newData
    setExpenses(_expenses)
    try {
      const res = await API_USER.API_USER.apiUpdateExpense(newData)
      console.log(res.data)

      if (res.status == 200) toast.success('update success')
    } catch (error) {
      console.log(error)
      setExpenses(expenses)
      toast.error('failed to update')
    }
    setLoading(false)
  }

  const handleDelete = async (rowData: any) => {
    const _expenses = expenses.filter(i => i.id !== rowData.id)

    setExpenses(_expenses)
    try {
      setLoading(true)
      const res = await API_USER.API_USER.apiDeleteExpense(rowData.id)

      if (res.status == 204) toast.success('delete success')
    } catch (error) {
      console.log(error)
      setExpenses(expenses)
      toast.error('failed to update')
    }
    setLoading(false)
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
        rows={lazyParams.pageSize}
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
        editMode="row"
        editingRows={editingRows}
        onRowEditChange={onRowEditChange}
        onRowEditComplete={onRowEditComplete}
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

        <Column field="created_date" header="Created Date" style={{ minWidth: "10rem" }} body={dateBodyTemplate}/>
        <Column
          rowEditor
          className="min-w-[6rem] w-[8%]"
          bodyStyle={{ textAlign: 'right' }}
        />
        <Column
          className="min-w-[6rem] w-[8%]"
          body={rowData => deleteBodyTemplate(rowData, handleDelete, editingRows)}
        />
      </DataTable>
      <CreateFormModal 
        formik={formik}
        openModal={openModal}
        handleCreate={() => formik.submitForm()}
        setOpenModal={setOpenModal}
      />
    </>
  );
};

export default ExpenseView;
