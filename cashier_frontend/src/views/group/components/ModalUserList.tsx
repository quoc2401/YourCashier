import { FC, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import { Avatar } from "primereact/avatar";

interface ModalUserListProps {
  setIsOpen: (e: boolean) => void;
  isOpen: boolean;
}

const ModalUserList: FC<ModalUserListProps> = ({ isOpen, setIsOpen }) => {
  const [loading, setLoading] = useState(false);

  const renderFooter = () => {
    return (
      <div>
        <Button
          label="Cancel"
          onClick={() => setIsOpen(false)}
          className="p-button-text p-button-danger font-semibold"
        />

        <Button
          type="button"
          label="Save"
          className="font-semibold p-button-success"
          autoFocus
        />
      </div>
    );
  };
  return (
    <Dialog
      header="User list"
      headerStyle={{ padding: "16px 18px 8px 24px" }}
      visible={isOpen}
      style={{ width: "30rem", minHeight: "30rem" }}
      footer={renderFooter}
      onHide={() => setIsOpen(false)}
    >
      <InputText placeholder="Search name user" className="my-3 w-full" />

      <ScrollPanel
        style={{ width: "100%", height: "400px" }}
        className="rounded-md"
      >
        <div className="flex items-center p-2 hover:bg-slate-50 w-full">
          <Avatar
            image="images/avatar/amyelsner.png"
            className="mr-2"
            size="xlarge"
            shape="circle"
          />
        </div>
      </ScrollPanel>
    </Dialog>
  );
};

export default ModalUserList;
