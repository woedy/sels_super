import {
  FaHome,
  FaSearch,
  FaBell,
  FaTh,
  FaSignOutAlt,
  FaArrowLeft,
} from "react-icons/fa";
import SideNav from "../../components/SideNavigator";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = process.env.REACT_APP_BASE_URL + "/api/settings/reset-demo/";

    setLoading(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify(data)
      });

      const responseData = await response.json(); // Parse response body as JSON

      if (response.status === 200) {
        // Redirect to dashboard or perform other actions
        console.log("Successful");
        console.log(responseData.data);
        navigate("/presenter-dashboard");
      } else if (response.status === 400) {
        setError(responseData.errors);
      } else {
        // Login failed, display error message
        console.error("Data failed:", responseData.message);
      }
    } catch (error) {
      // Network or other errors
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative h-screen bg-cover bg-no-repeat bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`,
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-12 gap-5 mx-10 h-screen w-screen p-5">
          <SideNav />

          <div className="col-span-11 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center">
            <div>
              <p
                className="text-white text-center text-2xl font-bold mb-3"
                style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
              >
                RESET ELECTION
              </p>
              <div>
                <div className="grid gap-4 grid-cols-2 grid-rows-1 mr-5"></div>

                <div className="grid gap-4 grid-cols-1 grid-rows-2 items-center justify-center ">
                  <form onSubmit={handleSubmit}>
                    {error && (
                      <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                        role="alert"
                      >
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                      </div>
                    )}



<button type="submit" className="flex items-center justify-center w-full h-full">
  {loading ? (
    <div role="status" className="flex items-center justify-center">
      <svg
        aria-hidden="true"
        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only text-white">Loading...</span>
    </div>
  ) : (
    <div className="w-150 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
      <p
        className="text-white text-xl font-bold p-4 text-center"
        style={{
          textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        }}
      >
        RESET DEMO
      </p>
    </div>
  )}
</button>

                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
