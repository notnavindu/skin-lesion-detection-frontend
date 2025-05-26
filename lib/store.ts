import { create } from "zustand";

interface PredictionResult {
  predicted_class_index: number;
  predicted_class_name: string;
  confidence: number;
  all_class_probabilities: {
    NV: number;
    MEL: number;
    BKL: number;
    BCC: number;
    AKIEC: number;
    VASC: number;
    DF: number;
  };
  raw_logits: Array<number>;
  activation_map_base64: string;
}

interface SampleImage {
  imageName: string;
  trueLabel: string;
}

interface AppState {
  displayImages: SampleImage[];
  selectedImage: SampleImage | null;
  prediction: PredictionResult | null;
  isLoading: boolean;
  showAnalysis: boolean;
  showActivationMap: boolean;
  isInitialized: boolean;
  setDisplayImages: (images: SampleImage[]) => void;
  setSelectedImage: (image: SampleImage | null) => void;
  setPrediction: (prediction: PredictionResult | null) => void;
  setIsLoading: (loading: boolean) => void;
  setShowAnalysis: (show: boolean) => void;
  setShowActivationMap: (show: boolean) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  displayImages: [],
  selectedImage: null,
  prediction: null,
  isLoading: false,
  showAnalysis: false,
  showActivationMap: false,
  isInitialized: false,
  setDisplayImages: (images) => set({ displayImages: images }),
  setSelectedImage: (image) => set({ selectedImage: image }),
  setPrediction: (prediction) => set({ prediction }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setShowAnalysis: (show) => set({ showAnalysis: show }),
  setShowActivationMap: (show) => set({ showActivationMap: show }),
  setInitialized: (initialized) => set({ isInitialized: initialized }),
}));
