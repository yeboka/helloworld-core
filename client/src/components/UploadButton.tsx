import React from 'react';
import { PlusOutlined } from "@ant-design/icons";
import { useImageStore } from "../store/imageStore";
import { Button } from "antd";

const UploadButton = () => {
  const {setIsModalOpen} = useImageStore()

  return (
    <>
      <div className="hidden sm:block" style={{ position: "sticky", top: 16, zIndex: 50 }}>
        <Button color={"blue"} variant={"dashed"} onClick={() => setIsModalOpen(true)}>
          Upload image
        </Button>
      </div>
      <button onClick={() => setIsModalOpen(true)} className={"px-4 h-[40px] sm:w-[50px] sm:h-[50px] sm:hidden rounded-lg bg-blue-500 z-50 flex items-center justify-between fixed gap-2 right-4 bottom-4 "}>
        <PlusOutlined color={"white"} /> <h3>Upload</h3>
      </button>
    </>

  );
};

export default UploadButton;