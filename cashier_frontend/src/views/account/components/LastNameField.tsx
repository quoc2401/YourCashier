import { InputText } from "primereact/inputtext";
import { FC } from "react";

interface LastNameFieldProps {
  loading: boolean;
  error: string | undefined;
  value: string;
  onChange: (e: any) => void;
}

const LastNameField: FC<LastNameFieldProps> = ({
  loading,
  error,
  value,
  onChange,
}) => {
  return (
    <div className="field field col-md-6 col-xs-12">
      <span className="p-float-label p-input-icon-right">
        <InputText
          disabled={loading}
          id="lastName"
          name="lastName"
          className={error ? "p-invalid" : ""}
          value={value}
          onChange={onChange}
          style={{ padding: "12px 32px 12px 12px" }}
        />
        <label
          htmlFor="lastName"
          className={error ? "p-error" : ""}
          style={{ left: "12px" }}
        >
          Last Name*
        </label>
      </span>
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
};

export default LastNameField;
