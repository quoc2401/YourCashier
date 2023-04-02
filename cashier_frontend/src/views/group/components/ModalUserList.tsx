import { FC, useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
// import { ScrollPanel } from "primereact/scrollpanel";
import { Avatar } from "primereact/avatar";
import { API_GROUP } from "@/services/axiosClient";
import InfiniteScroll from "react-infinite-scroll-component";
import { User } from "@/utils/responseInterfaces";
import { Skeleton } from "primereact/skeleton";
import { useStore } from "@/services/stores";

interface ModalUserListProps {
  setIsOpen: (e: boolean) => void;
  isOpen: boolean;
  initValue: any;
  setMemberValue: (value: any) => void;
}

const ModalUserList: FC<ModalUserListProps> = ({
  isOpen,
  setIsOpen,
  initValue,
  setMemberValue,
}) => {
  const currentUser = useStore((state) => state.currentUser);
  const [currentListUser, setCurrentListUser] = useState([...initValue]);
  const [users, setUsers] = useState<Array<User>>([]);
  const [totalRecords, setTotalRecords] = useState(10);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilter] = useState("");
  const lazyTimeOut = useRef<ReturnType<typeof setTimeout>>();
  const [lazyState, setLazyState] = useState({
    rows: 10,
    page: 1,
  });

  useEffect(() => {
    setCurrentListUser([...initValue]);
  }, [isOpen]);

  useEffect(() => {
    setLazyState({ ...lazyState, page: 1 });

    lazyTimeOut.current = setTimeout(async () => {
      setLoading(true);

      const { data: res } = await API_GROUP.API_GROUP.apiGetAllUsers(
        lazyState,
        filters
      );

      setUsers(res.data.filter((item: User) => item.id !== currentUser?.id));
      setTotalRecords(res.totalRecords);
      setLoading(false);
    }, 500);
    return () => clearTimeout(lazyTimeOut.current);
  }, [filters]);

  const loadUsers = async () => {
    if (users.length >= totalRecords - 1) {
      setHasMore(false);

      return;
    }

    setLazyState({ ...lazyState, page: lazyState.page++ });

    const { data: res } = await API_GROUP.API_GROUP.apiGetAllUsers(
      lazyState,
      filters
    );

    setUsers([
      ...users,
      ...res.data.filter((item: User) => item.id !== currentUser?.id),
    ]);
    setTotalRecords(res.totalRecords);
  };

  const saveDataUser = () => {
    setMemberValue(currentListUser);

    setIsOpen(false);
  };

  const addUser = (newUser: User) => {
    setCurrentListUser([...currentListUser, newUser]);
  };

  const removeUser = (user: User) => {
    const newList = currentListUser.filter((item) => item.id !== user.id);

    setCurrentListUser(newList);
  };

  const renderFooter = () => {
    return (
      <div>
        <Button
          label="Cancel"
          onClick={() => setIsOpen(false)}
          className="p-button-text p-button-danger font-semibold"
        />

        <Button
          type="button"
          label="Save"
          className="font-semibold p-button-primary"
          onClick={saveDataUser}
        />
      </div>
    );
  };

  return (
    <Dialog
      header="User List"
      headerStyle={{ padding: "16px 18px 8px 24px" }}
      visible={isOpen}
      style={{ width: "30rem", minHeight: "30rem" }}
      footer={renderFooter}
      onHide={() => setIsOpen(false)}
    >
      <InputText
        value={filters}
        placeholder="Search name user"
        className="my-2 w-full"
        autoFocus
        onChange={(e) => setFilter(e.target.value)}
      />

      <InfiniteScroll
        dataLength={users.length}
        next={loadUsers}
        hasMore={hasMore}
        loader={<Skeleton height="64px" className=" w-full rounded-md mt-2" />}
        height={400}
      >
        {loading ? (
          <>
            <Skeleton height="64px" className=" w-full rounded-md" />
            <Skeleton height="64px" className=" w-full rounded-md mt-2" />
          </>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex gap-3 items-center justify-between p-2 hover:bg-primary-50 w-full rounded-md"
            >
              <div className="flex gap-3 items-center w-73/100">
                <Avatar
                  image={
                    user.profile_picture ||
                    `https://res.cloudinary.com/dynupxxry/image/upload/v1660532211/non-avatar_nw91c3.png`
                  }
                  className="mr-2 object-cover"
                  size="large"
                  shape="circle"
                />

                <span className="line-clamp-1 font-semibold">
                  {user.last_name || `null`} {user.first_name}
                </span>
              </div>

              {!currentListUser.includes(user) ? (
                <Button
                  label="ADD"
                  className=" text-sm p-button-rounded p-button-outlined py-1 px-2 font-semibold"
                  onClick={() => addUser(user)}
                />
              ) : (
                <Button
                  label="REMOVE"
                  className=" p-button-outlined p-button-secondary text-sm p-button-rounded py-1 px-2 font-semibold"
                  onClick={() => removeUser(user)}
                />
              )}
            </div>
          ))
        )}
      </InfiniteScroll>
    </Dialog>
  );
};

export default ModalUserList;
