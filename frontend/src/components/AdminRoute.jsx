import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;