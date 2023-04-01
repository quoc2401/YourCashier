import { FC, useRef } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";

const GroupDetail: FC = () => {
  const menu = useRef<Menu>(null);

  const items = [
    {
      label: "Members list",
      icon: "pi pi-users",
      command: () => {
        // window.location.pathname = '/user-info'
      },
    },
    {
      label: "Spending list",
      icon: "pi pi-verified",
      command: () => {
        // handleLogout();
      },
    },
  ];

  return (
    <>
      <div className="px-4 flex justify-between items-center">
        <div className="flex gap-2 items-center mb-3">
          <h3 className="font-semibold text-slate-500 text-lg mb-0">
            Group <span className="text-primary-200 font-bold">GROUP TEST</span>
          </h3>

          <Button
            tooltip="Add Member"
            icon="pi pi-user-plus"
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
          <div className="text-green-500 text-xl font-bold">$1355.0</div>

          <div className="">total income</div>
        </div>

        <i className="pi pi-angle-right text-2xl text-slate-500" />

        <div className="flex flex-col justify-center items-center flex-1">
          <div className="text-red-500 text-xl font-bold">$1355.0</div>

          <div className="">total expense</div>
        </div>

        <i className="pi pi-angle-right text-2xl text-slate-500" />

        <div className="flex flex-col justify-center items-center flex-1">
          <div className="text-red-500 text-xl font-bold">-$1355.0</div>

          <div className="">total difference</div>
        </div>
      </div>

      <TabView>
        <TabPanel header="Income">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </TabPanel>
        <TabPanel header="Expense">
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
            eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci
            velit, sed quia non numquam eius modi.
          </p>
        </TabPanel>
      </TabView>
    </>
  );
};

export default GroupDetail;
