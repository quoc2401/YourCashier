import { FC, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import { Avatar } from "primereact/avatar";

interface ModalUserListProps {
  setIsOpen: (e: boolean) => void;
  isOpen: boolean;
  initValue: any;
  setMemberValue: (value: any) => void;
}

const ModalUserList: FC<ModalUserListProps> = ({
  isOpen,
  setIsOpen,
  initValue,
  setMemberValue,
}) => {
  const [loading, setLoading] = useState(false);
  const [currentListUser, setCurrentListUser] = useState([...initValue]);

  const saveDataUser = () => {
    setMemberValue(currentListUser);
  };

  const addUser = (newUser: any) => {
    setCurrentListUser([...currentListUser, { ...newUser }]);
  };

  const removeUser = (index: number) => {
    const newList = currentListUser.splice(index, 1);

    setCurrentListUser(newList);
  };

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
          className="font-semibold p-button-primary"
          onClick={saveDataUser}
        />
      </div>
    );
  };

  return (
    <Dialog
      header="User List"
      headerStyle={{ padding: "16px 18px 8px 24px" }}
      visible={isOpen}
      style={{ width: "30rem", minHeight: "30rem" }}
      footer={renderFooter}
      onHide={() => setIsOpen(false)}
    >
      <InputText
        placeholder="Search name user"
        className="my-2 w-full"
        autoFocus
      />

      <ScrollPanel
        style={{ width: "100%", height: "400px" }}
        className="rounded-md"
      >
        <div className="flex gap-3 items-center justify-between p-2 hover:bg-primary-50 w-full rounded-md">
          <div className="flex gap-3 items-center w-73/100">
            <Avatar
              image="https://res.cloudinary.com/dynupxxry/image/upload/v1668657591/Ellipse_2_cx8wmw.png"
              className="mr-2"
              size="large"
              shape="circle"
            />

            <span className="line-clamp-1 font-semibold">
              Ho Nguyen Cong Sang
            </span>
          </div>

          <Button
            label="ADD"
            className=" text-sm p-button-rounded p-button-outlined py-1 px-2 font-semibold"
          />

          {/* <Button
            label="REMOVE"
            className=" p-button-outlined p-button-secondary text-sm p-button-rounded py-1 px-2 font-semibold"
          /> */}
        </div>
      </ScrollPanel>
    </Dialog>
  );
};

export default ModalUserList;
