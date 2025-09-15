"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { processingApi } from '@/api';
import { SearchResult, SearchRequest, Document, GetDocumentsParams } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { OnboardingStep2Dialog } from '@/components/onboarding/step2-dialog';
import { 
  Search, 
  FileText, 
  Clock,
  AlertCircle,
  Loader2,
  ExternalLink,
  Upload, 
  Trash2, 
  Eye,
  Globe,
  CheckCircle,
  XCircle,
  Brain
} from 'lucide-react';

export default function SearchPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  
  // Search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInfo, setSearchInfo] = useState<{
    totalCount: number;
    processingTime: number;
    query: string;
  } | null>(null);

  // Documents state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showOnboardingDialog, setShowOnboardingDialog] = useState(false);
  const [showTrainingDialog, setShowTrainingDialog] = useState(false);
  const [trainingMessage, setTrainingMessage] = useState('');
  const [filters, setFilters] = useState<GetDocumentsParams>({
    page: 1,
    page_size: 10,
  });

  // Check if user needs onboarding step 2 (company info)
  const needsCompanyInfo = user && !user.company;

  const fetchDocuments = async () => {
    try {
      setDocumentsLoading(true);
      const params = {
        ...filters,
        page: currentPage,
      };
      
      const response = await processingApi.getDocuments(params);
      const data = (response as any).data || response;
      
      if (data.results) {
        setDocuments(data.results);
        setTotalPages(Math.ceil(data.count / (params.page_size || 10)));
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setDocumentsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [currentPage, filters]);

  // Show onboarding dialog if user needs company info
  useEffect(() => {
    if (needsCompanyInfo && !documentsLoading) {
      setShowOnboardingDialog(true);
    }
  }, [needsCompanyInfo, documentsLoading]);

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await processingApi.deleteDocument(documentId);
      // Reset to first page and refresh list
      setCurrentPage(1);
      await fetchDocuments();
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };


  const handleOnboardingSuccess = async () => {
    // Refresh user data to get updated company info
    await refreshUser();
    setShowOnboardingDialog(false);
  };

  const handleTrain = async (documentId: string) => {
    if (!confirm('Start training for this document? This will create AI embeddings for better search.')) return;
    
    try {
      const response = await processingApi.startTraining(documentId);
      const data = (response as any).data || response;
      
      setTrainingMessage(data.message || 'Embedding generation started');
      setShowTrainingDialog(true);
      fetchDocuments(); // Refresh list to show updated status
    } catch (error) {
      console.error('Failed to start training:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setSearchInfo(null);

    try {
      const searchParams: SearchRequest = {
        query: query.trim(),
        limit: 20,
        similarity_threshold: 0.5,
        include_metadata: true,
      };

      const response = await processingApi.hybridSearch(searchParams);
      const data = (response as any).data || response;

      // Handle the nested results structure: data.results.results
      const searchResults = data.results?.results;
      if (searchResults && Array.isArray(searchResults)) {
        // Transform the nested structure to match our expected format
        const transformedResults = searchResults.flatMap(doc => 
          doc.chunks?.map((chunk: any) => ({
            document_id: doc.document_id,
            document_title: doc.document_title,
            chunk_id: chunk.chunk_id,
            chunk_index: chunk.chunk_index,
            content: chunk.chunk_text,
            similarity_score: chunk.semantic_score || chunk.raw_score,
            page_number: chunk.metadata?.page_number,
            metadata: chunk.metadata,
            highlighted_text: chunk.highlighted_text
          })) || []
        );
        
        setResults(transformedResults);
        setSearchInfo({
          totalCount: data.results?.total_results || 0,
          processingTime: data.processing_time || 0,
          query: data.query || query.trim(),
        });
      } else {
        // Handle case where results is not an array
        setResults([]);
        setSearchInfo({
          totalCount: 0,
          processingTime: 0,
          query: query.trim(),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const highlightText = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const formatProcessingTime = (time: number | undefined) => {
    if (time === undefined || time === null) return 'N/A';
    return time < 1 ? `${Math.round(time * 1000)}ms` : `${time.toFixed(2)}s`;
  };

  if (documentsLoading && documents.length === 0) {
    return (
      <div className="max-w-7xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Documents & Search</h1>
        <p className="text-muted-foreground mt-1">
          Manage your documents and search across all content using AI-powered hybrid search
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Documents */}
        <div className="space-y-6 p-4 border border-neutral-200 rounded-lg dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Documents</h2>
            <Button variant="outline" onClick={() => router.push('/upload')} size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>

          {/* Document Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={filters.processing_status}
              onValueChange={(value) => setFilters({ ...filters, processing_status: value as any })}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Documents List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {documents.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-sm font-semibold mb-1">No documents</h3>
                  <p className="text-xs text-muted-foreground text-center">
                    Upload your first document to get started
                  </p>
                </CardContent>
              </Card>
            ) : (
              documents.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <FileText className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{doc.title}</span>
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {doc.file_name && `${doc.file_name} • `}
                          Created {formatDate(doc.created_at)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {getStatusIcon(doc.embedding_status === 'pending' ? 'pending' : (doc.embedding_status || 'pending'))}
                        <Badge className="text-xs">
                          {!doc.embedding_status || doc.embedding_status === 'pending' ? 'Not trained' : doc.embedding_status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Globe className="h-3 w-3" />
                        {doc.access_level}
                        {doc.file_size_mb && (
                          <span>• {doc.file_size_mb.toFixed(1)} MB</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                      {doc.status === 'completed' && doc.embedding_status !== 'completed' && (
                          <Button
                            size="sm"
                            onClick={() => handleTrain(doc.id)}
                            className="h-7 px-2"
                            title="Train AI embeddings"
                          >
                            <Brain className="h-3 w-3 mr-1" />
                            Train
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/documents/${doc.id}`)}
                          className="h-7 px-2"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(doc.id)}
                          className="h-7 px-2"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Documents Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="h-7 px-2"
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="h-7 px-2"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Search */}
        <div className="space-y-6 p-4 border border-neutral-200 rounded-lg dark:border-neutral-800">
          <h2 className="text-xl font-semibold">Search</h2>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Ask a question or search for content..."
                    className="pl-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button type="submit" disabled={!query.trim() || isLoading} size="sm">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {/* Search Results Info */}
          {searchInfo && (
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Found {searchInfo.totalCount} results for "{searchInfo.query}"
                </span>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatProcessingTime(searchInfo.processingTime)}
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {Array.isArray(results) && results.length === 0 && !isLoading && searchInfo && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Search className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-sm font-semibold mb-1">No results found</h3>
                  <p className="text-xs text-muted-foreground text-center">
                    Try rephrasing your search or using different keywords
                  </p>
                </CardContent>
              </Card>
            )}

            {Array.isArray(results) && results.map((result, index) => (
              <Card key={`${result.document_id}-${result.chunk_id}-${index}`} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{result.document_title}</span>
                      </CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {(result.similarity_score * 100).toFixed(1)}%
                        </Badge>
                        {result.page_number && (
                          <Badge variant="outline" className="text-xs">
                            Page {result.page_number}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          Chunk {result.chunk_index + 1}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-xs leading-relaxed line-clamp-3">
                      {result.highlighted_text ? 
                        <span dangerouslySetInnerHTML={{ __html: result.highlighted_text }} /> :
                        highlightText(result.content, query)
                      }
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-muted-foreground truncate">
                      ID: {result.document_id.slice(0, 8)}...
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`/documents/${result.document_id}`, '_blank')}
                      className="h-6 px-2 text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State for No Search */}
          {!searchInfo && !isLoading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Search className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="text-sm font-semibold mb-1">Start Searching</h3>
                <p className="text-xs text-muted-foreground text-center mb-3">
                  Enter a query to search through your documents
                </p>
                <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                  <div>• Ask questions about your content</div>
                  <div>• Search for specific topics</div>
                  <div>• Find relevant information quickly</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Onboarding Step 2 Dialog */}
      <OnboardingStep2Dialog
        isOpen={showOnboardingDialog}
        onClose={() => setShowOnboardingDialog(false)}
        onSuccess={handleOnboardingSuccess}
      />

      {/* Training Success Dialog */}
      <Dialog open={showTrainingDialog} onOpenChange={setShowTrainingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-green-500" />
              Training Started
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              {trainingMessage}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              The document is now being processed to create AI embeddings for better search results.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowTrainingDialog(false)}>
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
