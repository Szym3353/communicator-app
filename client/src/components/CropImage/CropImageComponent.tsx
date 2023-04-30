import React from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import getCroppedImg from "./CropImage";

import "../../css/crop.css";
import Button from "../styled/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { updateUser } from "../../store/user";
import useClickObserver from "../../Hooks/useClickObserver";

const CropImageComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  //Click observer
  let cropRef = React.useRef<HTMLDivElement>(null);
  const { show, setShow } = useClickObserver(cropRef);

  React.useEffect(() => {
    if (!show) handleCancel();
  }, [show]);

  //Get image
  const [imageBase64, setImageBase64] = React.useState<string | null>(null);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (allowedTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setImageBase64(reader.result as string);
          setShow(true);
        };
      } else {
        alert("Allowed image types: jpeg, png, gif");
      }
    }
  };

  //Crop image
  const [crop, setCrop] = React.useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(
    null
  );
  const [croppedImage, setCroppedImage] = React.useState<any>(null);

  const onCropComplete = React.useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const showCroppedImage = React.useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageBase64,
        croppedAreaPixels,
        0
      );
      setCroppedImage(croppedImage);
      dispatch(updateUser({ category: "avatarURL", value: imageBase64 || "" }));
      handleCancel();
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels]);

  //Clear
  const handleCancel = () => {
    setImageBase64(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  return (
    <div className="crop-image">
      <label htmlFor="file-upload" className="crop-image__upload">
        Select image
        <input id="file-upload" type="file" onChange={handleInputChange} />
      </label>
      {imageBase64 && (
        <div className="crop-image__container" ref={cropRef}>
          <div className="crop-image__cropper">
            <Cropper
              image={imageBase64}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="crop-image__buttons">
            <Button value="Save" variant="clear" onClick={showCroppedImage} />
            <Button
              value="Cancel"
              variant="clear"
              color="red"
              onClick={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CropImageComponent;
