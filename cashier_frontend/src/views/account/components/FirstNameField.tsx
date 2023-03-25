import { InputText } from "primereact/inputtext"
import { FC } from "react"

interface FirstNameFieldProps {
    loading: boolean,
    error: string | undefined,
    value: string,
    onChange: (e: any) => void
}

const FirstNameField: FC<FirstNameFieldProps> = ({
    loading,
    error,
    value,
    onChange
}) => {
    return (
    <div className="field">
        <span className="p-float-label p-input-icon-right">
            <InputText
            disabled={loading}
            id="firstName"
            name="firstName"
            className={error ? 'p-invalid' : ''}
            value={value}
            onChange={onChange}
            style={{ padding: '12px 32px 12px 12px' }}
            />
            <label
            htmlFor="firstName"
            className={error ? 'p-error' : ''}
            style={{ left: '12px' }}
            >
            First Name*
            </label>
        </span>
        {error && (
            <p className="text-xs text-red-500 ml-1">
            {error}
            </p>
        )}
    </div>
    )
}

export default FirstNameField