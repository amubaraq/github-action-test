import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import backendURL from "../../config";
import { Alert, AlertDescription } from "../../components/tools/Alert";

const AddProminentPeople = () => {
  const { token } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [biography, setBiography] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm({
    defaultValues: {
      referees: [
        { name: "", phone: "", relationship: "" },
        { name: "", phone: "", relationship: "" },
      ],
      achievements: [""],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "achievements",
  });

  const watchedAchievements = watch("achievements");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB");
        return;
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError("Only JPG, PNG, and WebP images are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setImageFile(file);
      setError(null);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();

      // Append basic fields
      formData.append("name", data.name);
      if (data.birth_date) formData.append("birth_date", data.birth_date);
      if (data.death_date) formData.append("death_date", data.death_date);
      if (data.nationality) formData.append("nationality", data.nationality);
      if (data.occupation) formData.append("occupation", data.occupation);
      formData.append("biography", biography);

      // Process achievements - filter out empty strings and ensure it's an array
      const achievementsArray = Array.isArray(data.achievements)
        ? data.achievements.filter((achievement) => achievement.trim() !== "")
        : [];

      if (Array.isArray(achievementsArray) && achievementsArray.length > 0) {
        achievementsArray.forEach((achievement, index) => {
          formData.append(`achievements[${index}]`, achievement);
        });
      }

      // Append referees as JSON array
      formData.append("referees", JSON.stringify(data.referees));

      // Append image if exists
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axios.post(
        `${backendURL}/api/prominent-people/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      showAlertMessage(
        "Submission successful! Your entry is pending for admin approval.",
        "success"
      );
      setSubmissionSuccess(true);
      reset();
      setImagePreview(null);
      setImageFile(null);
      setBiography("");
    } catch (err) {
      console.error("Submission error:", err.response?.data);
      showAlertMessage("Failed to submit. Please try again.", "destructive");

      setError(
        err.response?.data?.message ||
          err.response?.data?.error?.message ||
          err.response?.data?.details ||
          "Submission failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // React Quill modules configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      ["clean"],
    ],
  };
  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md mid:mt-16">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Submit a Prominent Person
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              {...register("birth_date")}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Death
            </label>
            <input
              {...register("death_date")}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nationality
            </label>
            <input
              {...register("nationality")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Occupation
            </label>
            <input
              {...register("occupation")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image (Max 2MB, JPG/PNG/WebP)
            </label>
            <div className="flex items-center gap-4">
              <label className="flex flex-col items-center px-4 py-2 bg-white rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50">
                <span className="text-sm font-medium">Choose File</span>
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imageFile && (
                <span className="text-sm text-gray-600">{imageFile.name}</span>
              )}
            </div>
            {imagePreview && (
              <div className="mt-3">
                <p className="text-sm text-gray-500 mb-1">Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 object-contain rounded-md border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>

        {/* Biography */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Biography *
          </label>
          <ReactQuill
            value={biography}
            onChange={setBiography}
            modules={quillModules}
            formats={quillFormats}
            className="bg-white rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            style={{ minHeight: "200px" }}
          />
          {!biography && (
            <p className="mt-1 text-sm text-red-600">Biography is required</p>
          )}
        </div>

        {/* Achievements */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Achievements
            </label>
            <button
              type="button"
              onClick={() => append("")}
              className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md">
              + Add Achievement
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  {...register(`achievements.${index}`)}
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Achievement ${index + 1}`}
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                    aria-label="Remove achievement">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Referees */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Referees (Minimum 2 Required)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[0, 1].map((index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3">
                  Referee {index + 1}
                </h4>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    {...register(`referees.${index}.name`, {
                      required: "Referee name is required",
                    })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.referees?.[index]?.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.referees[index].name.message}
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    {...register(`referees.${index}.phone`, {
                      required: "Phone number is required",
                      pattern: {
                        value: /^\+[1-9]\d{1,14}$/,
                        message:
                          "Phone number must be in E.164 format (e.g., +1234567890)",
                      },
                    })}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1234567890"
                  />
                  {errors.referees?.[index]?.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.referees[index].phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship *
                  </label>
                  <input
                    {...register(`referees.${index}.relationship`, {
                      required: "Relationship is required",
                    })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.referees?.[index]?.relationship && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.referees[index].relationship.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting || !biography}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit for Approval"
            )}
          </button>
        </div>
      </form>
      {/* Alert Component */}
      {showAlert && (
        <Alert
          variant={alertConfig.variant}
          show={showAlert}
          onClose={() => setShowAlert(false)}
          autoClose={true}
          autoCloseTime={5000}>
          <AlertDescription>{alertConfig.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AddProminentPeople;
