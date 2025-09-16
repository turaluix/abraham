"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Code, 
  Copy, 
  Check,
  FileText,
  Search,
  Upload,
  Brain,
  Trash2,
  Eye
} from 'lucide-react';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getCookie } from '@/lib/cookies';

export default function DocumentationPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  const copyToClipboard = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const apiMethods = [
    {
      id: 'search-documents',
      title: 'Search Documents',
      method: 'POST',
      endpoint: '/processing/search/',
      description: 'Search across documents using AI-powered hybrid search with semantic and keyword matching.',
      parameters: [
        { name: 'query', type: 'string', required: true, description: 'Search query or question' },
        { name: 'limit', type: 'number', required: false, description: 'Maximum number of results (default: 20)' },
        { name: 'similarity_threshold', type: 'number', required: false, description: 'Minimum similarity score 0-1 (default: 0.5)' },
        { name: 'include_metadata', type: 'boolean', required: false, description: 'Include metadata in results (default: true)' },
      ],
      example: `// Basic search
const searchParams = {
  query: "machine learning algorithms"
};

const response = await fetch('/api/processing/search/', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(searchParams)
});

const results = await response.json();
console.log(results.results.results); // Array of search results

// Advanced search with parameters
const advancedSearch = {
  query: "What are the benefits of deep learning?",
  limit: 10,
  similarity_threshold: 0.7,
  include_metadata: true
};

const response2 = await fetch('/api/processing/search/', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(advancedSearch)
});

const results2 = await response2.json();
console.log(results2);`
    }
  ];

  const responseExamples = [
    {
      title: 'Search Response',
      description: 'Complete structure of search results returned by the search API',
      example: `{
  "status": "success",
  "query": "machine learning algorithms",
  "results": {
    "query_info": {
      "original_query": "machine learning algorithms",
      "processed_query": "machine learning algorithms",
      "detected_language": "en",
      "token_count": 3
    },
    "results": [
      {
        "document_id": "72b5e377-09ab-48ec-b5cf-5b3127487988",
        "document_title": "Machine Learning Guide",
        "language": "en",
        "chunks": [
          {
            "chunk_id": "921613d7-e954-4931-be9c-fa4b7b2843a3",
            "document_id": "72b5e377-09ab-48ec-b5cf-5b3127487988",
            "document_title": "Machine Learning Guide",
            "chunk_text": "Machine learning algorithms are computational methods that enable computers to learn patterns from data without being explicitly programmed...",
            "chunk_index": 1,
            "match_type": "semantic",
            "semantic_score": 0.95,
            "raw_score": 0.85,
            "language": "en",
            "metadata": {
              "start_char": 0,
              "end_char": 500,
              "length": 500,
              "company_id": "e4e22da4-3ee7-4192-b0fe-a01ac5d7bc6f",
              "access_level": "public",
              "is_public": true,
              "is_chatbot": true,
              "chatbot_ids": []
            },
            "highlighted_text": "Machine learning <mark>algorithms</mark> are computational methods that enable computers to learn patterns from data without being explicitly programmed..."
          }
        ],
        "best_score": 0.95,
        "chunks_count": 1,
        "company_id": null,
        "team_id": null
      }
    ],
    "total_results": 1,
    "semantic_results": 1,
    "keyword_results": 0,
    "total_documents": 1,
    "total_groups": 1,
    "total_pages": 1,
    "current_page": 1,
    "has_next": false,
    "has_previous": false,
    "aggregations": {
      "document_count": {
        "value": 0
      },
      "language_distribution": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": []
      }
    }
  }
}`
    },
    {
      title: 'Search Result Chunk',
      description: 'Individual search result chunk with highlighted text and metadata',
      example: `{
  "chunk_id": "921613d7-e954-4931-be9c-fa4b7b2843a3",
  "document_id": "72b5e377-09ab-48ec-b5cf-5b3127487988",
  "document_title": "Machine Learning Guide",
  "chunk_text": "Deep learning is a subset of machine learning that uses neural networks with multiple layers to model and understand complex patterns in data.",
  "chunk_index": 2,
  "match_type": "semantic",
  "semantic_score": 0.92,
  "raw_score": 0.78,
  "language": "en",
  "metadata": {
    "start_char": 500,
    "end_char": 1000,
    "length": 500,
    "page_number": 1
  },
  "highlighted_text": "Deep learning is a subset of <mark>machine learning</mark> that uses neural networks with multiple layers to model and understand complex patterns in data."
}`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Search className="h-8 w-8" />
          Search API Documentation
        </h1>
        <p className="text-muted-foreground mt-2">
          Complete guide to Intelligent AI's AI-powered hybrid search API
        </p>
      </div>

      {/* API Key Section */}
      <Card className="mb-8 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-blue-600" />
            Get Your API Key
          </CardTitle>
          <CardDescription>
            Use your access token to authenticate API requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowApiKey(!showApiKey)}
                className="flex items-center gap-2"
              >
                {showApiKey ? (
                  <>
                    <Eye className="h-4 w-4" />
                    Hide API Key
                  </>
                ) : (
                  <>
                    <Code className="h-4 w-4" />
                    Show API Key
                  </>
                )}
              </Button>
              {showApiKey && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(getCookie('access_token') || '', 'api-key')}
                  className="flex items-center gap-2"
                >
                  {copiedCode === 'api-key' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  Copy
                </Button>
              )}
            </div>
            
            {showApiKey && (
              <div className="relative">
                <SyntaxHighlighter
                  language="text"
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    padding: '1rem',
                  }}
                  showLineNumbers={false}
                >
                  {getCookie('access_token') || 'No access token found'}
                </SyntaxHighlighter>
              </div>
            )}
            
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Usage:</strong> Include this token in the Authorization header:
              </p>
              <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm font-mono">
                Authorization: Bearer YOUR_TOKEN
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search API Overview</CardTitle>
          <CardDescription>
            Abraham AI's search API provides powerful AI-driven document search capabilities using hybrid semantic and keyword matching.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Base URL</h4>
              <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm font-mono">https://api.intelligent.codes</code>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Authentication</h4>
              <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm font-mono">Bearer Token</code>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Key Features</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• <strong>Semantic Search:</strong> Understands meaning and context</li>
              <li>• <strong>Keyword Matching:</strong> Precise text-based search</li>
              <li>• <strong>Hybrid Results:</strong> Combines both approaches for optimal results</li>
              <li>• <strong>Highlighted Text:</strong> Shows relevant excerpts with query highlighting</li>
              <li>• <strong>Similarity Scoring:</strong> Ranked results by relevance</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* API Methods */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">API Methods</h2>
        
        {apiMethods.map((method) => (
          <Card key={method.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant={method.method === 'GET' ? 'default' : method.method === 'POST' ? 'secondary' : 'destructive'}>
                      {method.method}
                    </Badge>
                    {method.title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm font-mono">{method.endpoint}</code>
                  </CardDescription>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {method.description}
              </p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="parameters" className="w-full">
                <TabsList>
                  <TabsTrigger value="parameters">Parameters</TabsTrigger>
                  <TabsTrigger value="example">Example</TabsTrigger>
                </TabsList>
                
                <TabsContent value="parameters" className="mt-4">
                  <div className="space-y-2">
                    {method.parameters.map((param, index) => (
                      <div key={index} className="flex items-center gap-4 p-2 bg-muted/50 rounded">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <code className="text-sm font-mono">{param.name}</code>
                          <Badge variant="outline" className="text-xs">
                            {param.type}
                          </Badge>
                          {param.required && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {param.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="example" className="mt-4">
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => copyToClipboard(method.example, method.id)}
                    >
                      {copiedCode === method.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <SyntaxHighlighter
                      language="javascript"
                      style={oneDark}
                      customStyle={{
                        margin: 0,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                      }}
                      showLineNumbers={false}
                    >
                      {method.example}
                    </SyntaxHighlighter>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Response Examples */}
      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold">Response Examples</h2>
        
        {responseExamples.map((example, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{example.title}</CardTitle>
              <CardDescription>{example.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => copyToClipboard(example.example, `response-${index}`)}
                >
                  {copiedCode === `response-${index}` ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <SyntaxHighlighter
                  language="json"
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                  showLineNumbers={false}
                >
                  {example.example}
                </SyntaxHighlighter>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Codes */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>HTTP Status Codes</CardTitle>
          <CardDescription>
            Common HTTP status codes returned by the API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-4 p-2 bg-muted/50 rounded">
              <Badge variant="default">200</Badge>
              <span className="text-sm">OK - Request successful</span>
            </div>
            <div className="flex items-center gap-4 p-2 bg-muted/50 rounded">
              <Badge variant="secondary">201</Badge>
              <span className="text-sm">Created - Resource created successfully</span>
            </div>
            <div className="flex items-center gap-4 p-2 bg-muted/50 rounded">
              <Badge variant="outline">204</Badge>
              <span className="text-sm">No Content - Request successful, no content returned</span>
            </div>
            <div className="flex items-center gap-4 p-2 bg-muted/50 rounded">
              <Badge variant="destructive">400</Badge>
              <span className="text-sm">Bad Request - Invalid request parameters</span>
            </div>
            <div className="flex items-center gap-4 p-2 bg-muted/50 rounded">
              <Badge variant="destructive">401</Badge>
              <span className="text-sm">Unauthorized - Invalid or missing authentication</span>
            </div>
            <div className="flex items-center gap-4 p-2 bg-muted/50 rounded">
              <Badge variant="destructive">404</Badge>
              <span className="text-sm">Not Found - Resource not found</span>
            </div>
            <div className="flex items-center gap-4 p-2 bg-muted/50 rounded">
              <Badge variant="destructive">500</Badge>
              <span className="text-sm">Internal Server Error - Server error</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
