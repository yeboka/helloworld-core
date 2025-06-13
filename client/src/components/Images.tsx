import React, { useEffect } from 'react';
import { useQuery } from "@apollo/client";
import { Image } from 'antd'
import { GET_IMAGES } from "../api/queries";
import { useImageStore } from "../store/imageStore";

const Images: React.FC = () => {

  const { loading, error, data, refetch } = useQuery(GET_IMAGES);

  const {
    images,
    setImages,
    isModalOpen,
  } = useImageStore();

  useEffect(() => {
    if (!data) return;
    setImages(data.images ?? []);
  }, [data])

  useEffect(() => {
    refetch();
  }, [isModalOpen])

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div className={"columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2 w-full"}>
        {images.map((image: { id: string; url: string; }) => (
          <div key={image.id} >
            <Image
              className={'w-full rounded-md'}
              src={image.url}
              preview={{
                src: image.url,
              }}
              loading={"lazy"}
            />
          </div>
        ))}
    </div>
  );
};

export default Images;