import { useStore } from "@/services/stores";
import { FC, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Income } from "@/utils/responseInterfaces";
import { dateBodyTemplate, deleteBodyTemplate, moneyBodyTemplate } from "./components/templates";
import { API_USER } from "@/services/axiosClient";
import CreateFormModal from "./components/CreateFormModal";
import { toast } from "react-toastify";
import * as Yup from 'yup'
import { useFormik } from "formik";
import { Income as RIncome } from "@/utils/requestInterfaces";
import TextEditor from "./components/TextEditor";
import NumberEditor from "./components/NumberEditor";

const IncomeView: FC = () => {
  const currentUser = useStore((state) => state.currentUser);
  const [incomes, setIncomes] = useState<Array<Income>>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openModalIncome, setOpenModalIncome] = useState(false);
  const [editingRows, setEditingRows] = useState([])
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 1,
    page_size: 10,
    kw: "",
  });

  useEffect(() => {
    const timeOut = setTimeout(() => loadIncomes(), 300)
    return () => clearTimeout(timeOut)
  }, [lazyParams])

  const loadIncomes = async () => {
    try {
      setLoading(true)
      const res = await API_USER.API_USER.apiGetIncomes(currentUser?.id, lazyParams)
      const data = res.data
      setTotalRecords(data.totalRecords)
      setIncomes(data.data)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  const formik = useFormik<RIncome>({
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
        const res = await API_USER.API_USER.apiCreateIncome(value)
        const data = res.data

        if (res.status === 200) {
          toast.success('Create success')
          setIncomes(prev => {
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
          setOpenModalIncome(false)
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
          onClick={() => setOpenModalIncome(true)}
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
        ...lazyParams,
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

  const onRowEditChange = (e: any) => {
    setEditingRows(e.data)
  }

  
  // update
  const onRowEditComplete = async (e: any) => {
    setLoading(true)
    const _incomes = [...incomes]
    const { newData, index } = e

    _incomes[index] = newData
    setIncomes(_incomes)
    try {
      const res = await API_USER.API_USER.apiUpdateIncome(newData)
      console.log(res.data)

      if (res.status == 200) toast.success('update success')
    } catch (error) {
      console.log(error)
      setIncomes(incomes)
      toast.error('failed to update')
    }

    setLoading(false)
  }

  const handleDelete = async (rowData: any) => {
    const _incomes = incomes.filter(i => i.id !== rowData.id)

    setIncomes(_incomes)
    try {
      setLoading(true)
      const res = await API_USER.API_USER.apiDeleteIncome(rowData.id)

      if (res.status == 204) toast.success('delete success')
    } catch (error) {
      console.log(error)
      setIncomes(incomes)
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
        <h3 className="font-semibold text-slate-500 text-lg mb-3">My incomes</h3>
      </div>
      <DataTable
        value={incomes}
        paginator
        dataKey="id"
        rows={lazyParams.page_size}
        rowsPerPageOptions={[10, 20, 50, 100]}
        totalRecords={totalRecords}
        loading={loading}
        header={header}
        emptyMessage="No incomes found"
        stripedRows
        lazy
        responsiveLayout="scroll"
        size="small"
        onPage={onPage}
        rowHover
        first={lazyParams.first}
        editMode="row"
        editingRows={editingRows}
        onRowEditChange={onRowEditChange}
        onRowEditComplete={onRowEditComplete}
      >
        <Column field="order" style={{ minWidth: "8rem", width: "8rem" }} />

        <Column
        field="description"
        header="Description"
        editor={options => <TextEditor options={options}/>}
        style={{ minWidth: "14rem" }}
        />

        <Column
          field="amount"
          header="Money Amount"
          editor={options => <NumberEditor options={options}/>}
          style={{ minWidth: "14rem" }}
          body={moneyBodyTemplate}
        />

        <Column 
          field="created_date" 
          header="Created Date" 
          style={{ minWidth: "10rem" }} 
          body={dateBodyTemplate}
        />
        <Column
          rowEditor
          className="min-w-[6rem] w-[8%]"
          bodyStyle={{ textAlign: 'right' }}
        />
        <Column
          className={`min-w-[6rem] w-[8%]`}
          body={rowData => deleteBodyTemplate(rowData, handleDelete, editingRows)}
        />
      </DataTable>
      <CreateFormModal 
        formik={formik}
        openModal={openModalIncome}
        handleCreate={() => formik.submitForm()}
        setOpenModal={setOpenModalIncome}
      />
    </>
  ); 
};

export default IncomeView;
