# Skin Lesion Detection

This repository contains the **frontend** of a Skin Lesion Type Classification deep learning model.

This ia a demo application that allows users to select skin lesion images and receive predictions on the type of lesion, along with confidence scores and class activation map for each class. The goal of this project was to understand how Deep Convolutional Neural Networks (CNNs) can be used for image classification tasks, specifically in the medical domain.

---

## 🖼️ Demo

[![Live Demo](https://img.shields.io/badge/Live_Demo-Click_Here-brightgreen)](https://skin-lesion-detection-frontend.vercel.app/)  
[![Model](https://img.shields.io/badge/Model-Hugging_Face-yellow)](https://huggingface.co/spaces/notnavindu/skin-lesion-detection/tree/main)

---

## ⚙️ Models

THis project supports multiple custom models as well as fine tuned models from torch vision.

You can choose from:

- Custom CNN
- MobileNetV2

## 🧠 Backend Inference

This frontend communicates with a deep learning model hosted as a REST API on HuggingFace.

## 🛠️ Tech Stack

- **Frontend:** NextJS
- **Styling:** Tailwind CSS, shadcn
- **Backend:** Hugging Face Spaces & FastAPI
- **AI Model:** PyTorch, torchvision

## More Information

For more information on the backend, model training and architecture, please refer to the [website](https://skin-lesion-detection-frontend.vercel.app/)
