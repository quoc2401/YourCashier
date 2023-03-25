import { useStore } from "@/services/stores";
import { FC } from "react";

const SpendList: FC = () => {
  
  const currentUser = useStore(state => state.currentUser)

  return <div>SpendList</div>;
};

export default SpendList;
