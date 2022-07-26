// import cloudinary from "../cloud";

import { postDataApi } from "../api/userApi";

export const imageUpload = async (images) => {
  let imgArr = [];
  for (const item of images) {
    const formData = new FormData();
    if(item.camera) {
    formData.append("file", item.camera);
    }
    else{
      formData.append("file", item);

    }

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

export const imageUploadPost = async (images) => {
  let imgArr = [];
  for (const item of images) {
    const formData = new FormData();
    if(item.camera) {
    formData.append("file", item.camera);
      
    }
    formData.append("file", item);

    formData.append("upload_preset", "h3rodh6h");
    formData.append("cloud_name", "dtvwgsmrq");

    const res= await postDataApi('/posts/upload-img',formData);
    const {public_id,url} = res.data
    imgArr.push({ public_id,url });
  }
  return imgArr;
};

// console.log(cloudinary)