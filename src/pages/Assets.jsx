import React, { useState } from "react";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Upload, 
  Image as ImageIcon,
  Search,
  Trash2,
  Copy,
  Grid3x3,
  List
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Assets() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const fileInputRef = React.useRef(null);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    setIsUploading(true);

    for (const file of files) {
      try {
        const { file_url } = await UploadFile({ file });
        setUploadedFiles(prev => [...prev, {
          id: Date.now() + Math.random(),
          name: file.name,
          url: file_url,
          size: file.size,
          type: file.type,
          uploaded: new Date()
        }]);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setIsUploading(false);
    toast.success(`${files.length} file(s) uploaded successfully`);
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  const deleteFile = (id) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
    toast.success("File removed");
  };

  const filteredFiles = uploadedFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Media Assets</h1>
          <p className="text-slate-600">
            Upload and manage images for your interactive demos
          </p>
        </div>

        {/* Upload Area */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {isUploading ? 'Uploading...' : 'Drop files here or click to upload'}
              </h3>
              <p className="text-slate-500">
                Supports: JPG, PNG, GIF, SVG (Max 10MB)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Search & View Controls */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === "grid" ? "default" : "outline"} 
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "outline"} 
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Files Grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFiles.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <div className="aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
                    {file.type.startsWith('image/') ? (
                      <img 
                        src={file.url} 
                        alt={file.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-slate-400" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-slate-900 truncate mb-3">
                      {file.name}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => copyUrl(file.url)}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteFile(file.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
              {filteredFiles.map((file, index) => (
                <div 
                  key={file.id}
                  className="flex items-center gap-4 p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center overflow-hidden">
                    {file.type.startsWith('image/') ? (
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{file.name}</p>
                    <p className="text-sm text-slate-500">
                      {(file.size / 1024).toFixed(1)} KB • {file.type}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyUrl(file.url)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy URL
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No files uploaded yet
            </h3>
            <p className="text-slate-500 mb-6">
              Upload images to use in your interactive demos
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}