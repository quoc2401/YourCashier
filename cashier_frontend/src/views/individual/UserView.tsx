import { FC, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import ExpenseView from "./ExpenseView";
import IncomeView from "./IncomeView";
import { TabView, TabPanel } from "primereact/tabview";

const UserView: FC = () => {
  
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
