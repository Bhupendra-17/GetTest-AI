import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const id = urlParams.get("id");
    const name = urlParams.get("name");
    const email = urlParams.get("email");
    const pic = urlParams.get("pic");

    if (token && id) {
      localStorage.setItem("token", token);
      localStorage.setItem("id", id);
      localStorage.setItem("user", JSON.stringify({ name, email, pic }));
      navigate("/main", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return <p>Signing you in...</p>;
};

export default AuthCallback;
