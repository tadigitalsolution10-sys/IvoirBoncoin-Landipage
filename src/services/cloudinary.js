const CLOUD_NAME = "da8cizns6"; 
const UPLOAD_PRESET = "ivoirLandipage";

export const uploadToCloudinary = async (file) => {
  if (!file) return null;

  if (!file.type.startsWith("image/")) {
    throw new Error("Fichier non valide");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Erreur upload");
    }

    return data.secure_url;

  } catch (error) {
    console.error("Cloudinary Error:", error);
    throw error;
  }
};