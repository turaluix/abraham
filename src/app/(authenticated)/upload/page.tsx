"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { processingApi } from '@/api';
import { AccessLevel } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  Globe, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // File upload state
  const [fileData, setFileData] = useState({
    file: null as File | null,
    access_level: 'public' as AccessLevel,
  });

  // Text processing state
  const [textData, setTextData] = useState({
    title: '',
    text: '',
    access_level: 'public' as AccessLevel,
  });

  // Web page processing state
  const [webData, setWebData] = useState({
    url: '',
    access_level: 'public' as AccessLevel,
  });

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileData.file) return;

    setIsLoading(true);
    resetMessages();

    try {
      const response = await processingApi.uploadDocument({
        file: fileData.file,
        access_level: fileData.access_level,
      });

      const data = (response as any).data || response;
      setSuccess(`File uploaded successfully! Document ID: ${data.document_id}`);
      
      // Reset form
      setFileData({ file: null, access_level: 'public' });
      
      // Redirect to documents page after a delay
      setTimeout(() => {
        router.push('/search');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextProcessing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textData.title.trim() || !textData.text.trim()) return;

    setIsLoading(true);
    resetMessages();

    try {
      const response = await processingApi.processText({
        title: textData.title,
        text: textData.text,
        access_level: textData.access_level,
      });

      const data = (response as any).data || response;
      setSuccess(`Text processed successfully! Document ID: ${data.document_id}`);
      
      // Reset form
      setTextData({ title: '', text: '', access_level: 'public' });
      
      // Redirect to documents page after a delay
      setTimeout(() => {
        router.push('/search');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process text');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebPageProcessing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webData.url.trim()) return;

    setIsLoading(true);
    resetMessages();

    try {
      const response = await processingApi.processWebPage({
        url: webData.url,
        access_level: webData.access_level,
      });

      const data = (response as any).data || response;
      setSuccess(`Web page processed successfully! Document ID: ${data.document_id}`);
      
      // Reset form
      setWebData({ url: '', access_level: 'public' });
      
      // Redirect to documents page after a delay
      setTimeout(() => {
        router.push('/search');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process web page');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upload Content</h1>
        <p className="text-muted-foreground mt-1">
          Upload files, process text, or scrape web pages for AI analysis
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Upload Tabs */}
      <Tabs defaultValue="file" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="file">
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="text">
            <FileText className="h-4 w-4 mr-2" />
            Process Text
          </TabsTrigger>
          <TabsTrigger value="webpage">
            <Globe className="h-4 w-4 mr-2" />
            Scrape Webpage
          </TabsTrigger>
        </TabsList>

        {/* File Upload Tab */}
        <TabsContent value="file">
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>
                Upload documents (PDF, Word, etc.) for AI processing and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Select File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.md"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setFileData({ ...fileData, file: file || null });
                    }}
                    required
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">
                    Supported formats: PDF, Word, Text, Markdown
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-access">Access Level</Label>
                  <Select
                    value={fileData.access_level}
                    onValueChange={(value: AccessLevel) => 
                      setFileData({ ...fileData, access_level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={!fileData.file || isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Text Processing Tab */}
        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>Process Text</CardTitle>
              <CardDescription>
                Enter text content directly for AI processing and embedding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTextProcessing} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter a title for your content"
                    value={textData.title}
                    onChange={(e) => setTextData({ ...textData, title: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text">Content</Label>
                  <Textarea
                    id="text"
                    placeholder="Enter your text content here..."
                    className="min-h-[200px]"
                    value={textData.text}
                    onChange={(e) => setTextData({ ...textData, text: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">
                    Supports markdown formatting
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text-access">Access Level</Label>
                  <Select
                    value={textData.access_level}
                    onValueChange={(value: AccessLevel) => 
                      setTextData({ ...textData, access_level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  disabled={!textData.title.trim() || !textData.text.trim() || isLoading} 
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Process Text
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Web Page Processing Tab */}
        <TabsContent value="webpage">
          <Card>
            <CardHeader>
              <CardTitle>Scrape Webpage</CardTitle>
              <CardDescription>
                Extract and process content from web pages automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWebPageProcessing} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={webData.url}
                    onChange={(e) => setWebData({ ...webData, url: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">
                    We'll automatically extract and process the webpage content
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="web-access">Access Level</Label>
                  <Select
                    value={webData.access_level}
                    onValueChange={(value: AccessLevel) => 
                      setWebData({ ...webData, access_level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  disabled={!webData.url.trim() || isLoading} 
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4 mr-2" />
                      Process Webpage
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
