import { FC } from "react";
import { Password } from "primereact/password";

interface PasswordFieldProps {
  loading: boolean;
  error: string | undefined;
  value: string;
  onChange: (e: any) => void;
}

const PasswordField: FC<PasswordFieldProps> = ({
  loading,
  error,
  value,
  onChange,
}) => {
  return (
    <div className="field">
      <span className="p-float-label p-input-icon-right">
        <Password
          disabled={loading}
          id="password"
          name="password"
          className={error ? "p-invalid" : ""}
          autoComplete="off"
          inputStyle={{ padding: "12px 32px 12px 12px" }}
          value={value}
          onChange={onChange}
          feedback={false}
          toggleMask
        />
        <label
          htmlFor="password"
          className={error ? "p-error" : ""}
          style={{ left: "12px" }}
        >
          Password*
        </label>
      </span>
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
};

export default PasswordField;
