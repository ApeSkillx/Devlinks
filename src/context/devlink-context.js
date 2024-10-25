"use client";

import { generateId } from "@/src/lib/utils/helpers";
import axios from "axios";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";


const DevlinksContext = createContext();

export const useDevlinksContext = () => {
  const context = useContext(DevlinksContext);
  if (context === undefined) {
    throw new Error(
      "useDevlinksContext must be used within a DevlinksProvider"
    );
  }
  return context;
};

export default function DevlinksProvider({ children }) {
  const [devlinksList, setDevlinksList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorField, setErrorField] = useState([]);
  const isListEdited = useRef(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const throwError = (id, status, errorObj) => {
    const existingError = errorField.find((item) => item.id === id);

    if (existingError) {
      setErrorField((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status, field: errorObj } : item
        )
      );
    } else {
      setErrorField((prev) => [...prev, { id, status, field: errorObj }]);
    }
  };

  const removeError = (id) => {
    setErrorField((prev) => prev.filter((item) => item.id !== id));
  };

  const changeIsEditedValue = (value) => {
    isListEdited.current = value;
  };

  const addNewLink = () => {
    isListEdited.current = true;
    const id = generateId();
    setDevlinksList((prev) =>
      prev
        ? [...prev, { id, platform: "", link: "" }]
        : [{ id, platform: "", link: "" }]
    );
  };

  const removeLink = (id) => {
    isListEdited.current = true;
    removeError(id);

    if (devlinksList.length === 1) {
      isListEdited.current = false;
    }

    setDevlinksList((prev) => prev.filter((link) => link.id !== id));
  };

  const addItemIntoList = (fieldId, platform, link) => {
    const existingLink = devlinksList.find((item) => item.id === fieldId);
    if (existingLink) {
      setDevlinksList((prev) =>
        prev.map((item) =>
          item.id === fieldId
            ? {
              ...item,
              platform,
              link,
            }
            : item
        )
      );
    } else {
      setDevlinksList((prev) => [
        ...prev,
        {
          id: fieldId,
          platform,
          link,
        },
      ]);
    }
  };

  const reorderList = (newOrderedList) => {
    isListEdited.current = true;
    setDevlinksList(newOrderedList);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const linkRegex = /^(ftp|http|https):\/\/([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;

    for (const link of devlinksList) {
      if (link.link.trim() === "") {
        throwError(link.id, true, {
          link: {
            error: true,
            message: "Can't be empty",
          },
        });
        return;
      } else if (link.link && !linkRegex.test(link.link)) {
        throwError(link.id, true, {
          link: {
            error: true,
            message: "Invalid URL",
          },
        });
        return;
      } else if (link.platform.trim() === "") {
        throwError(link.id, true, {
          platform: {
            error: true,
            message: "Can't be empty",
          },
        });
        return;
      }
    }

    isListEdited.current = false;
    try {
      await axios.patch('/api/devlinksList/default', { devlinksList }) // hardcoding username to default (no auth yet).
        .then(() => {
          toast("Saved", { duration: 1000 });
        });
    } catch (error) {
      console.error("Error updating devlinkList on server \n", error);
    }
  };

  useEffect(() => {
    if (
      isListEdited.current &&
      devlinksList.length > 0 &&
      !loading &&
      errorField.length === 0
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [isListEdited.current, devlinksList, loading, errorField]);

  // backend to get devlinks from server
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/devlinksList/default"); // hardcoding username to default ( since we don't have auth yet )
        setDevlinksList(res.data.devlinksList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const value = {
    loading,
    devlinksList,
    isListEdited,
    isButtonDisabled,
    addNewLink,
    removeLink,
    errorState: errorField,
    throwError,
    removeError,
    handleSubmit,
    addItemIntoList,
    changeIsEditedValue,
    reorderList,
  };

  return (
    <DevlinksContext.Provider value={value}>
      {children}
    </DevlinksContext.Provider>
  );
}
