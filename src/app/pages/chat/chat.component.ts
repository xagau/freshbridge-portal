// chat.component.ts
import { Component, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ChatService } from '@/service/chat.service';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { FormatTextPipe } from '@/model/format-text.pipe';
import { AuthService } from '@/auth/auth.service';
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
        AvatarModule,
        DividerModule,
        FormatTextPipe
    ],
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements AfterViewChecked {
    @ViewChild('scrollPanel') scrollPanel: any;

    ngAfterViewChecked(): void {
        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        try {
            if (this.scrollPanel) {
                // PrimeNG ScrollPanel has a different API
                const scrollableElement = this.scrollPanel.el.nativeElement.querySelector('.p-scrollpanel-content');
                if (scrollableElement) {
                    scrollableElement.scrollTop = scrollableElement.scrollHeight;
                }
            }
        } catch (err) {
            console.error('Error scrolling to bottom:', err);
        }
    }
    private chatService = inject(ChatService);
    private authService = inject(AuthService);
    input = '';
    loading = false;
    allMessages: any[] = [];
    allConversations: any[] = [];

    get conversations() {
        return this.chatService.conversations;
    }

    get activeConversation() {
        return this.chatService.activeConversation;
    }

    get messages() {
        return this.allMessages;
    }

    constructor() {
        // Load conversations for the current user
        let userId = 1;
        this.authService.currentUser$.subscribe(user => {
            userId = user?.id || 1;
        })

        this.chatService.loadConversations(userId).subscribe(conversations => {
            this.chatService.updateConversations(conversations);
            this.allConversations = conversations;

            // Load all conversation histories
            if (conversations.length > 0) {
                this.loading = true;
                this.loadAllConversationHistories(conversations);
            }
        });
    }

    loadAllConversationHistories(conversations: any[]) {
        // Reset all messages
        this.allMessages = [];

        // Create a counter to track loaded conversations
        let loadedCount = 0;

        // Sort conversations by ID to ensure chronological order
        const sortedConversations = [...conversations].sort((a, b) => a.conversationId - b.conversationId);

        // Load each conversation history
        sortedConversations.forEach(conv => {
            this.chatService.loadChatHistory(conv.conversationId).subscribe({
                next: (history) => {
                    // Add conversation title as a separator
                    this.allMessages.push({
                        id: `conv-${conv.conversationId}`,
                        role: 'system',
                        content: `<strong>Conversation: ${history.title}</strong>`,
                        timestamp: history.createdAt,
                        isConversationHeader: true,
                        conversationId: conv.conversationId
                    });

                    // Add all messages from this conversation
                    this.allMessages.push(...history.messages);

                    // Sort all messages by timestamp
                    this.allMessages.sort((a, b) => {
                        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                    });

                    // Increment the counter
                    loadedCount++;

                    // If all conversations are loaded, set loading to false
                    if (loadedCount === conversations.length) {
                        this.loading = false;
                        // Scroll to bottom after all conversations are loaded
                        setTimeout(() => this.scrollToBottom(), 100);
                    }
                },
                error: (err) => {
                    console.error(`Error loading conversation ${conv.conversationId}:`, err);
                    loadedCount++;
                    if (loadedCount === conversations.length) {
                        this.loading = false;
                    }
                }
            });
        });
    }

    loadConversation(conversationId: number) {
        this.loading = true;
        // Store the active conversation ID in localStorage
        localStorage.setItem('activeConversationId', conversationId.toString());
        this.chatService.loadChatHistory(conversationId).subscribe(history => {
            this.chatService.setActiveConversation(history);
            this.loading = false;
        });
    }

    startNewChat() {
        // Clear the stored conversation ID when starting a new chat
        localStorage.removeItem('activeConversationId');
        this.chatService.setActiveConversation(null);

        // Add a new conversation header to the messages
        const newChatHeader = {
            id: `conv-new-${Date.now()}`,
            role: 'system',
            content: '<strong>New Conversation</strong>',
            timestamp: new Date().toISOString(),
            isConversationHeader: true,
            conversationId: 0
        };

        this.allMessages.push(newChatHeader);

        // Scroll to bottom after adding new chat header
        setTimeout(() => this.scrollToBottom(), 100);
    }

    // Update the sendMessage method in ChatComponent
    sendMessage() {
        const trimmed = this.input.trim();
        if (!trimmed) return;

        // Create user message
        const userMessage = {
            id: Date.now(), // temporary ID
            role: 'user',
            content: trimmed,
            timestamp: new Date().toISOString(),
            contextData: {}
        };

        // Add user message to allMessages array
        this.allMessages.push(userMessage);

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
            userMessage
        ];

        this.chatService.setActiveConversation(tempConversation);

        let userId = 1;
        this.authService.currentUser$.subscribe(user => {
            userId = user?.id || 1;
        })

        const payload = {
            query: trimmed,
            userId: userId.toString(), // Replace with actual user ID
            includePdfContext: true,
            includeProductContext: true,
            conversationId: this.activeConversation?.conversationId || null
        };

        this.loading = true;
        this.input = '';

        this.chatService.sendMessage(payload).subscribe({
            next: (response) => {
                // Create assistant message
                const assistantMessage = {
                    id: Date.now(),
                    role: 'assistant',
                    content: response.llm_response,
                    timestamp: new Date().toISOString(),
                    contextData: {
                        contextUsed: response.context_used
                    }
                };

                // Add assistant message to allMessages array
                this.allMessages.push(assistantMessage);

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
                        assistantMessage
                    ]
                };

                this.chatService.setActiveConversation(updatedConversation);

                // Store the conversation ID in localStorage
                localStorage.setItem('activeConversationId', response.conversation_id.toString());

                // If this was a new conversation, add it to the list and add a conversation header
                if (!payload.conversationId) {
                    this.chatService.loadConversations(parseInt(payload.userId, 10)).subscribe(conversations => {
                        this.chatService.updateConversations(conversations);
                        this.allConversations = conversations;

                        // Find the new conversation
                        const newConv = conversations.find(c => c.conversationId === response.conversation_id);
                        if (newConv) {
                            // Add conversation header
                            const headerMessage = {
                                id: `conv-${newConv.conversationId}`,
                                role: 'system',
                                content: `<strong>Conversation: ${newConv.title}</strong>`,
                                timestamp: new Date().toISOString(),
                                isConversationHeader: true,
                                conversationId: newConv.conversationId
                            };

                            // Insert header before the first message of this conversation
                            const firstMessageIndex = this.allMessages.findIndex(m =>
                                m.id === userMessage.id);

                            if (firstMessageIndex !== -1) {
                                this.allMessages.splice(firstMessageIndex, 0, headerMessage);
                            }
                        }
                    });
                }

                this.loading = false;
                // Scroll to bottom after message is sent
                setTimeout(() => this.scrollToBottom(), 100);
            },
            error: (error) => {
                console.error('Error sending message:', error);
                this.loading = false;
            }
        });
    }
}