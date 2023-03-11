import { FC } from "react";
import { Outlet } from "react-router-dom";

const Home: FC = () => {
  return (
    <div>
      Home <Outlet></Outlet>
    </div>
  );
};

export default Home;
