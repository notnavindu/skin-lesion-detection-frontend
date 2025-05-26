import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { models } from "@/lib/models"; // Assuming models.ts is in lib
import React from "react";

interface ModelSelectorProps {
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModelId,
  onModelChange,
}) => {
  return (
    <div className="space-y-2 mb-4 text-white">
      <Label htmlFor="model-selector" className="text-white">
        Select AI Model
      </Label>
      <Select value={selectedModelId} onValueChange={onModelChange}>
        <SelectTrigger id="model-selector" className="w-full py-7">
          <SelectValue className="h-24" placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent className="">
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id} className="">
              <div className="flex flex-col items-start">
                <div>{model.name}</div>
                <div className="text-xs text-zinc-400">
                  UAR: {model.UAR} - Accuracy: {model.accuracy}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelSelector;
