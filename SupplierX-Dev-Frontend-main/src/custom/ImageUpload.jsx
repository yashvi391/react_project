import React, { useState } from "react";
import { Button, Label } from "reactstrap";
import placeHolder from "../assets/images/avatars/images.png";

function ImageUpload({
  title,
  defaultImage,
  onChange,
  name,
  text,
  onReset,
  ...props
}) {
  const image = defaultImage || placeHolder;
  const [addImage, setAddImage] = useState(image);
  const onChangeAdd = (e) => {
    const reader = new FileReader(),
      files = e.target.files;
    reader.onload = () => {
      setAddImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
    if (typeof onChange === "function") {
      onChange(e);
    }
  };
  const handleImgReset = () => {
    setAddImage(image);
    onReset();
  };
  return (
    <div className="form-group d-flex">
      <div>
        <label className="d-block mt-1 mb-1">
          {title}
          {/* <span className="text-danger">*</span> */}
        </label>
        <img
          id=""
          className="rounded me-50"
          src={addImage}
          alt=""
          height="100px"
          style={{ maxWidth: "200px" }}
        />
      </div>
      <div className="d-flex align-items-end mt-75 ms-1">
        <div>
          <Button tag={Label} className="mb-75 me-75" size="sm" color="primary">
            Upload
            <input
              type="file"
              id="editCatImage"
              onChange={onChangeAdd}
              name={name}
              // accept="image/*"
              hidden
              {...props}
            />
          </Button>
          <Button
            className="mb-75"
            color="secondary"
            size="sm"
            outline
            onClick={handleImgReset}
          >
            Reset
          </Button>
          {text || ""}
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
