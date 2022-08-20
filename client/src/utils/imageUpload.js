// import cloudinary from "../cloud";

import { postDataApi } from "../api/userApi";

function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}


export const imageUploadPost = async (images) => {
  let imgArr = [];
  for (const item of images) {
    const formData = new FormData();
    if(item.camera) {
      console.log(dataURLtoBlob(item.camera))
      formData.append("file", dataURLtoBlob(item.camera));
      
    }
    else{
      formData.append("file", item);

    }

    const res= await postDataApi('/posts/upload-img',formData);
    const {public_id,url} = res.data
    imgArr.push({ public_id,url });
  }
  return imgArr;
};

