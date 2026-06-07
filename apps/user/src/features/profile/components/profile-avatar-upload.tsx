import { type ChangeEvent, useRef, useState } from 'react';
import { profileApi } from '../services/profile.api';
import { ProfileAvatarCropModal } from './profile-avatar-crop-modal';
import { ProfileAvatarDeleteModal } from './profile-avatar-delete-modal';
import { ProfileAvatarUI } from './profile-avatar-ui';

interface ProfileAvatarUploadProps {
  currentImageUrl?: string;
  userName: string;
  onUploadSuccess: (url: string, publicId: string) => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function ProfileAvatarUpload({
  currentImageUrl,
  userName,
  onUploadSuccess,
  onDelete,
  isDeleting,
}: ProfileAvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageSrc(reader.result?.toString() || null);
      setIsModalOpen(true);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    });
    reader.readAsDataURL(file);
  };

  const handleUploadCroppedImage = async (croppedImageFile: File) => {
    try {
      setIsUploading(true);

      const { signature, timestamp, publicId } = await profileApi.getCloudinarySignature();

      const formData = new FormData();
      formData.append('file', croppedImageFile);
      
      const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
      if (!apiKey) {
        throw new Error('Cloudinary API key is missing');
      }
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', 'profile_pictures');
      formData.append('public_id', publicId);
      formData.append('overwrite', 'true');
      formData.append('invalidate', 'true');

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) {
        throw new Error('Cloudinary cloud name is missing');
      }
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Upload failed');
      }

      onUploadSuccess(data.secure_url, data.public_id);
      setIsModalOpen(false);
      setImageSrc(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <ProfileAvatarUI
        currentImageUrl={currentImageUrl}
        userName={userName}
        isUploading={isUploading}
        isDeleting={isDeleting}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
        onUploadClick={() => fileInputRef.current?.click()}
        onDeleteClick={() => setIsDeleteModalOpen(true)}
      />

      <ProfileAvatarCropModal
        isOpen={isModalOpen}
        imageSrc={imageSrc}
        isUploading={isUploading}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleUploadCroppedImage}
      />

      <ProfileAvatarDeleteModal
        isOpen={isDeleteModalOpen}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          onDelete();
        }}
      />
    </div>
  );
}
