import { apiClient } from './client';
import {
  DocumentUploadRequest,
  TextProcessingRequest,
  WebPageProcessingRequest,
  SearchRequest,
  DocumentSearchRequest,
  GetDocumentsParams,
  DocumentUploadResponse,
  TextProcessingResponse,
  WebPageProcessingResponse,
  GetDocumentResponse,
  GetDocumentsResponse,
  DeleteDocumentResponse,
  ProcessingStatusStreamResponse,
  GetTrainingInfoResponse,
  StartTrainingResponse,
  ReembedResponse,
  HybridSearchResponse,
  DocumentSearchResponse,
} from '../types';

// Data processing API endpoints
export const processingApi = {
  // Upload and process file
  uploadDocument: (data: DocumentUploadRequest, whelpToken?: string): Promise<DocumentUploadResponse> => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('access_level', data.access_level);
    
    if (data.chatbot_ids) {
      formData.append('chatbot_ids', JSON.stringify(data.chatbot_ids));
    }
    if (data.is_chatbot !== undefined) {
      formData.append('is_chatbot', data.is_chatbot.toString());
    }
    if (data.team_id) {
      formData.append('team_id', data.team_id);
    }

    if (whelpToken) {
      return apiClient.requestWithWhelpToken('/processing/documents/upload/', whelpToken, {
        method: 'POST',
        body: formData,
      });
    }

    return apiClient.postFormData('/processing/documents/upload/', formData);
  },

  // Process text
  processText: (data: TextProcessingRequest, whelpToken?: string): Promise<TextProcessingResponse> => {
    const formData = new FormData();
    formData.append('text', data.text);
    formData.append('title', data.title);
    formData.append('access_level', data.access_level);
    
    if (data.chatbot_ids) {
      formData.append('chatbot_ids', JSON.stringify(data.chatbot_ids));
    }
    if (data.is_chatbot !== undefined) {
      formData.append('is_chatbot', data.is_chatbot.toString());
    }
    if (data.team_id) {
      formData.append('team_id', data.team_id);
    }

    if (whelpToken) {
      return apiClient.requestWithWhelpToken('/processing/text/', whelpToken, {
        method: 'POST',
        body: formData,
      });
    }

    return apiClient.postFormData('/processing/text/', formData);
  },

  // Process web page
  processWebPage: (data: WebPageProcessingRequest, whelpToken?: string): Promise<WebPageProcessingResponse> => {
    const formData = new FormData();
    formData.append('url', data.url);
    formData.append('access_level', data.access_level);
    
    if (data.is_chatbot !== undefined) {
      formData.append('is_chatbot', data.is_chatbot.toString());
    }
    if (data.chatbot_ids) {
      formData.append('chatbot_ids', JSON.stringify(data.chatbot_ids));
    }

    if (whelpToken) {
      return apiClient.requestWithWhelpToken('/processing/webpage-process/', whelpToken, {
        method: 'POST',
        body: formData,
      });
    }

    return apiClient.postFormData('/processing/webpage-process/', formData);
  },

  // Re-embed document
  reembedDocument: (documentId: string): Promise<ReembedResponse> => {
    return apiClient.post(`/processing/documents/${documentId}/reembed/`);
  },

  // Get training info for document
  getTrainingInfo: (documentId: string): Promise<GetTrainingInfoResponse> => {
    return apiClient.get(`/processing/documents/${documentId}/train/`);
  },

  // Get processing status
  getProcessingStatus: (documentId: string, whelpToken?: string): Promise<ProcessingStatusStreamResponse> => {
    if (whelpToken) {
      return apiClient.requestWithWhelpToken(`/processing/documents/${documentId}/processing-status`, whelpToken, {
        method: 'GET',
      });
    }

    return apiClient.get(`/processing/documents/${documentId}/processing-status`);
  },

  // Get processing status stream (SSE)
  getProcessingStatusStream: (documentId: string): Promise<ProcessingStatusStreamResponse> => {
    return apiClient.get(`/processing/documents/${documentId}/status/stream/`);
  },

  // Get single document info
  getDocument: (documentId: string): Promise<GetDocumentResponse> => {
    return apiClient.get(`/processing/documents/${documentId}/`);
  },

  // Delete document
  deleteDocument: (documentId: string, whelpToken?: string): Promise<DeleteDocumentResponse> => {
    if (whelpToken) {
      return apiClient.requestWithWhelpToken(`/processing/documents/${documentId}/`, whelpToken, {
        method: 'DELETE',
      });
    }

    return apiClient.delete(`/processing/documents/${documentId}/`);
  },

  // Get documents list
  getDocuments: (params?: GetDocumentsParams, whelpToken?: string): Promise<GetDocumentsResponse> => {
    if (whelpToken) {
      return apiClient.requestWithWhelpToken('/processing/documents/', whelpToken, {
        method: 'GET',
      });
    }

    return apiClient.get('/processing/documents/', params);
  },

  // Start training
  startTraining: (documentId: string, whelpToken?: string): Promise<StartTrainingResponse> => {
    if (whelpToken) {
      return apiClient.requestWithWhelpToken(`/processing/documents/${documentId}/train/`, whelpToken, {
        method: 'POST',
      });
    }

    return apiClient.post(`/processing/documents/${documentId}/train/`);
  },

  // Hybrid search across all documents
  hybridSearch: (data: SearchRequest): Promise<HybridSearchResponse> => {
    return apiClient.post('/processing/search/', data);
  },

  // Search within specific document
  searchDocument: (documentId: string, data: Omit<DocumentSearchRequest, 'document_id'>): Promise<DocumentSearchResponse> => {
    return apiClient.post(`/processing/documents/${documentId}/search/`, data);
  },
};
