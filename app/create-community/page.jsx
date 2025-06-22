"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaImage, FaGlobe, FaLock, FaShieldAlt, FaTimes } from "react-icons/fa";
import { createCommunity } from "@/store/features/communitiesSlice";
import { toast } from "react-hot-toast";

const CreateCommunity = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.communities);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    visibility: "public",
    rules: "",
    tags: [],
    cover_image_url: "",
    is_featured: false,
  });

  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});

  // Eğer kullanıcı giriş yapmamışsa
  React.useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Topluluk oluşturmak için giriş yapmalısınız");
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Hata mesajını temizle
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;

    if (formData.tags.includes(tagInput.trim())) {
      toast.error("Bu etiket zaten eklenmiş");
      return;
    }

    setFormData({
      ...formData,
      tags: [...formData.tags, tagInput.trim()],
    });
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Topluluk adı gereklidir";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Topluluk adı en az 3 karakter olmalıdır";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.name.trim())) {
      newErrors.name =
        "Topluluk adı sadece harf, rakam ve alt çizgi içerebilir";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Topluluk açıklaması gereklidir";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Açıklama en az 10 karakter olmalıdır";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Lütfen formu eksiksiz doldurun");
      return;
    }

    try {
      await dispatch(createCommunity(formData)).unwrap();
      toast.success("Topluluk başarıyla oluşturuldu!");
      router.push("/community");
    } catch (error) {
      toast.error(`Topluluk oluşturulurken bir hata oluştu: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Yeni Topluluk Oluştur
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Topluluk Adı
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-gray-100 text-gray-500 rounded-l-lg border border-r-0 border-gray-300">
                r/
              </span>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`flex-1 rounded-r-lg border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent`}
                placeholder="AltinMadeni"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-red-500 text-sm">{errors.name}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Topluluk adı, oluşturulduktan sonra değiştirilemez.
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-2"
            >
              Topluluk Açıklaması
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={`w-full rounded-lg border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent`}
              placeholder="Topluluğunuzu kısaca tanımlayın..."
            />
            {errors.description && (
              <p className="mt-1 text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Görünürlük
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`border rounded-lg p-4 cursor-pointer ${
                  formData.visibility === "public"
                    ? "border-accent bg-accent/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() =>
                  handleChange({
                    target: { name: "visibility", value: "public" },
                  })
                }
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-accent/10 text-accent mx-auto mb-3">
                  <FaGlobe />
                </div>
                <h3 className="font-medium text-center">Herkese Açık</h3>
                <p className="text-gray-500 text-sm text-center mt-2">
                  Herkes görüntüleyebilir ve katılabilir
                </p>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer ${
                  formData.visibility === "restricted"
                    ? "border-accent bg-accent/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() =>
                  handleChange({
                    target: { name: "visibility", value: "restricted" },
                  })
                }
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-500/10 text-amber-500 mx-auto mb-3">
                  <FaShieldAlt />
                </div>
                <h3 className="font-medium text-center">Kısıtlı</h3>
                <p className="text-gray-500 text-sm text-center mt-2">
                  Herkes görüntüleyebilir, paylaşım yapabilmek için onay gerekir
                </p>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer ${
                  formData.visibility === "private"
                    ? "border-accent bg-accent/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() =>
                  handleChange({
                    target: { name: "visibility", value: "private" },
                  })
                }
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-500/10 text-gray-500 mx-auto mb-3">
                  <FaLock />
                </div>
                <h3 className="font-medium text-center">Özel</h3>
                <p className="text-gray-500 text-sm text-center mt-2">
                  Sadece onaylanan üyeler görüntüleyebilir ve katılabilir
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="rules"
              className="block text-gray-700 font-medium mb-2"
            >
              Topluluk Kuralları
            </label>
            <textarea
              id="rules"
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="1. Saygılı olun&#10;2. Spam yapmayın&#10;3. Konuyla ilgili paylaşım yapın"
            />
            <p className="mt-1 text-sm text-gray-500">
              Her kuralı yeni bir satıra yazın.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Etiketler
            </label>
            <div className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-1 rounded-l-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Etiket ekle..."
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-accent text-white rounded-r-lg hover:bg-accent/90"
              >
                Ekle
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-500 hover:text-red-500 p-0.5"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="cover_image_url"
              className="block text-gray-700 font-medium mb-2"
            >
              Kapak Görseli URL'si (İsteğe Bağlı)
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-gray-100 text-gray-500 rounded-l-lg border border-r-0 border-gray-300">
                <FaImage />
              </span>
              <input
                type="text"
                id="cover_image_url"
                name="cover_image_url"
                value={formData.cover_image_url}
                onChange={handleChange}
                className="flex-1 rounded-r-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {formData.cover_image_url && (
              <div className="mt-3 h-24 relative rounded-lg overflow-hidden">
                <img
                  src={formData.cover_image_url}
                  alt="Kapak görsel önizleme"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://picsum.photos/600/200";
                    toast.error("Görsel yüklenemedi, geçerli bir URL giriniz");
                  }}
                />
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="h-5 w-5 text-accent rounded border-gray-300 focus:ring-accent"
              />
              <span className="ml-2 text-gray-700">
                Öne Çıkan Topluluk Olarak İşaretle
              </span>
            </label>
            <p className="ml-7 text-sm text-gray-500">
              Bu topluluk ana sayfada öne çıkan topluluklar arasında
              gösterilebilir. (Site yöneticisinin onayı gerekir)
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>

            <motion.button
              type="submit"
              className="px-6 py-2.5 bg-accent text-white rounded-lg disabled:opacity-70"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? "Oluşturuluyor..." : "Topluluk Oluştur"}
            </motion.button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateCommunity;
