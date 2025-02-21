import { useState } from 'react';
import NavBar from '@/components/NavBar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, File, Trash2, Eye, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Document {
  id: string;
  name: string;
  description: string;
  date: string;
  fileName: string;
  file?: File;
  type?: string;
}

const PatientRecords = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentName, setDocumentName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload only PDF, PNG, or JPG files.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setDocumentName(file.name);
    }
  };

  const handleSubmitDocument = async () => {
    if (!selectedFile || !documentName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a document name and select a file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newDocument: Document = {
        id: Math.random().toString(36).substr(2, 9),
        name: documentName.trim(),
        description: description.trim(),
        date: new Date().toLocaleDateString(),
        fileName: selectedFile.name,
        file: selectedFile,
        type: selectedFile.type
      };

      setDocuments(prev => [...prev, newDocument]);
      setDocumentName('');
      setDescription('');
      setSelectedFile(null);
      setIsUploadDialogOpen(false);
      
      toast({
        title: "Success!",
        description: `${selectedFile.name} has been uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast({
      title: "Document deleted",
      description: "The document has been removed from your records.",
      variant: "destructive",
    });
  };

  const viewDocument = (document: Document) => {
    if (document.file) {
      const fileURL = URL.createObjectURL(document.file);
      window.open(fileURL, '_blank');
      URL.revokeObjectURL(fileURL);
    } else {
      toast({
        title: "Error",
        description: "Unable to view the document.",
        variant: "destructive",
      });
    }
  };

  const downloadDocument = (document: Document) => {
    if (document.file) {
      const fileURL = URL.createObjectURL(document.file);
      const a = window.document.createElement('a');
      a.href = fileURL;
      a.download = document.fileName;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(fileURL);

      toast({
        title: "Download started",
        description: `${document.fileName} is being downloaded.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Unable to download the document.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Patient Records</h1>
            <Button
              onClick={() => setIsUploadDialogOpen(true)}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload New Document
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Document List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No documents uploaded yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4 text-primary" />
                            {doc.name}
                          </div>
                        </TableCell>
                        <TableCell>{doc.description}</TableCell>
                        <TableCell>{doc.date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setPreviewDocument(doc)}
                              className="hover:bg-primary/20"
                            >
                              <Eye className="h-4 w-4 text-primary" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => downloadDocument(doc)}
                              className="hover:bg-primary/20"
                            >
                              <Download className="h-4 w-4 text-primary" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteDocument(doc.id)}
                              className="hover:bg-destructive/20"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="documentName" className="text-sm font-medium">
                    Document Name *
                  </label>
                  <Input
                    id="documentName"
                    placeholder="Enter document name"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Input
                    id="description"
                    placeholder="Enter document description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    File *
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.png,.jpg,.jpeg"
                      disabled={isUploading}
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Select File
                    </Button>
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsUploadDialogOpen(false);
                      setDocumentName('');
                      setDescription('');
                      setSelectedFile(null);
                    }}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitDocument}
                    disabled={isUploading || !selectedFile || !documentName.trim()}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Upload'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
          <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] overflow-hidden p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {previewDocument?.name}
              </DialogTitle>
            </DialogHeader>
            {previewDocument?.file && (
              <div className="flex-1 h-[calc(90vh-140px)] overflow-auto mt-4">
                {previewDocument.type === 'application/pdf' ? (
                  <iframe
                    src={URL.createObjectURL(previewDocument.file)}
                    className="w-full h-full rounded-md border border-border"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(previewDocument.file)}
                    alt={previewDocument.name}
                    className="w-full h-full object-contain rounded-md"
                  />
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default PatientRecords;
