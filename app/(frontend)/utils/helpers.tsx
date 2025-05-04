import { toast } from 'sonner';
import { Check, X } from 'lucide-react';
import React from 'react';

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-tertiary';
    case 'intermediate':
      return 'bg-quinary';
    case 'expert':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

export const showSuccessToast = ({ title, description, duration }: ToastOptions) => {
  toast(title, {
    className: 'bg-green-50 border-green-200 text-green-900',
    duration: duration || 3000,
    description,
    position: 'top-center',
    icon: (
      <div className="rounded-full p-1 bg-green-700">
        <Check className="h-3 w-3 text-white" />
      </div>
    ),
  });
};

interface ErrorToastOptions {
  title: string;
  description: string;
}

export const showErrorToast = ({ title, description }: ErrorToastOptions) => {
  toast(title, {
    description,
    position: 'top-center',
    className: 'bg-red-50 border-red-200',
    icon: (
      <div className="rounded-full p-1 bg-red-700">
        <X className="h-3 w-3 text-white" />
      </div>
    ),
  });
};
