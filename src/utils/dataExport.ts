import { supabase } from "@/integrations/supabase/client";

export interface ExportData {
  userProfile: {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    createdAt: string;
  };
  files: Array<{
    id: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    uploadedAt: string;
  }>;
  securitySettings: {
    twoFactorEnabled: boolean;
    biometricEnabled: boolean;
    publicProfile: boolean;
  };
  exportTimestamp: string;
}

export const exportUserData = async (): Promise<ExportData> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Get user files
  const { data: files } = await supabase
    .from('user_files')
    .select('*')
    .order('uploaded_at', { ascending: false });

  // Get user settings (from localStorage for now)
  const securitySettings = {
    twoFactorEnabled: localStorage.getItem('twoFactorEnabled') === 'true',
    biometricEnabled: localStorage.getItem('biometricEnabled') === 'true',
    publicProfile: localStorage.getItem('publicProfile') === 'true'
  };

  const exportData: ExportData = {
    userProfile: {
      id: user.id,
      email: user.email || '',
      fullName: user.user_metadata?.fullName || '',
      phone: user.user_metadata?.phone || '',
      createdAt: user.created_at || ''
    },
    files: files?.map(file => ({
      id: file.id,
      fileName: file.file_name,
      fileSize: file.file_size,
      fileType: file.file_type,
      uploadedAt: file.uploaded_at
    })) || [],
    securitySettings,
    exportTimestamp: new Date().toISOString()
  };

  return exportData;
};

export const downloadDataAsJSON = (data: ExportData, filename: string = 'asm-digital-identity-export.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadDataAsCSV = (data: ExportData, filename: string = 'asm-digital-identity-export.csv') => {
  const csvRows = [
    ['Type', 'Property', 'Value'],
    ['Profile', 'ID', data.userProfile.id],
    ['Profile', 'Email', data.userProfile.email],
    ['Profile', 'Full Name', data.userProfile.fullName],
    ['Profile', 'Phone', data.userProfile.phone || ''],
    ['Profile', 'Created At', data.userProfile.createdAt],
    ['Security', 'Two Factor Enabled', data.securitySettings.twoFactorEnabled.toString()],
    ['Security', 'Biometric Enabled', data.securitySettings.biometricEnabled.toString()],
    ['Security', 'Public Profile', data.securitySettings.publicProfile.toString()],
    ...data.files.map(file => ['File', file.fileName, `${file.fileType} (${(file.fileSize / 1024 / 1024).toFixed(2)} MB)`])
  ];

  const csvContent = csvRows.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const saveToGallery = async (imageUrl: string, filename: string) => {
  try {
    // For web browsers, we'll trigger a download
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error saving to gallery:', error);
    return false;
  }
};