import { Outlet } from "react-router-dom";

const ChildLayout = () => {
  return (
    <div className="bg-background min-h-screen">
      <Outlet />
    </div>
  );
};

export default ChildLayout;
