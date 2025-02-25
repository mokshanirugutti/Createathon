import { useUser } from "@/context/UserContext";
import {  Outlet, useNavigate } from "react-router";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const {user} = useUser();


  return user  ? <Outlet /> : <div className="">
    <div className="max-w-xl mx-auto mt-20">
      <h1 className="text-2xl text-red-500"> Unauthorized </h1>
      <button onClick={() => navigate('/')} className="my-3 px-4 py-2 bg-red-500 text-white rounded-md">Back to home</button>
    </div>
  </div>;
};

export default ProtectedRoute;
