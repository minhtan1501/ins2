export const imageUpload = async (images) => {
  let imgArr = [];
  for (const item of images) {
    const formData = new FormData();
    if(item.camera) {
    formData.append("file", item.camera);
      
    }
    formData.append("file", item);

    formData.append("upload_preset", "h3rodh6h");
    formData.append("cloud_name", "dtvwgsmrq");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dtvwgsmrq/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    imgArr.push({ public_id: data.public_id, url: data.secure_url });
  }
  return imgArr;
};
