import { FC } from "react";

const Footer: FC = () => {
  return (
    <div className="flex mt-4 justify-between text-slate-500 items-center p-3">
      <p className="text-sm">MyCashier &copy; 2023 Made with ❤️</p>
      <div className="flex items-center text-sm">
        <p>Source code: </p>
        <a
          href="https://github.com/quoc2401/PharmacyManager/"
          target="_blank"
          rel="noreferrer"
        >
          <i className="pi pi-github ml-2 text-lg"></i>
        </a>
      </div>
    </div>
  );
};

export default Footer;
