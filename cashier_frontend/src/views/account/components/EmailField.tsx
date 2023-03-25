import { InputText } from "primereact/inputtext"
// import { Emai}
import { FC } from "react"

interface EmailFieldProps {
    loading: boolean,
    error: string | undefined,
    value: string,
    onChange: (e: any) => void
}

const EmailField: FC<EmailFieldProps> = ({
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
            id="email"
            name="email"
            className={error ? 'p-invalid' : ''}
            value={value}
            onChange={onChange}
            style={{ padding: '12px 32px 12px 12px' }}
            />
            <label
            htmlFor="email"
            className={error ? 'p-error' : ''}
            style={{ left: '12px' }}
            >
            Email*
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

export default EmailField