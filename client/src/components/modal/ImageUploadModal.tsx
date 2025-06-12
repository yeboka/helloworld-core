import React, { useState } from 'react';
import type { UploadFile } from 'antd';
import { Button, Form, Modal, Typography, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { CREATE_IMAGE_MUTATION, GET_S3_SIGNED_URL_MUTATION } from "../../api/mutations";
import { useImageStore } from "../../store/imageStore";
import { useNotification } from "../../context/useNotificationContext";

interface ImageUploadFormValues {
  file?: UploadFile[];
}

const ImageUploadModal: React.FC = () => {
  const [form] = Form.useForm<ImageUploadFormValues>();
  const {
    isModalOpen,
    setIsModalOpen,
    setLoading,
    setError,
    reset,
    loading,
  } = useImageStore();

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [getSignedUrlMutation] = useMutation(GET_S3_SIGNED_URL_MUTATION);
  const [createImageRecordMutation] = useMutation(CREATE_IMAGE_MUTATION);

  const {success, error} = useNotification();

  const handleFileChange = ({fileList: newFileList}: { fileList: UploadFile[] }) => {
    const latestFile = newFileList.slice(-1);
    setFileList(latestFile);
    if (latestFile.length > 0) {
      setError(null);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    reset();
    form.resetFields();
    setFileList([]);
  };

  const onFinish = async (values: ImageUploadFormValues) => {
    if (!values.file || values.file.length === 0) {
      error("Ошибка", "Пожалуйста, выберите изображение для загрузки.")
      return;
    }

    const file = values.file[0].originFileObj;
    if (!file) {
      error("Ошбика", "Не удалось получить файл.")
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const {data: signedUrlData} = await getSignedUrlMutation({
        variables: {
          fileName: file.name,
          fileType: file.type,
        },
      });

      if (!signedUrlData || !signedUrlData.getS3SignedUrl) {
        throw new Error('Не удалось получить подписанный URL от сервера.');
      }

      const {uploadUrl, imageUrl: s3ImageUrl} = signedUrlData.getS3SignedUrl;

      const s3Response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
      });

      if (!s3Response.ok) {
        const errorText = await s3Response.text();
        throw new Error(`Ошибка загрузки в S3: ${s3Response.status} ${s3Response.statusText}. Ответ: ${errorText}`);
      }

      const {data: createImageData} = await createImageRecordMutation({
        variables: {
          url: s3ImageUrl,
        },
      });

      if (!createImageData || !createImageData.createImage) {
        throw new Error('Не удалось создать запись об изображении в базе данных.');
      }

      success("Изображение успешно загружено!", file.name)

      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);

    } catch (err: any) {
      setError(err.message);
      error('Ошибка', err.message);
      console.error('Ошибка загрузки изображения:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <button style={{border: 0, background: 'none'}} type="button">
      <PlusOutlined/>
      <div style={{marginTop: 8}}>Upload</div>
    </button>
  );

  return (
    <Modal
      title="Загрузка изображения"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          Загрузить и сохранить
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{description: ''}}
      >
        <Form.Item
          name="file"
          label="Изображение"
          rules={[{required: true, message: 'Пожалуйста, выберите изображение!'}]}
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) return e;
            return e?.fileList;
          }}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleFileChange}
            maxCount={1}
            accept="image/*"
            beforeUpload={(file) => {
              setFileList([file]);
              return false;
            }}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>

        {useImageStore.getState().error && (
          <Typography.Text type="danger" style={{marginTop: 10}}>
            Ошибка: {useImageStore.getState().error}
          </Typography.Text>
        )}
      </Form>
    </Modal>

  );
};

export default ImageUploadModal;