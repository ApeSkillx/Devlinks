"use client";

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const UserProfileContext = createContext();

export const useUserProfileContext = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error(
      "useUserProfileContext must be used within a UserProfileProvider"
    );
  }
  return context;
};

export default function UserProfileProvider({ children }) {
  const [userObject, setUserObject] = useState({
    username: "default",
    first_name: "",
    last_name: "",
    email: "",
    profile_picture: "",
    profile_picture_publicId: ""
  });
  const [userProfilePicFile, setUserProfilePicFile] = useState(null);
  const [userProfilePicURL, setUserProfilePicURL] = useState(null);
  const [userProfilePicMockup, setUserProfilePicMockup] = useState(null);
  const [hasAnyChanges, setHasAnyChanges] = useState(false);
  const [errorObject, setErrorObject] = useState({});
  const [hasError, setHasError] = useState(false);
  const [imageProcessLoading, setImageProcessLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleTempUserProfilePic = (imageURL) => {
    setUserProfilePicURL(imageURL);
  }

  const handleUserProfilePicMockup = (imageURL) => {
    setUserProfilePicMockup(imageURL);
  };

  const handleUserProfilePic = (imageFile) => {
    setHasAnyChanges(true);
    setUserProfilePicFile(imageFile);
  };

  const deletePreviousProfilPicFromCloudinary = async (publicId) => {
    try {
      const res = await axios.delete(`/api/image-upload/`, {
        data: { publicId }
      });
      if (res?.request?.status >= 200 && res?.request?.status <= 300) {
        setUserProfilePicURL("");
        setUserObject((prev) => ({ ...prev, profile_picture: "", profile_picture_publicId: "" }));
      }
    } catch (error) {
      console.error("Error deleting image from cloudinary:\n", error);
    }
  }

  const uploadUserProfilePicToCloudinary = async (picFile) => {
    setImageProcessLoading(true);
    const formData = new FormData();
    formData.append("file", picFile);
    try {
      const res = await axios.post("/api/image-upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure the content type is set
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error uploading the image:", error);
    } finally {
      setImageProcessLoading(false);
    };
  };

  const handleFieldEdit = (value) => {
    setHasAnyChanges(value);
  };

  const handleError = (error) => {
    setErrorObject(error);
  };

  const handleUserInputs = (name, value) => {
    setUserObject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (hasError) return;

    if (userObject["first_name"]?.trim() === "") {
      setErrorObject((prev) => ({
        ...prev,
        first_name: { status: true, message: "Can't be empty" },
      }));
      return;
    } else if (userObject["last_name"]?.trim() === "") {
      setErrorObject((prev) => ({
        ...prev,
        last_name: { status: true, message: "Can't be empty" },
      }));
      return;
    }

    // handle backend submit below
    setLoading(true);

    if (userProfilePicFile) {
      if (userProfilePicURL?.trim() !== "") {
        await deletePreviousProfilPicFromCloudinary(userObject.profile_picture_publicId);
      }
      const res = await uploadUserProfilePicToCloudinary(userProfilePicFile);
      setUserProfilePicURL(res.url);
      setUserObject((prev) => ({ ...prev, profile_picture: res.url, profile_picture_publicId: res.publicId }));

      await axios.patch('/api/user/default', { // hardcoding username to default (no auth yet)
        ...userObject,
        profile_picture: res.url,
        profile_picture_publicId: res.publicId,
      });
    } else {
      await axios.patch('/api/user/default', { // hardcoding username to default (no auth yet)
        ...userObject
      })
    }

    toast("Saved", { duration: 1000 });
    setHasAnyChanges(false);
    setLoading(false);
  };

  useEffect(() => {
    const hasError = Object.values(errorObject).some((error) => error.status);
    setHasError(hasError);
  }, [errorObject]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const user = await axios.get('/api/user/default'); // hardcoding user to default (no auth yet).
        const allUserData = user.data.user;
        const userData = {
          first_name: allUserData.first_name || '',
          last_name: allUserData.last_name || '',
          email: allUserData.email || '',
          profile_picture: allUserData.profile_picture || '',
          profile_picture_publicId: allUserData.profile_picture_publicId || ''
        }
        setUserObject(userData);
        setUserProfilePicURL(userData.profile_picture);
      } catch (error) {
        throw new Error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (hasAnyChanges && !hasError && !loading && !imageProcessLoading) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [hasAnyChanges, hasError, errorObject, loading, imageProcessLoading]);

  const values = {
    userProfilePicMockup,
    userObject,
    errorObject,
    hasError,
    handleError,
    loading,
    handleTempUserProfilePic,
    handleUserProfilePicMockup,
    handleFieldEdit,
    buttonDisabled,
    userProfilePicURL,
    handleUserProfilePic,
    handleUserInputs,
    handleSubmit,
  };

  return (
    <UserProfileContext.Provider value={values}>
      {children}
    </UserProfileContext.Provider>
  );
}
