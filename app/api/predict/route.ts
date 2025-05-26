import { type NextRequest, NextResponse } from "next/server"

// Sample images with true labels mapping
const SAMPLE_IMAGE_LABELS: Record<number, string> = {
  1: "MEL",
  2: "NV",
  3: "BCC",
  4: "AKIEC",
  5: "BKL",
  6: "DF",
  7: "VASC",
  8: "MEL",
  9: "NV",
  10: "BCC",
  11: "AKIEC",
  12: "BKL",
  13: "DF",
  14: "VASC",
  15: "MEL",
  16: "NV",
  17: "BCC",
  18: "AKIEC",
  19: "BKL",
  20: "DF",
}

// Mapping from codes to full class names
const CODE_TO_CLASS_NAME: Record<string, string> = {
  MEL: "Melanoma",
  NV: "Melanocytic nevi",
  BCC: "Basal cell carcinoma",
  AKIEC: "Actinic keratoses",
  BKL: "Benign keratosis-like lesions",
  DF: "Dermatofibroma",
  VASC: "Vascular lesions",
}

// Mock prediction function that returns the new format with activation map
function mockPredict(imageId: number) {
  const allClassNames = [
    "Melanoma",
    "Melanocytic nevi",
    "Basal cell carcinoma",
    "Actinic keratoses",
    "Benign keratosis-like lesions",
    "Dermatofibroma",
    "Vascular lesions",
  ]

  // Get the true label for this image
  const trueLabel = SAMPLE_IMAGE_LABELS[imageId] || "MEL"
  const trueClassName = CODE_TO_CLASS_NAME[trueLabel]

  // ALWAYS CORRECT - use the true class
  const predictedClass = trueClassName
  const predictedIndex = allClassNames.indexOf(predictedClass)

  // Generate realistic probabilities
  const probabilities: Record<string, number> = {}

  // Initialize all probabilities to small values (1-3%)
  for (const className of allClassNames) {
    probabilities[className] = 0.01 + Math.random() * 0.02
  }

  // Give high probability to the correct class (85-95%)
  probabilities[predictedClass] = 0.85 + Math.random() * 0.1

  // Normalize probabilities to sum to exactly 1
  const total = Object.values(probabilities).reduce((sum, val) => sum + val, 0)
  for (const className in probabilities) {
    probabilities[className] = probabilities[className] / total
  }

  // Ensure confidence is valid
  const confidence = probabilities[predictedClass] || 0.9

  return {
    predicted_class_index: predictedIndex,
    predicted_class_name: predictedClass,
    confidence: confidence,
    all_class_probabilities: probabilities,
    activation_map: "/images/activation-map.png",
  }
}

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, imageId } = await request.json()

    // Simulate API processing time
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))

    // Mock prediction with new format including activation map
    const prediction = mockPredict(imageId)

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ success: false, error: "Failed to process image" }, { status: 500 })
  }
}
