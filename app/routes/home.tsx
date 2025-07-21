import { useNavigate } from "react-router";
import * as AuthService from "~/services/authService";
import { useEffect, useState } from "react";

export default function Home(): React.ReactElement {
  const [userData, setUserData] = useState<any>(null);

  const navigate = useNavigate();

  useEffect((): void => {
    const tokenType = sessionStorage.getItem("token_type");
    const accessToken = sessionStorage.getItem("access_token");

    if (!tokenType || !accessToken) {
      navigate("/login");
      return;
    }

    const fetchUser = async (): Promise<void> => {
      try {
        const user = await AuthService.getUser(tokenType, accessToken);
        setUserData(user.data);
      } catch (error) {
        console.log("Error fetching user data:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { name, email } = userData;

  const handleLogout = async (): Promise<void> => {
    const tokenType = sessionStorage.getItem("token_type");
    const accessToken = sessionStorage.getItem("access_token");

    if (!tokenType || !accessToken) {
      console.log("No tokens found, user is not logged in.");
      return;
    }

    try {
      await AuthService.logout(tokenType, accessToken);
      sessionStorage.removeItem("token_type");
      sessionStorage.removeItem("access_token");
      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <>
      {/* PAGE CONTAINER */}
      <div className="bg-gray-500 h-screen w-screen flex items-center justify-center">
        <div className="bg-gray-300 w-[350px] px-5 py-5 rounded-md drop-shadow-2xl">
          {/* USER DETAILS */}
          <div>
            <div>
              <b>Name: </b><h2>{name}</h2>
            </div>
            <div className="mt-2">
              <b>Email: </b><p>{email}</p>
            </div>
          </div>

          {/* LOGOUT BUTTON */}
          <div className="mt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full cursor-pointer rounded-lg bg-green-500 px-1 py-2 font-bold text-white"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
