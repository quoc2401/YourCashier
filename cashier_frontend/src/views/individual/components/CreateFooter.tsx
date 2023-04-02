import { Button } from "primereact/button";
import { FC, MouseEventHandler } from "react";

interface CreateFooterProps {
    yesAction: MouseEventHandler
    noAction: MouseEventHandler
}

const CreateFooter: FC<CreateFooterProps> = ({
    yesAction,
    noAction
}) => {

    return (
        <>
      <Button
        label="Yes"
        icon="pi pi-plus"
        className="rounded-md mr-2"
        onClick={yesAction}
      />
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-danger rounded-md mr-2"
        onClick={noAction}
      />
    </>
    )
}

export default CreateFooter