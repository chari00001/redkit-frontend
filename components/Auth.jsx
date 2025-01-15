"use client";

import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaApple, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginUser, setError } from "@/store/features/authSlice";

const Auth = ({ isOpen, onClose, initialMode = "login" }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (error) {
      setErrors((prev) => ({ ...prev, submit: error }));
    }
  }, [error]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "E-posta adresi gerekli";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi girin";
    }

    if (mode === "register") {
      if (!formData.username) {
        newErrors.username = "Kullanıcı adı gerekli";
      } else if (formData.username.length < 3) {
        newErrors.username = "Kullanıcı adı en az 3 karakter olmalı";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Parolalar eşleşmiyor";
      }

      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "Kullanım koşullarını kabul etmelisiniz";
      }
    }

    if (!formData.password) {
      newErrors.password = "Parola gerekli";
    } else if (formData.password.length < 6) {
      newErrors.password = "Parola en az 6 karakter olmalı";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (mode === "register") {
        dispatch(
          registerUser({
            email: formData.email,
            username: formData.username,
            password: formData.password,
          })
        );
      } else {
        dispatch(
          loginUser({
            email: formData.email,
            password: formData.password,
          })
        );
      }

      // Başarılı giriş/kayıt durumunda modalı kapat
      if (!error) {
        onClose();
        setFormData({
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
          agreeToTerms: false,
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Hata varsa temizle
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Global error'ı temizle
    if (error) {
      dispatch(setError(null));
    }
  };

  const socialButtons = [
    {
      icon: FcGoogle,
      label: "Google",
      onClick: () => console.log("Google login"),
      bgColor: "bg-white",
      textColor: "text-gray-800",
      borderColor: "border-gray-300",
    },
    {
      icon: FaGithub,
      label: "GitHub",
      onClick: () => console.log("GitHub login"),
      bgColor: "bg-[#24292e]",
      textColor: "text-white",
      borderColor: "border-transparent",
    },
    {
      icon: FaApple,
      label: "Apple",
      onClick: () => console.log("Apple login"),
      bgColor: "bg-black",
      textColor: "text-white",
      borderColor: "border-transparent",
    },
  ];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-white rounded-2xl p-8 w-full max-w-md relative overflow-hidden"
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </motion.button>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {mode === "login" ? "Tekrar Hoşgeldiniz" : "Hesap Oluştur"}
            </h2>
            <p className="text-gray-600">
              {mode === "login"
                ? "Sizi tekrar görmek güzel!"
                : "Hemen ücretsiz hesap oluşturun"}
            </p>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm text-center"
            >
              {errors.submit}
            </motion.div>
          )}

          {/* Social Login Buttons */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            {socialButtons.map((button) => (
              <motion.button
                key={button.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={button.onClick}
                className={`flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border ${button.borderColor} ${button.bgColor} ${button.textColor} font-medium transition-colors`}
              >
                <button.icon size={20} />
                <span>{button.label} ile devam et</span>
              </motion.button>
            ))}
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">veya</span>
            </div>
          </div>

          {/* Login/Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-posta"
                  className={`w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all ${
                    errors.email ? "ring-2 ring-red-500" : ""
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {mode === "register" && (
              <div>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Kullanıcı adı"
                    className={`w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all ${
                      errors.username ? "ring-2 ring-red-500" : ""
                    }`}
                    disabled={loading}
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>
            )}

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Parola"
                  className={`w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all ${
                    errors.password ? "ring-2 ring-red-500" : ""
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {mode === "register" && (
              <>
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Parolayı tekrar girin"
                      className={`w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all ${
                        errors.confirmPassword ? "ring-2 ring-red-500" : ""
                      }`}
                      disabled={loading}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-1"
                    disabled={loading}
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className="text-sm text-gray-600"
                  >
                    <span>
                      <a href="#" className="text-accent hover:underline">
                        Kullanım Koşulları
                      </a>{" "}
                      ve{" "}
                      <a href="#" className="text-accent hover:underline">
                        Gizlilik Politikası
                      </a>
                      'nı okudum ve kabul ediyorum
                    </span>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
                )}
              </>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-accent text-white py-3 px-4 rounded-xl font-medium hover:bg-accent/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    ⏳
                  </motion.span>
                  {mode === "login" ? "Giriş yapılıyor..." : "Kaydediliyor..."}
                </span>
              ) : mode === "login" ? (
                "Giriş Yap"
              ) : (
                "Hesap Oluştur"
              )}
            </motion.button>
          </form>

          {/* Switch Mode */}
          <p className="mt-6 text-center text-sm text-gray-600">
            {mode === "login"
              ? "Hesabınız yok mu? "
              : "Zaten hesabınız var mı? "}
            <button
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setErrors({});
                dispatch(setError(null));
              }}
              className="text-accent hover:underline font-medium"
            >
              {mode === "login" ? "Hesap Oluştur" : "Giriş Yap"}
            </button>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Auth;
