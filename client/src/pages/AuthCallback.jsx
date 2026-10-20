import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const id = urlParams.get("id");
    const name = urlParams.get("name") || "";
    const email = urlParams.get("email") || "";
    const pic = urlParams.get("pic") || "";

    if (token && id) {
      const userObj = {
        _id: id,
        name,
        email,
        profilePic: pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=fed7aa&color=c2410c&bold=true`
      };
      localStorage.setItem("token", token);
      localStorage.setItem("id", id);
      localStorage.setItem("userId", id);
      localStorage.setItem("user", JSON.stringify(userObj));
      navigate("/main", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
        <p className="text-sm font-semibold text-slate-700">Signing you in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
