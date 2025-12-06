import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextField from "../UI/Textfield";
import Dropdown from "../UI/Dropdown";
import EmpImage from "../UI/EmpImage";
import Button from "../UI/Button";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

export default function AddEmployeeModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    employeeNo: "",
    fullName: "",
    address: "",
    placeOfBirth: "",
    dateOfBirth: "",
    dateHired: "",
    department: "",
    position: "",
    emailAddress: "",
    nameOfSpouse: "",
    civilStatus: "",
    citizenship: "",
    spouseAddress: "",
    contactNo: "",
  });

  const [employeeImage, setEmployeeImage] = useState(null); // store the uploaded image
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // --------------------------
      // Backend API call (commented for now)
      /*
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (employeeImage) {
        formData.append("image", employeeImage);
      }

      const response = await fetch("/api/employees", {
        method: "POST",
        body: formData, // send FormData for file upload
      });

      if (!response.ok) {
        throw new Error("Failed to add employee");
      }

      const data = await response.json();
      console.log("Employee added:", data);
      */
      // --------------------------

      console.log("Simulated employee submission:", { ...form, employeeImage });
      setLoading(false);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-5xl"
            >
              <h2 className="text-xl font-bold mb-4 font-heading text-primary text-center">
                Add New Employee
              </h2>

              {error && <p className="text-red-500 text-center mb-4">{error}</p>}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN */}
                <div className="flex flex-col gap-4">
                  <TextField
                    label="Employee No."
                    value={form.employeeNo}
                    onChange={(e) => handleChange("employeeNo", e.target.value)}
                  />
                  <TextField
                    label="Full Name"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                  />
                  <TextField
                    label="Address"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                  <TextField
                    label="Place of Birth"
                    value={form.placeOfBirth}
                    onChange={(e) =>
                      handleChange("placeOfBirth", e.target.value)
                    }
                  />
                  <TextField
                    label="Date of Birth"
                    value={form.dateOfBirth}
                    onChange={(e) =>
                      handleChange("dateOfBirth", e.target.value)
                    }
                  />
                  <div className="flex flex-col gap-4">
                    <Dropdown
                      label="Civil Status"
                      value={form.civilStatus}
                      onChange={(e) =>
                        handleChange("civilStatus", e.target.value)
                      }
                      options={[
                        { value: "single", label: "Single" },
                        { value: "married", label: "Married" },
                        { value: "widowed", label: "Widowed" },
                      ]}
                    />
                    <TextField
                      label="Citizenship"
                      value={form.citizenship}
                      onChange={(e) => handleChange("citizenship", e.target.value)}
                    />
                  </div>
                </div>

                {/* MIDDLE COLUMN */}
                <div className="flex flex-col gap-4">
                  <TextField
                    label="Date Hired"
                    value={form.dateHired}
                    onChange={(e) => handleChange("dateHired", e.target.value)}
                  />
                  <TextField
                    label="Department"
                    value={form.department}
                    onChange={(e) => handleChange("department", e.target.value)}
                  />
                  <TextField
                    label="Position"
                    value={form.position}
                    onChange={(e) => handleChange("position", e.target.value)}
                  />
                  <TextField
                    label="Email Address"
                    value={form.emailAddress}
                    onChange={(e) =>
                      handleChange("emailAddress", e.target.value)
                    }
                  />
                  <TextField
                    label="Name of Spouse"
                    value={form.nameOfSpouse}
                    onChange={(e) =>
                      handleChange("nameOfSpouse", e.target.value)
                    }
                  />
                  <TextField
                    label="Contact No."
                    value={form.contactNo}
                    onChange={(e) => handleChange("contactNo", e.target.value)}
                  />
                  <TextField
                    label="Spouse Address"
                    value={form.spouseAddress}
                    onChange={(e) =>
                      handleChange("spouseAddress", e.target.value)
                    }
                  />

                  {/* ADD / CANCEL BUTTONS */}
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      type="submit"
                      className="bg-secondary border border-gray-300 shadow-sm"
                      disabled={loading}
                    >
                      Add Employee
                    </Button>

                    <Button
                      type="button"
                      onClick={onClose}
                      className="bg-gray-100 text-secondary border border-gray-300 shadow-sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>

                {/* PHOTO COLUMN */}
                <EmpImage
                  selectedFile={employeeImage}
                  setSelectedFile={setEmployeeImage} // allow image selection
                />
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
