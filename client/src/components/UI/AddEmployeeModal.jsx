import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DuplicateEmployeeNoModal from "./DuplicateEmployeeNoModal";

import Button from "../UI/Button";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

import PersonalDetailsModal from "../Composite/PersonalDetailsModal";
import PayrollInfoModal from "../Composite/PayrollInfoModal";
import UploadImageModal from "../Composite/UploadImageModal";

/* ===================== REQUIRED FIELDS ===================== */
const REQUIRED_FIELDS_STEP_1 = {
  employeeNo: "Employee No.",
  fullName: "Full Name",
  dateHired: "Date Hired",
  department: "Department",
  dateOfBirth: "Date of Birth",
  civilStatus: "Civil Status",
};

const REQUIRED_FIELDS_STEP_2 = {
  employeeStatus: "Employee Status",
  designation: "Designation",
  basicRate: "Basic Rate",
};

/* ===================== VALIDATION HELPER ===================== */
function validateFields(requiredFields, form) {
  const missing = [];

  Object.entries(requiredFields).forEach(([key, label]) => {
    if (!form[key] || String(form[key]).trim() === "") {
      missing.push(label);
    }
  });

  return missing;
}

export default function AddEmployeeModal({
  isOpen,
  onClose,
  onEmployeeAdded,
}) {
  const [step, setStep] = useState(1);
  const [showduplicateModal, setshowDuplicateModal] = useState(false);

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
    employeeStatus: "",
    designation: "",
    basicRate: "",
    dailyRate: "",
    hourlyRate: "",
    leaveCredits: "",
    sssNo: "",
    hdmfNo: "",
    tinNo: "",
  });

  const [employeeImage, setEmployeeImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const resetAndClose = () => {
    setStep(1);
    setError(null);
    setLoading(false);
    onClose();
  };

  /* ===================== SUBMIT ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    /* 🔒 FRONTEND VALIDATION */
    const missingStep1 = validateFields(REQUIRED_FIELDS_STEP_1, form);
    const missingStep2 = validateFields(REQUIRED_FIELDS_STEP_2, form);

    if (missingStep1.length || missingStep2.length) {
      setError(
        `Please complete the following fields: ${[
          ...missingStep1,
          ...missingStep2,
        ].join(", ")}`
      );
      setLoading(false);
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (employeeImage) formData.append("image", employeeImage);

      const res = await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        headers: {
          "x-user-id": storedUser?.id,
        },
        body: formData,
      });

      const json = await res.json();

      if (res.status === 409 && json.code === "EMPLOYEE_NO_EXISTS") {
        setshowDuplicateModal(true);
        return;
      }

      if (!res.ok) {
        throw new Error(json.message || "Failed to add employee");
      }

      onEmployeeAdded(json.data);
      resetAndClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={resetAndClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* MODAL WRAPPER */}
          <motion.div
            className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-xl w-full max-w-6xl p-8 mt-10 mb-10"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              {/* HEADER */}
              <h2 className="text-xl font-bold text-primary text-center">
                Add New Employee
              </h2>

              <p className="text-gray-500 text-sm text-center mb-6">
                Step {step} of 2
              </p>

              {error && (
                <p className="text-red-500 text-center mb-4">{error}</p>
              )}

              {/* ===================== STEP 1 ===================== */}
              {step === 1 && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2">
                      <PersonalDetailsModal
                        form={form}
                        handleChange={handleChange}
                      />
                    </div>

                    <div className="flex justify-center items-start">
                      <UploadImageModal
                        selectedFile={employeeImage}
                        setSelectedFile={setEmployeeImage}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-10">
                    <Button
                      type="button"
                      className="bg-gray-100 text-secondary shadow-sm"
                      onClick={resetAndClose}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="button"
                      className="bg-secondary text-bg flex items-center gap-1 shadow-sm"
                      onClick={() => {
                        const missing = validateFields(
                          REQUIRED_FIELDS_STEP_1,
                          form
                        );

                        if (missing.length > 0) {
                          setError(
                            `Please complete the following fields: ${missing.join(
                              ", "
                            )}`
                          );
                          return;
                        }

                        setError(null);
                        setStep(2);
                      }}
                    >
                      Next <IoIosArrowForward />
                    </Button>
                  </div>
                </>
              )}

              {/* ===================== STEP 2 ===================== */}
              {step === 2 && (
                <>
                  <PayrollInfoModal
                    form={form}
                    handleChange={handleChange}
                  />

                  <div className="flex justify-end gap-3 mt-10">
                    <Button
                      type="button"
                      className="bg-gray-100 text-secondary flex items-center gap-1 shadow-sm"
                      onClick={() => setStep(1)}
                    >
                      <IoIosArrowBack /> Back
                    </Button>

                    <Button
                      type="button"
                      className="bg-gray-100 text-secondary shadow-sm"
                      onClick={resetAndClose}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      className="bg-secondary text-bg shadow-sm"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Add Employee"}
                    </Button>
                  </div>
                </>
              )}
            </motion.form>
          </motion.div>
        </>
      )}

      <DuplicateEmployeeNoModal
        isOpen={showduplicateModal}
        onClose={() => setshowDuplicateModal(false)}
      />
    </AnimatePresence>
  );
}
