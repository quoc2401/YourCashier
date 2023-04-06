import { FC, useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { API_GROUP, API_USER } from "@/services/axiosClient";
import { GroupExpense, User } from "@/utils/responseInterfaces";
import { useStore } from "@/services/stores";
import { formatDate, formatCurrency } from "@/utils";
import { Avatar } from "primereact/avatar";
import { Calendar } from "primereact/calendar";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import CreateFormModal from "./CreateFormModal";

interface GroupExpensesProps {
  adminId: any;
  date: Date | Date[] | undefined;
  setDate: (date: Date | Date[] | undefined) => void;
}

export const GroupExpenses: FC<GroupExpensesProps> = ({
  adminId,
  date,
  setDate,
}) => {
  const currentUser = useStore((state) => state.currentUser);
  const [expenses, setExpenses] = useState<Array<GroupExpense>>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilter] = useState("");
  const [openModalExpense, setOpenModalExpense] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const lazyTimeOut = useRef<ReturnType<typeof setTimeout>>();
  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 10,
    page: 1,
    fromDate: null,
    toDate: null,
  });
  const firstUpdate = useRef<any>(null);
  const params = useParams();

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
    formik.resetForm();
  }, [openModalExpense]);

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

    const { data: res } = await API_GROUP.API_GROUP.apiGetGroupExpenseApproved(
      params.groupId,
      lazyState,
      filters
    );

    setExpenses(res.data);
    setTotalRecords(res.totalRecords);
    setLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      amount: 0,
      description: "",
      id: 0,
    },
    validationSchema: Yup.object({
      amount: Yup.number().required(),
      description: Yup.string().required(),
    }),
    onSubmit: async (value) => {
      if (!isEdit) {
        setLoading(true);
        try {
          const res = await API_GROUP.API_GROUP.apiCreateExpense({
            expense: {
              amount: value.amount,
              description: value.description,
            },
            cashier_group: params.groupId,
          });

          if (res.status === 200) {
            toast.success("Create success. Waiting for Leader accept");

            formik.setValues(formik.initialValues);
            setOpenModalExpense(false);
          }
        } catch (error) {
          toast.error("Failed to create");
        }
        setLoading(false);
      } else {
        setLoading(true);
        try {
          const res = await API_USER.API_USER.apiUpdateExpense({
            ...value,
            is_active: true,
          });

          if (res.status === 200) {
            toast.success("Update success");

            const _expense = [...expenses];

            const index = expenses.findIndex(
              (item) => res.data.id === item.expense.id
            );

            _expense[index].expense = {
              ..._expense[index].expense,
              amount: res.data.amount,
              description: res.data.description,
            };

            setExpenses(_expense);

            formik.setValues(formik.initialValues);
            setOpenModalExpense(false);
          }
        } catch (error) {
          toast.error("Failed to update");
        }
        setLoading(false);
      }
    },
  });

  const onPageChange = (e: any) => {
    setLazyState({ ...e, page: e.page + 1 });
  };

  const deleteExpense = async (data: GroupExpense) => {
    try {
      setLoading(true);
      const res = await API_USER.API_USER.apiDeleteExpense(data.expense.id);

      if (res.status == 204) {
        toast.success("Delete success");

        const _expenses = expenses.filter(
          (i) => i.expense.id !== data.expense.id
        );
        setExpenses(_expenses);
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
    setLoading(false);
  };

  const editExpense = (data: GroupExpense) => {
    setIsEdit(true);

    setOpenModalExpense(true);

    formik.values.amount = data.expense.amount;
    formik.values.description = data.expense.description;
    formik.values.id = data.expense.id;
  };

  const header = () => {
    return (
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center px-2">
        <Button
          label="Create new"
          icon="pi pi-plus"
          className="font-semibold p-button-primary"
          onClick={() => {
            setIsEdit(false);
            setOpenModalExpense(true);
          }}
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
              placeholder="Search description"
              maxLength={200}
              onChange={(e) => setFilter(e.target.value)}
            />
          </span>
        </div>
      </div>
    );
  };

  const bodyUser = (user: User) => {
    return (
      <div className="flex items-center">
        <Avatar
          image={
            user.profile_picture ||
            `https://res.cloudinary.com/dynupxxry/image/upload/v1660532211/non-avatar_nw91c3.png`
          }
          className="mr-2"
          size="normal"
          shape="circle"
        />

        <span>
          {user.first_name} {user.last_name}
        </span>
      </div>
    );
  };

  const bodyAction = (data: GroupExpense) => {
    return (
      <div className="flex items-center gap-1">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-secondary p-button-text"
          onClick={() => editExpense(data)}
        />

        {currentUser?.id === adminId && (
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger p-button-text"
            onClick={() => deleteExpense(data)}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <CreateFormModal
        formik={formik}
        openModal={openModalExpense}
        handleCreate={() => formik.submitForm()}
        setOpenModal={setOpenModalExpense}
      />

      <DataTable
        value={expenses}
        paginator
        dataKey="id"
        rows={lazyState.rows}
        rowsPerPageOptions={[10, 20, 50, 100]}
        totalRecords={totalRecords}
        loading={loading}
        header={header}
        emptyMessage="No expenses found"
        stripedRows
        lazy
        responsiveLayout="scroll"
        size="small"
        onPage={onPageChange}
        rowHover
        first={lazyState.first}
      >
        <Column field="order" style={{ minWidth: "6rem", width: "6rem" }} />

        <Column
          field="description"
          header="Description"
          style={{ minWidth: "14rem" }}
          body={(data) => <div>{data.expense.description}</div>}
        />

        <Column
          field="user"
          header="User"
          style={{ minWidth: "14rem" }}
          body={(data) => bodyUser(data.expense.user)}
        />

        <Column
          field="created_date"
          header="Created Date"
          style={{ minWidth: "14rem" }}
          body={(data) => <div>{formatDate(data.expense.created_date)}</div>}
        />

        <Column
          field="amount"
          header="Money Amount"
          style={{ minWidth: "14rem" }}
          body={(data) => (
            <div className="text-red-500 font-medium">
              {`-${formatCurrency(data.expense.amount)}`}
            </div>
          )}
        />

        <Column
          className={`min-w-[6rem] w-[8%]`}
          body={(rowData) => bodyAction(rowData)}
        />
      </DataTable>
    </>
  );
};
