import { AccessLevel, ProcessingStatus, ApiResponse, PaginatedResponse } from './common';

// Document upload types
export interface DocumentUploadRequest {
  file: File;
  access_level: AccessLevel;
  chatbot_ids?: string[];
  is_chatbot?: boolean;
  team_id?: string;
}

// Text processing types
export interface TextProcessingRequest {
  text: string;
  title: string;
  access_level: AccessLevel;
  chatbot_ids?: string[];
  is_chatbot?: boolean;
  team_id?: string;
}

// Web page processing types
export interface WebPageProcessingRequest {
  url: string;
  access_level: AccessLevel;
  is_chatbot?: boolean;
  chatbot_ids?: string[];
}

// Document types
export interface Document {
  id: string;
  title: string;
  file?: string;
  file_name?: string;
  file_size?: number;
  file_size_mb?: number;
  file_type?: {
    category: string;
    extension: string;
  };
  content_type?: 'file' | 'text' | 'webpage';
  url?: string;
  text_content?: string;
  processed_content?: string;
  access_level: AccessLevel;
  status: ProcessingStatus;
  processing_status?: ProcessingStatus; // Keep for backward compatibility
  training_status: ProcessingStatus;
  embedding_status: ProcessingStatus;
  chunking_status: ProcessingStatus;
  error_details?: {
    message: string;
  };
  error_message?: string;
  chatbot_ids?: string[];
  team_id?: string;
  team?: string;
  user: string;
  company: string;
  created_at: string;
  updated_at?: string;
  processed_at?: string;
  metadata?: Record<string, any>;
  // Additional fields from API response
  extraction_method?: string;
  ocr_languages?: string;
  processed_with_ocr?: boolean;
  image_quality_score?: number | null;
  processing_notes?: string;
  page_count?: number;
  pages_count?: number;
  has_tables?: boolean;
  ocr_confidence?: number | null;
  source_url?: string;
  page_title?: string;
  processed_with_browser?: boolean;
  word_count?: number;
  char_count?: number;
  chunks_count?: number;
  chunks_file?: string | null;
  embedding_model?: string;
  embeddings_file?: string | null;
  embedding_tokens_count?: number;
  input_tokens_count?: number;
  output_tokens_count?: number;
  completion_tokens_count?: number;
}

// Processing status types
export interface ProcessingStatusResponse {
  document_id: string;
  status: ProcessingStatus;
  progress: number;
  message?: string;
  error?: string;
  started_at?: string;
  completed_at?: string;
}

// Training types
export interface TrainingInfo {
  document_id: string;
  training_status: ProcessingStatus;
  embedding_count: number;
  chunk_count: number;
  training_progress: number;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
}

// Search types
export interface SearchRequest {
  query: string;
  limit?: number;
  similarity_threshold?: number;
  include_metadata?: boolean;
}

export interface SearchResult {
  chunk_id: string;
  document_id: string;
  document_title: string;
  content: string;
  similarity_score: number;
  metadata?: Record<string, any>;
  page_number?: number;
  chunk_index: number;
  highlighted_text?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total_count: number;
  query: string;
  processing_time: number;
}

// Document search (specific document)
export interface DocumentSearchRequest extends SearchRequest {
  document_id: string;
}

// Re-embed types
export interface ReembedRequest {
  document_id: string;
}

// Get documents query parameters
export interface GetDocumentsParams {
  page?: number;
  page_size?: number;
  access_level?: AccessLevel;
  processing_status?: ProcessingStatus;
  content_type?: Document['content_type'];
  search?: string;
  ordering?: string;
}

// API response types for processing endpoints
export type DocumentUploadResponse = ApiResponse<{ document_id: string; message: string }>;
export type TextProcessingResponse = ApiResponse<{ document_id: string; message: string }>;
export type WebPageProcessingResponse = ApiResponse<{ document_id: string; message: string }>;
export type GetDocumentResponse = ApiResponse<Document>;
export type GetDocumentsResponse = ApiResponse<PaginatedResponse<Document>>;
export type DeleteDocumentResponse = ApiResponse<{ message: string }>;
export type ProcessingStatusStreamResponse = ApiResponse<ProcessingStatusResponse>;
export type GetTrainingInfoResponse = ApiResponse<TrainingInfo>;
export type StartTrainingResponse = ApiResponse<{ message: string }>;
export type ReembedResponse = ApiResponse<{ message: string }>;
export type HybridSearchResponse = ApiResponse<SearchResponse>;
export type DocumentSearchResponse = ApiResponse<SearchResponse>;
