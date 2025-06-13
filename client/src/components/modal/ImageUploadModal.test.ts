import { uploadImage } from './ImageUploadModal';

describe('uploadImage', () => {
  const mockFile = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
  const mockSignedUrl = 'https://s3.example.com/upload-url';
  const mockS3ImageUrl = 'https://s3.example.com/test-image.png';

  let mockGetSignedUrlMutation: jest.Mock<any, any[]>; // Corrected type
  let mockFetch: jest.Mock<any, any[]>; // Corrected type

  beforeEach(() => {
    mockGetSignedUrlMutation = jest.fn();
    mockFetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully upload an image to S3 and return the image URL', async () => {
    mockGetSignedUrlMutation.mockResolvedValueOnce({
      data: {
        getS3SignedUrl: {
          uploadUrl: mockSignedUrl,
          imageUrl: mockS3ImageUrl,
        },
      },
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: () => Promise.resolve(''),
    });

    const result = await uploadImage(mockFile, mockGetSignedUrlMutation, mockFetch);

    expect(mockGetSignedUrlMutation).toHaveBeenCalledTimes(1);
    expect(mockGetSignedUrlMutation).toHaveBeenCalledWith({
      variables: {
        fileName: mockFile.name,
        fileType: mockFile.type,
      },
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(mockSignedUrl, {
      method: 'PUT',
      body: mockFile,
    });

    expect(result).toBe(mockS3ImageUrl);
  });

  it('should throw an error if getSignedUrlMutation fails', async () => {
    mockGetSignedUrlMutation.mockResolvedValueOnce({
      data: {
        getS3SignedUrl: null, // Или отсутствуют данные
      },
    });

    await expect(uploadImage(mockFile, mockGetSignedUrlMutation, mockFetch)).rejects.toThrow(
      'Не удалось получить подписанный URL от сервера.'
    );

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should throw an error if S3 upload fails', async () => {
    mockGetSignedUrlMutation.mockResolvedValueOnce({
      data: {
        getS3SignedUrl: {
          uploadUrl: mockSignedUrl,
          imageUrl: mockS3ImageUrl,
        },
      },
    });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: () => Promise.resolve('Something went wrong on S3'),
    });

    await expect(uploadImage(mockFile, mockGetSignedUrlMutation, mockFetch)).rejects.toThrow(
      'Ошибка загрузки в S3: 500 Internal Server Error. Ответ: Something went wrong on S3'
    );

    expect(mockGetSignedUrlMutation).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if getSignedUrlMutation returns no data', async () => {
    mockGetSignedUrlMutation.mockResolvedValueOnce({});
    await expect(uploadImage(mockFile, mockGetSignedUrlMutation, mockFetch)).rejects.toThrow(
      'Не удалось получить подписанный URL от сервера.'
    );
  });
});