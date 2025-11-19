import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, File, Trash2, Eye, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FileRecord {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  uploaded_at: string;
}

interface FileUploadProps {
  onFileUploaded?: () => void;
  userFiles: FileRecord[];
  onRefresh: () => void;
}

const FileUpload = ({ onFileUploaded, userFiles, onRefresh }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileRecord | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Error", description: "Please log in to upload files.", variant: "destructive" });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('user-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from('user_files').insert({
        user_id: user.id,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        storage_path: fileName
      });

      if (dbError) throw dbError;

      toast({ title: "Success", description: "File uploaded successfully!" });
      onFileUploaded?.();
      onRefresh();
      event.target.value = '';
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileRecord: FileRecord) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('user-documents')
        .remove([fileRecord.storage_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('user_files')
        .delete()
        .eq('id', fileRecord.id);

      if (dbError) throw dbError;

      toast({ title: "Success", description: "File deleted successfully!" });
      onRefresh();
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handlePreviewFile = async (file: FileRecord) => {
    try {
      const { data, error } = await supabase.storage
        .from('user-documents')
        .createSignedUrl(file.storage_path, 3600); // 1 hour expiry

      if (error) throw error;

      const url = data.signedUrl;
      const fullUrl = url.startsWith('http')
        ? url
        : `https://dzcjzzhrnfwfgwmcfswz.supabase.co/storage/v1${url}`;
      
      console.log('Preview URL:', fullUrl);

      setPreviewFile(file);
      setPreviewUrl(fullUrl);
      setIsPreviewOpen(true);
    } catch (error: any) {
      toast({ title: "Preview failed", description: error.message, variant: "destructive" });
    }
  };

  const handleDownloadFile = async (file: FileRecord) => {
    try {
      const { data, error } = await supabase.storage
        .from('user-documents')
        .createSignedUrl(file.storage_path, 60);

      if (error) throw error;

      // The signedUrl may already be absolute; ensure correct format
      const url = data.signedUrl;
      const fullUrl = url.startsWith('http')
        ? url
        : `https://dzcjzzhrnfwfgwmcfswz.supabase.co/storage/v1${url}`;

      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = file.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({ title: "Success", description: "Download started!" });
    } catch (error: any) {
      toast({ title: "Download failed", description: error.message, variant: "destructive" });
    }
  };

  const isPreviewable = (fileType: string) => {
    return fileType.startsWith('image/') || fileType === 'application/pdf';
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Upload className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Upload Files</h3>
          </div>
          
          <div className="border-2 border-dashed border-identity-primary/30 rounded-lg p-8 text-center hover:border-identity-primary/50 transition-colors">
            <Input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="file-upload"
              multiple
              accept="*/*"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-foreground font-medium">
                  {uploading ? "Uploading your documents..." : "Upload Personal Documents"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  ID Cards • Certificates • Licenses • Important Documents
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click here or drag and drop files (All formats supported)
                </p>
              </div>
            </label>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <File className="w-5 h-5 text-identity-primary" />
            <h3 className="text-lg font-semibold text-foreground">Your Personal Documents</h3>
            <span className="text-sm text-muted-foreground">({userFiles.length} files)</span>
          </div>
          
          {userFiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-card rounded-full flex items-center justify-center mx-auto mb-4">
                <File className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium mb-2">No documents stored yet</p>
              <p className="text-sm text-muted-foreground">
                Start building your digital identity by uploading your personal documents
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {userFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3 flex-1">
                    <File className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{file.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.file_size)} • {new Date(file.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isPreviewable(file.file_type) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreviewFile(file)}
                        className="text-identity-primary hover:text-identity-primary"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadFile(file)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFile(file)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{previewFile?.file_name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {previewFile?.file_type.startsWith('image/') && (
              <img 
                src={previewUrl} 
                alt={previewFile.file_name}
                className="w-full h-auto rounded-lg"
              />
            )}
            {previewFile?.file_type === 'application/pdf' && (
              <iframe
                src={previewUrl}
                className="w-full h-[70vh] rounded-lg"
                title={previewFile.file_name}
              />
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => previewFile && handleDownloadFile(previewFile)}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileUpload;