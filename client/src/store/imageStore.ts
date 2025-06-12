import { create } from 'zustand';

interface Image {
  id: string,
  url: string,
}

interface ImageState {
  loading: boolean;
  error: string | null;
  isModalOpen: boolean;
  images: Image[];

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setImages: (images: Image[]) => void;
  reset: () => void;
}

export const useImageStore = create<ImageState>((set) => ({
  loading: false,
  error: null,
  isModalOpen: false,
  images: [],

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  setImages: (images) => set({ images }),
  reset: () => set({
    loading: false,
    error: null,
  }),
}));