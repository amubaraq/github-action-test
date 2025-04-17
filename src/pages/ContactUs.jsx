import React, { useState } from "react";
import emailjs from "emailjs-com";
import {
  Mail,
  MessageSquare,
  User,
  Send,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "../components/tools/Alert";

const ContactUs = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    text: "",
    type: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      message: "",
    });
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const templateParams = {
        to_name: "Edirect",
        from_name: formData.fullName,
        message: formData.message,
        reply_to: formData.email,
      };

      await emailjs.send(
        "service_mfruavt",
        "template_cst1uc9",
        templateParams,
        "9Tp4XEvOsWGi69ktz"
      );

      showAlertMessage("Message sent successfully!", "success");

      resetForm();
    } catch (error) {
      showAlertMessage(
        "Failed to send message. Please try again.",
        "destructive"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const contactDetails = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Our support team is ready to help",
      value: "07000 555 666",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: Mail,
      title: "Email",
      description: "Send us an email anytime",
      value: "support@edirect.com",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      icon: MapPin,
      title: "Location",
      description: "Visit our headquarters",
      value: "24 Iyalla Street, Alausa, Lagos",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Overlay */}
      <div
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('${}')",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(0,0,0,0.6)",
        }}>
        <div className="text-center text-white px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Get In Touch With Edirect
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-200">
            Have a question, suggestion, or just want to say hello? We're here
            to help you connect and make your experience seamless.
          </p>
        </div>
      </div>

      {/* Contact Container */}
      <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white shadow-xl rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Send Us a Message
          </h2>

          {alertMessage.text && (
            <div
              className={`
              mb-6 p-4 rounded-lg flex items-center gap-3
              ${
                alertMessage.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }
            `}>
              {alertMessage.type === "success" ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <XCircle className="h-6 w-6" />
              )}
              {alertMessage.text}
            </div>
          )}

          <form onSubmit={sendEmail} className="space-y-5">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write your message here..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent" />
              ) : (
                <>
                  Send Message
                  <Send className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact Details */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Our Contact Information
          </h2>
          {contactDetails.map((detail, index) => (
            <div
              key={index}
              className={`
                ${detail.bgColor} 
                p-6 rounded-xl flex items-center 
                gap-6 border border-transparent 
                hover:border-opacity-50 transition-all
              `}>
              <div
                className={`
                ${detail.bgColor} ${detail.textColor} 
                p-4 rounded-full flex items-center justify-center
              `}>
                <detail.icon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {detail.title}
                </h3>
                <p className="text-gray-600 text-sm">{detail.description}</p>
                <p className="font-medium text-gray-800 mt-1">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

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

export default ContactUs;
