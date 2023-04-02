import { formatCurrency, formatDate } from "@/utils";

export const moneyBodyTemplate = (rowData: any) => {
    return formatCurrency(rowData.amount)
}

export const dateBodyTemplate = (rowData: any) => {
    return formatDate(rowData.created_date)
}

export const deleteBodyTemplate = (rowData: any, handleDelete: any, editingRows: any) => {
    return (
        <i 
            className={`pi pi-times cursor-pointer ${rowData.id in editingRows ? "hidden" : ""}`}
            onClick={e => handleDelete(rowData)}
        />
    )
}