export const imageToBase64 = async (file) => {
  // Check if a file was selected
  if (!file) {
    return null; // Return null or handle the absence of the file accordingly
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);

  const data = await new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  return data;
};
