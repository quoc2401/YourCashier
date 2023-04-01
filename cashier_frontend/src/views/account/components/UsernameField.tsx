import { InputText } from "primereact/inputtext";
import { FC } from "react";

interface UsernameFieldProps {
  loading: boolean;
  error: string | undefined;
  value: string;
  onChange: (e: any) => void;
}

const UsernameField: FC<UsernameFieldProps> = ({
  loading,
  error,
  value,
  onChange,
}) => {
  return (
    <div className="field">
      <span className="p-float-label p-input-icon-right">
        <i className="pi pi-user" />
        <InputText
          disabled={loading}
          id="username"
          name="username"
          className={error ? "p-invalid" : ""}
          value={value}
          onChange={onChange}
          style={{ padding: "12px 32px 12px 12px" }}
        />
        <label
          htmlFor="username"
          className={error ? "p-error" : ""}
          style={{ left: "12px" }}
        >
          Username*
        </label>
      </span>
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
};

export default UsernameField;
