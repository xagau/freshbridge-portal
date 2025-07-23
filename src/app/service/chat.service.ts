import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

interface Conversation {
    conversationId: number;
    userId: number;
    title: string;
}

interface ChatMessage {
    id: number;
    role: string;
    content: string;
    timestamp: string;
    contextData: any;
}

interface ChatHistory {
    conversationId: number;
    title: string;
    createdAt: string;
    updatedAt: string;
    messages: ChatMessage[];
}

interface ChatResponse {
    conversation_id: number;
    llm_response: string;
    context_used: boolean;
}


@Injectable({ providedIn: 'root' })
export class ChatService {
    private readonly API = environment.apiUrl + 'assistant';
    private _conversations = signal<Conversation[]>([]);
    private _activeConversation = signal<ChatHistory | null>(null);

    constructor(private http: HttpClient) { }

    get conversations() {
        return this._conversations();
    }

    get activeConversation() {
        return this._activeConversation();
    }

    loadConversations(userId: number): Observable<Conversation[]> {
        return this.http.get<Conversation[]>(`${this.API}/conversations/${userId}`);
    }

    loadChatHistory(conversationId: number): Observable<ChatHistory> {
        return this.http.get<ChatHistory>(`${this.API}/history/${conversationId}`);
    }

    sendMessage(payload: {
        query: string;
        userId: string;
        includePdfContext: boolean;
        includeProductContext: boolean;
        conversationId: number | null;
    }): Observable<ChatResponse> {
        return this.http.post<ChatResponse>(`${this.API}/query`, payload);
    }

    updateConversations(conversations: Conversation[]) {
        this._conversations.set(conversations);
    }

    setActiveConversation(conversation: ChatHistory | null) {
        this._activeConversation.set(conversation);
    }
}