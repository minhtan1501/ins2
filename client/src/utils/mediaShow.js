export const imageShow = (src) => {
    return (
      <img
        className="block w-full max-h-[250px] h-full object-cover rounded"
        src={src}
        alt=""
      />
    );
  };

export const videoShow = (src,controls=false) => {
    return (
    
      <video
      controls={controls}
        className="block w-full max-h-[250px] object-cover h-full rounded"
        src={src}
        alt=""
      />
    );
  };