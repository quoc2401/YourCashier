import { FileUploadSelectParams } from "primereact";
import { FileUpload } from "primereact/fileupload";
import { FC, useState } from "react";

interface ProfilePictureFieldProps {
  loading: boolean;
  error: string | undefined;
  setFieldValue: (field: string, fileValue: any) => void;
  setProfilePicture: (file: File) => void;
}

const ProfilePictureField: FC<ProfilePictureFieldProps> = ({
  loading,
  error,
  setFieldValue,
  setProfilePicture,
}) => {
  const handleProfilePictureChange = (e: FileUploadSelectParams) => {
    const file = e.files && e.files[0];
    if (file) {
      setProfilePicture(file);
      setFieldValue("profilePicture", file);
    }
  };

  return (
    <div className="field">
      <label
        htmlFor="profilePicture"
        className={error ? "p-error" : ""}
        style={{ left: "12px" }}
      >
        Profile Picture*
      </label>
      <i className="pi pi-image mx-2" />
      <FileUpload
        disabled={loading}
        id="profilePicture"
        name="profilePicture"
        mode="basic"
        accept="image/*"
        maxFileSize={1000000}
        className={error ? "p-invalid" : ""}
        onSelect={handleProfilePictureChange}
        style={{ padding: "12px 32px 12px 12px" }}
      />

      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
};

export default ProfilePictureField;
