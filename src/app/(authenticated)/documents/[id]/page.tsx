"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { processingApi } from '@/api';
import { Document, SearchResult, ProcessingStatusResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft,
  FileText, 
  Search,
  RefreshCw,
  Trash2,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function DocumentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatusResponse | null>(null);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const response = await processingApi.getDocument(documentId);
      const data = (response as any).data || response;
      setDocument(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  const fetchProcessingStatus = async () => {
    if (!document || document.processing_status === 'completed') return;
    
    try {
      const response = await processingApi.getProcessingStatus(documentId);
      const data = (response as any).data || response;
      setProcessingStatus(data);
    } catch (err) {
      console.warn('Failed to fetch processing status:', err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const response = await processingApi.searchDocument(documentId, {
        query: searchQuery.trim(),
        limit: 10,
        similarity_threshold: 0.3,
        include_metadata: true,
      });
      
      const data = (response as any).data || response;
      if (data.results) {
        setSearchResults(data.results);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await processingApi.deleteDocument(documentId);
      router.push('/search');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    }
  };

  const handleReembed = async () => {
    if (!confirm('Re-embed this document? This will update its AI embeddings.')) return;
    
    try {
      await processingApi.reembedDocument(documentId);
      fetchDocument(); // Refresh document data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to re-embed document');
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchDocument();
    }
  }, [documentId]);

  useEffect(() => {
    if (document) {
      fetchProcessingStatus();
      
      // Poll for status updates if still processing
      if (document.processing_status === 'processing') {
        const interval = setInterval(fetchProcessingStatus, 5000);
        return () => clearInterval(interval);
      }
    }
  }, [document]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading document...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="max-w-3xl mx-auto w-full px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Document not found'}</AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          onClick={() => router.push('/search')}
          className="mt-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Documents
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/search')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{document.title}</h1>
            <p className="text-muted-foreground mt-1">
              {document.content_type} • Created {formatDate(document.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(document.processing_status || 'pending')}
          <Badge variant={getStatusColor(document.processing_status || 'pending') as any}>
            {document.processing_status || 'pending'}
          </Badge>
        </div>
      </div>

      {/* Document Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {document.file_name && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">File Name</p>
                  <p className="text-sm">{document.file_name}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Content Type</p>
                <p className="text-sm capitalize">{document.content_type}</p>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Access Level</span>
                <Badge variant="outline" className="capitalize">
                  {document.access_level}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              {document.file_size && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">File Size</p>
                  <p className="text-sm">{(document.file_size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              )}

              {document.url && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Source URL</p>
                  <a 
                    href={document.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {document.url}
                  </a>
                </div>
              )}

              {document.processed_at && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Processed</p>
                  <p className="text-sm">{formatDate(document.processed_at)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Processing Status Details */}
          {processingStatus && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-medium mb-2">Processing Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm">{processingStatus.progress}%</span>
                </div>
                {processingStatus.message && (
                  <p className="text-sm text-muted-foreground">{processingStatus.message}</p>
                )}
                {processingStatus.error && (
                  <p className="text-sm text-red-500">{processingStatus.error}</p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-6 pt-6 border-t">
            <Button variant="outline" size="sm" onClick={handleReembed}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Re-embed
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Document Search */}
      {document.processing_status === 'completed' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search This Document
            </CardTitle>
            <CardDescription>
              Search for specific content within this document
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search within this document..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={searchLoading}
                  />
                </div>
                <Button type="submit" disabled={!searchQuery.trim() || searchLoading}>
                  {searchLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-6 space-y-4">
                <h4 className="text-sm font-medium">Search Results ({searchResults.length})</h4>
                {searchResults.map((result, index) => (
                  <div key={`${result.chunk_id}-${index}`} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {(result.similarity_score * 100).toFixed(1)}% match
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Chunk {result.chunk_index + 1}
                      </Badge>
                      {result.page_number && (
                        <Badge variant="outline" className="text-xs">
                          Page {result.page_number}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed">{result.content}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Text Content Preview */}
      {document.text_content && (
        <Card>
          <CardHeader>
            <CardTitle>Content Preview</CardTitle>
            <CardDescription>
              First 1000 characters of the document content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {document.text_content.length > 1000 
                  ? document.text_content.substring(0, 1000) + '...' 
                  : document.text_content
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
