import { api } from './api';

export interface ImageUploadResponse {
    imageId: string;
}

export interface SetPrimaryImageResponse {
    isSuccess: boolean;
    isFailure: boolean;
}

export const imageService = {
    /**
     * Upload a single image file
     * @param file - Image file to upload
     * @returns Image ID
     */
    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post<ImageUploadResponse>('/images/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return response.data.imageId;
    },

    /**
     * Set an image as primary for a product
     * @param productId - Product ID
     * @param imageId - Image ID to set as primary
     * @returns Success response
     */
    setPrimaryImage: async (productId: string, imageId: string): Promise<SetPrimaryImageResponse> => {
        const response = await api.post<SetPrimaryImageResponse>(
            `/products/${productId}/images/${imageId}/primary`
        );
        return response.data;
    },
};

