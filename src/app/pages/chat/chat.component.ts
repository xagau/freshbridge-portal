// chat.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SidebarModule } from 'primeng/sidebar';
import { ChatService } from '@/service/chat.service';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { FormatTextPipe } from '@/model/format-text.pipe';
@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        CardModule,
        ScrollPanelModule,
        SidebarModule,
        AvatarModule,
        DividerModule,
        FormatTextPipe
    ],
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
    private chatService = inject(ChatService);
    input = '';
    sidebarVisible = true;
    loading = false;

    get conversations() {
        return this.chatService.conversations;
    }

    get activeConversation() {
        return this.chatService.activeConversation;
    }

    get messages() {
        return this.activeConversation?.messages || [];
    }

    constructor() {
        // Load conversations for the current user (you might want to get userId from auth service)
        const userId = 1; // Replace with actual user ID
        this.chatService.loadConversations(userId).subscribe(conversations => {
            this.chatService.updateConversations(conversations);
        });
    }

    loadConversation(conversationId: number) {
        this.loading = true;
        this.chatService.loadChatHistory(conversationId).subscribe(history => {
            this.chatService.setActiveConversation(history);
            this.loading = false;
        });
    }

    startNewChat() {
        this.chatService.setActiveConversation(null);
        this.sidebarVisible = true;
    }

    // Update the sendMessage method in ChatComponent
    sendMessage() {
        const trimmed = this.input.trim();
        if (!trimmed) return;

        // Add user message to UI immediately
        const tempConversation = this.activeConversation || {
            conversationId: 0,
            title: 'New Chat',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: []
        };

        tempConversation.messages = [
            ...tempConversation.messages,
            {
                id: Date.now(), // temporary ID
                role: 'user',
                content: trimmed,
                timestamp: new Date().toISOString(),
                contextData: {}
            }
        ];

        this.chatService.setActiveConversation(tempConversation);

        const payload = {
            query: trimmed,
            userId: '1', // Replace with actual user ID
            includePdfContext: true,
            includeProductContext: true,
            conversationId: this.activeConversation?.conversationId || null
        };

        this.loading = true;
        this.input = '';

        this.chatService.sendMessage(payload).subscribe({
            next: (response) => {
                // Update the conversation with the bot's response
                const updatedConversation = {
                    ...tempConversation,
                    conversationId: response.conversation_id,
                    title: tempConversation.title === 'New Chat' ?
                        trimmed.slice(0, 30) + (trimmed.length > 30 ? '...' : '') :
                        tempConversation.title,
                    updatedAt: new Date().toISOString(),
                    messages: [
                        ...tempConversation.messages,
                        {
                            id: Date.now(),
                            role: 'assistant',
                            content: response.llm_response,
                            timestamp: new Date().toISOString(),
                            contextData: {
                                contextUsed: response.context_used
                            }
                        }
                    ]
                };

                this.chatService.setActiveConversation(updatedConversation);

                // If this was a new conversation, add it to the list
                if (!payload.conversationId) {
                    this.chatService.loadConversations(parseInt(payload.userId, 10)).subscribe(conversations => {
                        this.chatService.updateConversations(conversations);
                    });
                }

                this.loading = false;
            },
            error: (error) => {
                console.error('Error sending message:', error);
                this.loading = false;
            }
        });
    }
}