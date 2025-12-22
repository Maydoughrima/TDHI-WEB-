import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Button from "../UI/Button";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

// COMPONENTS
import PersonalDetailsModal from "../Composite/PersonalDetailsModal";
import PayrollInfoModal from "../Composite/PayrollInfoModal";
import UploadImageModal from "../Composite/UploadImageModal";

export default function AddEmployeeModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      /* BACKEND (commented)
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (employeeImage) formData.append("image", employeeImage);

      const res = await fetch("/api/employees", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to save employee");
      */

      console.log("SUBMIT:", { ...form, employeeImage });

      setLoading(false);
      resetAndClose();
    } catch (err) {
      setError(err.message);
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

          {/* MODAL */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-xl p-8 w-full max-w-6xl"
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

                    {/* 2-COLUMN PERSONAL FORM */}
                    <div className="lg:col-span-2">
                      <PersonalDetailsModal
                        form={form}
                        handleChange={handleChange}
                      />
                    </div>

                    {/* IMAGE UPLOAD */}
                    <div className="flex justify-center items-start">
                      <UploadImageModal
                        selectedFile={employeeImage}
                        setSelectedFile={setEmployeeImage}
                      />
                    </div>
                  </div>

                  {/* BUTTONS */}
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
                      onClick={() => setStep(2)}
                    >
                      Next <IoIosArrowForward />
                    </Button>
                  </div>
                </>
              )}

              {/* ===================== STEP 2 ===================== */}
              {step === 2 && (
                <>
                  <PayrollInfoModal form={form} handleChange={handleChange} />

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
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
