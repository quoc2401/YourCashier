import { FC } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Navigate, Link } from "react-router-dom";
import { Button } from "primereact/button";
import { API_ACCOUNT } from "@/services/axiosClient";
import { setAuthToken } from "@/services/axiosClient";
import { toast } from "react-toastify";
import { useStore } from "@/services/stores";
import { useTitle } from "@/hooks/useTitle";
import { useState, useEffect } from "react";
import UsernameField from "./components/UsernameField";
import PasswordField from "./components/PasswordField";
import EmailField from "./components/EmailField";
import FirstNameField from "./components/FirstNameField";
import LastNameField from "./components/LastNameField";
import ProfilePictureField from "./components/ProfilePictureField";

const SignUp: FC = () => {
  useTitle("Your Cashier - Login");

  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const currentUser = useStore((state) => state.currentUser);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("/images/default_user.jpg");
  const [profilePicture, setProfilePicture] = useState<Blob | null>(null);

  useEffect(() => {
    if (profilePicture)
      setPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        const url = URL.createObjectURL(profilePicture);
        return url;
      });
  }, [profilePicture]);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      profilePicture: null,
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Username is required!")
        .min(5, "Username must be at least 5 characters!"),
      email: Yup.string()
        .email("example@example.com")
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required!")
        .min(5, "Password must be at least 5 characters!"),
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      profilePicture: Yup.mixed().required(),
    }),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (value) => {
      setLoading(true);
      try {
        const res = await API_ACCOUNT.API_AUTH.apiSignUp(value);

        if (res.status === 200) {
          localStorage.setItem("user-token", res.data.access_token);
          localStorage.setItem("refresh-token", res.data.refresh_token);
          setAuthToken(res.data.access_token);

          setCurrentUser(res.data);
          toast.success("Signup successful", {
            theme: "colored",
          });
        }
        setLoading(false);
      } catch (error) {
        toast.error(error.message, { theme: "colored" });
        setLoading(false);
      }
    },
  });

  if (currentUser) return <Navigate to={"/"} />;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-slate-200"
      style={{
        backgroundImage:
          "url(https://demos.creative-tim.com/vue-argon-design-system-pro/img/ill/404.svg)",
        backgroundPosition: "50%",
        backgroundSize: "cover",
      }}
    >
      <div className="relative w-[500px] max-w-mx-4 min-h-[460px] bg-white rounded-lg px-4 py-7 shadow-lg">
        <div className="flex flex-col justify-center items-center">
          <h5 className="text-2xl font-semibold text-primary-300">
            Your Cashier
          </h5>
          <p className="text-sm text-slate-400 mt-2">Register new account</p>
        </div>
        <img
          src={preview}
          alt="default_user"
          className="rounded-full m-auto border border-solid border-slate-300 !w-16 !h-16 object-cover"
        />
        <form onSubmit={formik.handleSubmit} className="p-fluid space-y-6 mt-6">
          <UsernameField
            value={formik.values.username}
            error={formik.errors.username}
            loading={loading}
            onChange={formik.handleChange}
          />
          <PasswordField
            value={formik.values.password}
            error={formik.errors.password}
            loading={loading}
            onChange={formik.handleChange}
          />
          <EmailField
            value={formik.values.email}
            error={formik.errors.email}
            loading={loading}
            onChange={formik.handleChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <FirstNameField
              value={formik.values.firstName}
              error={formik.errors.firstName}
              loading={loading}
              onChange={formik.handleChange}
            />
            <LastNameField
              value={formik.values.lastName}
              error={formik.errors.lastName}
              loading={loading}
              onChange={formik.handleChange}
            />
          </div>
          <ProfilePictureField
            error={formik.errors.profilePicture}
            loading={loading}
            setFieldValue={formik.setFieldValue}
            setProfilePicture={setProfilePicture}
          />
          <Button
            disabled={loading}
            loading={loading}
            type="submit"
            label="SIGN UP"
            className="!bg-primary-300 p-3 font-medium"
          />
        </form>
        {/* sub commands here */}
        <div className="w-100 mt-2">
          <Link
            to="/login"
            className="text-xs italic font-semibold text-primary-100 hover:text-secondary-200"
          >
            Already have an account? Sign in!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
