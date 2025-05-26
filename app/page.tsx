"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { samples } from "@/lib/samples";
import { useAppStore } from "@/lib/store";
import axios from "axios";
import { Loader2, Play, RotateCcw, X } from "lucide-react";
import { useEffect } from "react";

// Lesion type mappings
const LESION_TYPES = {
  MEL: "Melanoma",
  NV: "Melanocytic nevus",
  BCC: "Basal cell carcinoma",
  AKIEC: "Actinic keratosis",
  BKL: "Benign keratosis",
  DF: "Dermatofibroma",
  VASC: "Vascular lesion",
} as const;

// Full class names mapping for API response
const FULL_CLASS_NAMES = {
  Melanoma: "MEL",
  "Melanocytic nevi": "NV",
  "Basal cell carcinoma": "BCC",
  "Actinic keratoses": "AKIEC",
  "Benign keratosis-like lesions": "BKL",
  Dermatofibroma: "DF",
  "Vascular lesions": "VASC",
} as const;

function shuffleArray<T>(array: readonly T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function LesionClassifierDemo() {
  const {
    displayImages,
    selectedImage,
    prediction,
    isLoading,
    showAnalysis,
    showActivationMap,
    isInitialized,
    setDisplayImages,
    setSelectedImage,
    setPrediction,
    setIsLoading,
    setShowAnalysis,
    setShowActivationMap,
    setInitialized,
  } = useAppStore();

  // Initialize images only once
  useEffect(() => {
    if (!isInitialized) {
      const shuffled = shuffleArray(samples);
      setDisplayImages(shuffled.slice(0, 12));
      setInitialized(true);
    }
  }, [isInitialized, setDisplayImages, setInitialized]);

  const handleImageSelect = (image: (typeof samples)[0]) => {
    setSelectedImage(image);
    setPrediction(null);
    setShowAnalysis(true);
    setShowActivationMap(false);
  };

  const handleRunModel = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    try {
      // Fetch the image file using axios
      const imageResponse = await axios.get(
        `/samples/${selectedImage.imageName}`,
        {
          responseType: "blob",
        }
      );
      const imageBlob = imageResponse.data;

      // Create FormData and append the image
      const formData = new FormData();
      formData.append("file", imageBlob, selectedImage.imageName);

      const response = await axios.post(
        "https://notnavindu-skin-lesion-detection.hf.space/predict/model1",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPrediction(response.data);
    } catch (error) {
      console.error("Error predicting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAnalysis = () => {
    setShowAnalysis(false);
    setSelectedImage(null);
    setPrediction(null);
    setShowActivationMap(false);
  };

  const handleShuffle = () => {
    const shuffled = shuffleArray(samples);
    setDisplayImages(shuffled.slice(0, 12));
  };

  const getPredictedCode = (className: string) => {
    return (
      FULL_CLASS_NAMES[className as keyof typeof FULL_CLASS_NAMES] || className
    );
  };

  // Check if prediction is correct by comparing the predicted class name to the true label
  const isCorrectPrediction = () => {
    if (!prediction || !selectedImage) return false;
    const predictedCode = getPredictedCode(prediction.predicted_class_name);
    return predictedCode === selectedImage.trueLabel;
  };

  // Get confidence as a safe number
  const getConfidence = () => {
    if (
      !prediction ||
      typeof prediction.confidence !== "number" ||
      isNaN(prediction.confidence)
    ) {
      return 0;
    }
    return prediction.confidence;
  };

  // Sort class probabilities by confidence
  const sortedProbabilities = prediction?.all_class_probabilities
    ? Object.entries(prediction.all_class_probabilities)
        .filter(
          ([, probability]) =>
            typeof probability === "number" && !isNaN(probability) // Include all valid numeric probabilities
        )
        .sort(([, a], [, b]) => {
          const numA = typeof a === "number" && !isNaN(a) ? a : 0;
          const numB = typeof b === "number" && !isNaN(b) ? b : 0;
          return numB - numA;
        })
    : [];

  console.log(
    "🚀 ~ LesionClassifierDemo ~ sortedProbabilities:",
    sortedProbabilities
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Skin Lesion Classifier
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            AI-powered dermatological image analysis for lesion type
            classification. Select a sample image to see the model prediction.
          </p>
        </div>

        {/* Gallery View */}
        {!showAnalysis && (
          <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">
                Sample Images
              </h2>
              <Button
                onClick={handleShuffle}
                variant="outline"
                className="border-zinc-600 hover:border-zinc-500 text-zinc-300 hover:text-white bg-transparent hover:bg-zinc-800"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Shuffle
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {displayImages.length > 0 ? (
                displayImages.map((image) => (
                  <div
                    key={image.imageName}
                    className="cursor-pointer transition-all duration-200 hover:opacity-80 hover:scale-105"
                    onClick={() => handleImageSelect(image)}
                  >
                    <img
                      src={`/samples/${image.imageName}`}
                      alt={`Sample ${image.imageName}`}
                      className="w-full aspect-square object-cover rounded"
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-zinc-400">
                  Loading images...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analysis View */}
        {showAnalysis && selectedImage && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
            {/* Close Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Analysis</h2>
              <Button
                onClick={handleCloseAnalysis}
                variant="outline"
                size="sm"
                className="border-zinc-600 hover:border-zinc-500 text-zinc-300 hover:text-white bg-transparent hover:bg-zinc-800"
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Side - Selected Image */}
                <div className="space-y-4">
                  <Card className="bg-zinc-900 border-zinc-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-white">
                          Selected Image
                        </h3>
                        {prediction && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-zinc-400">
                              Activation Map
                            </span>
                            <Switch
                              checked={showActivationMap}
                              onCheckedChange={setShowActivationMap}
                              className="data-[state=checked]:bg-zinc-600"
                            />
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <img
                          src={`/samples/${selectedImage.imageName}`}
                          alt="Selected sample"
                          className="w-full aspect-square object-cover rounded"
                        />
                        {showActivationMap && prediction && (
                          <img
                            src={`data:image/jpeg;base64,${prediction.activation_map_base64}`}
                            alt="Activation map"
                            className="absolute inset-0 w-full h-full object-cover rounded opacity-90 mix-blend-color"
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Side - Analysis Panel */}
                <div className="space-y-6">
                  {/* Ground Truth */}
                  <Card className="bg-zinc-900 border-zinc-700">
                    <CardContent className="">
                      <div>
                        <h3 className="text-lg font-medium mb-4 text-white">
                          Ground Truth
                        </h3>
                        <div className="p-4 bg-zinc-800 rounded">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm text-zinc-300">
                              {selectedImage.trueLabel}
                            </span>
                            <span className="text-sm text-zinc-400">
                              {
                                LESION_TYPES[
                                  selectedImage.trueLabel as keyof typeof LESION_TYPES
                                ]
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4  mb-4">
                        <Button
                          onClick={handleRunModel}
                          disabled={isLoading}
                          className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Run Model
                            </>
                          )}
                        </Button>

                        <h3 className="text-lg font-medium mb-4 text-white pt-4">
                          Model Prediction
                        </h3>
                        <div className="space-y-4">
                          <div className="p-4 bg-zinc-800 rounded min-h-[80px] flex items-center">
                            {prediction ? (
                              <div className="w-full space-y-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="font-mono text-sm text-zinc-300">
                                      {getPredictedCode(
                                        prediction.predicted_class_name
                                      )}
                                    </span>
                                    <span className="text-sm text-zinc-400">
                                      {prediction.predicted_class_name}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-zinc-400">
                                      Confidence
                                    </span>
                                    <span className="text-sm font-medium text-white">
                                      {(getConfidence() * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <Badge
                                    className={`${
                                      isCorrectPrediction()
                                        ? "bg-zinc-600 text-white"
                                        : "bg-zinc-700 text-zinc-300"
                                    } hover:bg-zinc-600`}
                                  >
                                    {isCorrectPrediction()
                                      ? "Correct"
                                      : "Incorrect"}
                                  </Badge>
                                </div>
                              </div>
                            ) : (
                              <span className="text-zinc-500 text-sm">
                                Click "Run Model" to get prediction
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {/* Class Probabilities */}
                  {prediction && (
                    <Card className="bg-zinc-900 border-zinc-700">
                      <CardContent className="">
                        <h3 className="text-lg font-medium mb-4 text-white">
                          Class Probabilities
                        </h3>
                        <div className="space-y-3">
                          {sortedProbabilities.map(
                            ([className, probability], index) => {
                              const opacity = 1 - index * 0.1; // 100% to 40%
                              return (
                                <div
                                  key={className}
                                  className="space-y-2"
                                  style={{ opacity }}
                                >
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-mono text-zinc-300">
                                        {getPredictedCode(className)}
                                      </span>
                                      <span className="text-zinc-400">
                                        {className}
                                      </span>
                                    </div>
                                    <span className="text-zinc-300 font-medium">
                                      {((probability || 0) * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={(probability || 0) * 100}
                                    className="h-2 bg-white/40"
                                  />
                                </div>
                              );
                            }
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Lesion Types Reference */}
              <Card className="mt-8 bg-zinc-900 border-zinc-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4 text-white">
                    Lesion Types Reference
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(LESION_TYPES).map(([code, name]) => (
                      <div
                        key={code}
                        className="flex items-center justify-between p-3 bg-zinc-800 rounded"
                      >
                        <span className="font-mono text-sm text-zinc-300">
                          {code}
                        </span>
                        <span className="text-sm text-zinc-400">{name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
