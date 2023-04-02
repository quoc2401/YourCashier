import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FC, MouseEventHandler } from "react";
import CreateFooter from "./CreateFooter";

interface CreateFormProps {
    formik: any
    openModal: boolean
    handleCreate: MouseEventHandler
    setOpenModal: (value: boolean) => void

}

const CreateFormModal: FC<CreateFormProps> = ({
    formik,
    openModal,
    handleCreate,
    setOpenModal,
}) => {
    return(
    <Dialog
    visible={openModal}
    style={{ width: '450px' }}
    header="Confirm"
    modal
    footer={
        <CreateFooter
        yesAction={handleCreate}
        noAction={() => setOpenModal(false)}
        />
    }
    onHide={() => setOpenModal(false)}
    >
        <form onSubmit={formik.handleSubmit}>
            <div className="field mb-5">
            <label htmlFor="amount">Amount</label>
            <InputText
                id="amount"
                name="amount"
                value={formik.values.name}
                required
                autoFocus
                placeholder="Enter amount..."
                className="rounded-md"
                onChange={formik.handleChange}
            />
            </div>
            <div className="field mb-5">
            <label htmlFor="description">Description</label>
            <InputText
                id="description"
                name="description"
                value={formik.values.description}
                required
                placeholder="Enter description..."
                className="rounded-md"
                onChange={formik.handleChange}
            />
            </div>
        </form>
    </Dialog>
    )
}

export default CreateFormModal