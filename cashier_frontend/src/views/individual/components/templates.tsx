import { formatCurrency } from "@/utils";

export const moneyBodyTemplate = (rowData: any) => {
    return formatCurrency(rowData.amount)
}