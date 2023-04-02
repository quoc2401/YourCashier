import { FC, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import { Chip } from "primereact/chip";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import ModalUserList from "./ModalUserList";
import { Group, User } from "@/utils/responseInterfaces";
import { API_GROUP } from "@/services/axiosClient";

interface ModalCreateGroupProps {
  title: string;
  setIsOpen: (e: boolean) => void;
  isOpen: boolean;
  setGroupList: (group: Group) => void;
}

const ModalCreateGroup: FC<ModalCreateGroupProps> = ({
  title,
  isOpen,
  setIsOpen,
  setGroupList,
}) => {
  const [loading, setLoading] = useState(false);
  const [openModalUserList, setOpenModalUserList] = useState(false);

  const closeDialog = () => {
    setIsOpen(false);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      member: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Purpose is required!"),
      member: Yup.array().min(1, "Member must be at least 1 member!"),
    }),
    onSubmit: async (value) => {
      setLoading(true);
      try {
        const res = await API_GROUP.API_GROUP.apiCreateGroup({
          name: value.name,
          users: value.member.map((user: User) => user.id),
          is_active: true,
        });

        if (res.status === 200) {
          setGroupList(res.data);

          toast.success("Create group successful", {
            theme: "colored",
          });

          closeDialog();
        }
        setLoading(false);
      } catch (error) {
        toast.error(error.message, { theme: "colored" });
        setLoading(false);
      }
    },
  });

  const onRemoveMember = (user: User) => {
    if (loading) return;

    const listMember = formik.values.member.filter(
      (item: User) => item.id !== user.id
    );

    formik.setFieldValue("member", listMember);
  };

  const renderFooter = () => {
    return (
      <div>
        <Button
          label="Cancel"
          onClick={() => closeDialog()}
          autoFocus
          className="p-button-text p-button-danger font-semibold"
        />

        <Button
          type="button"
          label="Create"
          loading={loading}
          className="font-semibold p-button-primary"
          onClick={() => formik.handleSubmit()}
        />
      </div>
    );
  };
  return (
    <>
      <ModalUserList
        isOpen={openModalUserList}
        setIsOpen={setOpenModalUserList}
        initValue={formik.values.member}
        setMemberValue={(newValue) => formik.setFieldValue("member", newValue)}
      />

      <Dialog
        header={title}
        headerStyle={{ padding: "16px 24px 8px" }}
        visible={isOpen}
        style={{ width: "35rem" }}
        footer={renderFooter}
        onHide={() => closeDialog()}
      >
        <form onSubmit={formik.handleSubmit} className="p-fluid space-y-6 mt-7">
          <div className="field">
            <div className="p-float-label">
              <InputText
                disabled={loading}
                id="name"
                name="name"
                className={formik.errors.name ? "p-invalid" : ""}
                value={formik.values.name}
                onChange={formik.handleChange}
              />

              <label
                htmlFor="name"
                className={formik.errors.name ? "p-error" : ""}
              >
                Purpose <span className="text-red-500">*</span>
              </label>
            </div>

            {formik.errors.name && (
              <small className="p-error">{formik.errors.name}</small>
            )}
          </div>

          <div className="field">
            <div className="flex justify-between mb-2">
              <div
                className={formik.errors.member ? "p-error" : ""}
                style={{ left: "12px" }}
              >
                Member <span className="text-red-500">*</span>
              </div>

              <Button
                type="button"
                label="Add member"
                className="flex-0 p-button-success p-button-text max-w-max !p-0"
                onClick={() => setOpenModalUserList(true)}
              />
            </div>

            <ScrollPanel
              style={{ width: "100%", height: "180px" }}
              className="bg-slate-50 rounded-md p-2"
            >
              {formik.values.member.length > 0 ? (
                formik.values.member.map((user: User) => (
                  <Chip
                    key={user.id}
                    label={user.first_name}
                    image={
                      user.profile_picture ||
                      `https://res.cloudinary.com/dynupxxry/image/upload/v1660532211/non-avatar_nw91c3.png`
                    }
                    className="mb-2 mr-2"
                    removable
                    onRemove={() => onRemoveMember(user)}
                  />
                ))
              ) : (
                <div className="text-center text-slate-400 mt-2">
                  No members yet
                </div>
              )}
            </ScrollPanel>

            {formik.errors.member && (
              <small className="p-error">{formik.errors.member}</small>
            )}
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default ModalCreateGroup;
