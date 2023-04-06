import { FC, useRef, useEffect, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { GroupExpenses } from "./components/GroupExpenses";
import { GroupIncome } from "./components/GroupIncome";
import { Group, GroupExpense, User } from "@/utils/responseInterfaces";
import { API_GROUP } from "@/services/axiosClient";
import { useParams } from "react-router-dom";
import { AvatarGroup } from "primereact/avatargroup";
import { Avatar } from "primereact/avatar";
import { Sidebar } from "primereact/sidebar";
import { useStore } from "@/services/stores";
import { CircularProgress } from "react-cssfx-loading";
import { formatDate, formatCurrency } from "@/utils";

const GroupDetail: FC = () => {
  const params = useParams();
  const menu = useRef<Menu>(null);
  const currentUser = useStore((state) => state.currentUser);
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(false);
  const [groupMember, setGroupMember] = useState<Array<User>>([]);
  const [date, setDate] = useState<Date | Date[] | undefined>(undefined);
  const [expensesApproved, setExpensesApproved] = useState<Array<GroupExpense>>(
    []
  );
  const [isOpenedSideBarMember, setIsOpenedSideBarMember] = useState(false);
  const [isOpenedSideBarApproved, setIsOpenedSideBarApproved] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalDifference, setTotalDifference] = useState(0);
  const [lazyParams, setLazyParams] = useState({
    fromDate: null,
    toDate: null,
  });

  useEffect(() => {
    loadGroupDetails();
  }, []);

  useEffect(() => {
    loadTotals();
  }, [lazyParams]);

  useEffect(() => {
    setLazyParams((prev) => {
      const _lazyParams = {
        fromDate: date ? date[0] : null,
        toDate: date ? date[1] : null,
      };
      return _lazyParams;
    });
  }, [date]);

  const loadTotals = async () => {
    try {
      const { data } = await API_GROUP.API_GROUP.apiGetTotal(
        params.groupId,
        lazyParams
      );

      setTotalIncome(data.totalIncome);
      setTotalExpense(data.totalExpense);
      setTotalDifference(data.totalDifference);
    } catch (error) {
      console.error(error);
    }
  };

  const loadGroupDetails = async () => {
    const { data: res } = await API_GROUP.API_GROUP.apiGetGroupDetail(
      params.groupId
    );

    setGroup(res);
  };

  const approveExpense = async (expenseId: number) => {
    const res = await API_GROUP.API_GROUP.apiGetApprovedExpense(expenseId, {
      is_approved: true,
      cashier_group: params.groupId,
    });

    res.status === 200 &&
      setExpensesApproved(expensesApproved.filter((e) => e.id !== expenseId));
  };

  const rejectExpense = async (expenseId: number) => {
    const res = await API_GROUP.API_GROUP.apiGetRejectExpense(expenseId, {
      is_approved: false,
      cashier_group: params.groupId,
    });

    res.status === 200 &&
      setExpensesApproved(expensesApproved.filter((e) => e.id !== expenseId));
  };

  const items = [
    {
      label: "Members list",
      icon: "pi pi-users",
      command: async () => {
        setIsOpenedSideBarMember(true);
        setLoading(true);

        const { data: res } = await API_GROUP.API_GROUP.apiGetGroupMember(
          params.groupId
        );

        setGroupMember(res);
        setLoading(false);
      },
    },
    {
      label: "Spending list",
      icon: "pi pi-verified",
      command: async () => {
        setIsOpenedSideBarApproved(true);
        setLoading(true);

        const { data: res } =
          await API_GROUP.API_GROUP.apiGetGroupExpenseNotApproved(
            currentUser?.id
          );

        setExpensesApproved(res);
        setLoading(false);
      },
    },
  ];

  return (
    <>
      <div className="px-4 flex justify-between items-center">
        <div className="flex gap-2 items-center mb-3">
          <h3 className="font-semibold text-slate-500 text-lg mb-0">
            Group{" "}
            <span className="text-primary-200 font-bold text-xl">
              {group?.name}
            </span>
          </h3>

          <AvatarGroup className="">
            {group?.users?.map((user, index) =>
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

            {group?.users && group?.users?.length >= 6 && (
              <Avatar
                label={`+${(group?.users?.length - 5).toString()}`}
                shape="circle"
                size="normal"
                style={{ backgroundColor: "#9c27b0", color: "#ffffff" }}
              />
            )}
          </AvatarGroup>

          <Button
            tooltip="Edit Group"
            icon="pi pi-pencil"
            className="p-button-rounded p-button-success p-button-text"
          />
        </div>

        <div className="mb-3">
          <Menu model={items} popup ref={menu} id="menu" />

          <Button
            label="Show"
            icon="pi pi-align-right"
            onClick={(event) => menu.current?.toggle(event)}
            aria-controls="menu"
            aria-haspopup
          />
        </div>
      </div>

      <div className="p-4 border border-slate-200 bg-slate-50 flex items-center">
        <div className="flex flex-col justify-center items-center flex-1">
          <div className="text-green-500 text-xl font-bold">
            {formatCurrency(totalIncome)}
          </div>

          <div className="">total income</div>
        </div>

        <i className="pi pi-angle-right text-2xl text-slate-500" />

        <div className="flex flex-col justify-center items-center flex-1">
          <div className="text-red-500 text-xl font-bold">
            {formatCurrency(totalExpense)}
          </div>

          <div className="">total expense</div>
        </div>

        <i className="pi pi-angle-right text-2xl text-slate-500" />

        <div className="flex flex-col justify-center items-center flex-1">
          <div
            className={`${
              totalIncome < totalExpense ? "text-red-500" : "text-green-500"
            } text-xl font-bold`}
          >
            {formatCurrency(totalDifference)}
          </div>

          <div className="">total difference</div>
        </div>
      </div>

      <TabView>
        <TabPanel header="Income">
          <GroupIncome
            adminId={group?.supervisor.id}
            date={date}
            setDate={setDate}
          />
        </TabPanel>
        <TabPanel header="Expense">
          <GroupExpenses
            adminId={group?.supervisor.id}
            date={date}
            setDate={setDate}
          />
        </TabPanel>
      </TabView>

      <Sidebar
        position="right"
        modal={false}
        visible={isOpenedSideBarMember}
        onHide={() => setIsOpenedSideBarMember(false)}
      >
        <h3 className="font-medium mb-2">Members</h3>

        {loading ? (
          <div className="w-full flex justify-center">
            <CircularProgress color="#744ea6" />
          </div>
        ) : (
          <ul className="list-none p-0 m-0">
            {groupMember?.map((user) => (
              <li key={user.id} className="mt-1">
                <div className="flex gap-3 items-center justify-start p-2 hover:bg-primary-50 w-full rounded-md">
                  <Avatar
                    image={
                      user.profile_picture ||
                      `https://res.cloudinary.com/dynupxxry/image/upload/v1660532211/non-avatar_nw91c3.png`
                    }
                    className="mr-2 object-cover"
                    size="large"
                    shape="circle"
                  />

                  <span className="line-clamp-1 font-semibold">
                    {user.last_name || `null`} {user.first_name}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Sidebar>

      <Sidebar
        position="right"
        modal={false}
        visible={isOpenedSideBarApproved}
        onHide={() => setIsOpenedSideBarApproved(false)}
      >
        <h3>Request Expense</h3>
        {loading ? (
          <div className="w-full flex justify-center">
            <CircularProgress color="#744ea6" />
          </div>
        ) : (
          <ul className="list-none p-0 m-0">
            {expensesApproved?.map((item) => (
              <li key={item.id} className="mt-1 flex gap-2">
                <div className="flex gap-3 items-start justify-start p-2 hover:bg-primary-50 w-full rounded-md">
                  <Avatar
                    image={
                      item.expense.user.profile_picture ||
                      `https://res.cloudinary.com/dynupxxry/image/upload/v1660532211/non-avatar_nw91c3.png`
                    }
                    className="object-cover"
                    size="normal"
                    shape="circle"
                  />

                  <div className="flex flex-col flex-1">
                    <div className="font-bold">
                      {item.expense.user.first_name}{" "}
                      {item.expense.user.last_name}
                    </div>

                    <div className="text-sm">
                      Reason: {item.expense.description}
                    </div>

                    <div className="font-semibold">
                      Expense:{" "}
                      <span className="text-red-500">
                        -{formatCurrency(item.expense.amount)}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400">
                      {formatDate(item.expense.created_date)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Button
                      icon="pi pi-check"
                      className="p-button-rounded p-button-outlined p-button-success"
                      disabled={loading}
                      onClick={() => approveExpense(item.expense.id)}
                    />

                    <Button
                      icon="pi pi-times"
                      className="p-button-rounded p-button-outlined p-button-danger"
                      disabled={loading}
                      onClick={() => rejectExpense(item.expense.id)}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Sidebar>
    </>
  );
};

export default GroupDetail;
