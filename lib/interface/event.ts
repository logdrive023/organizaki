// src/types/event.ts
export interface NewEventRequest {
    title: string;
    description: string;
    date: string;   
    time: string;      
    location: string;
    coverImage?: string;
}


export interface UpdateEventRequest {
    id: string;
    title: string;
    description: string;
    date: string;       
    time: string;      
    location: string;
    coverImage?: string;
}

export interface EventType {
    id: string
    title: string
    description: string
    date: string
    time: string
    location: string
    coverImage: string
    status: "active" | "draft"
    guestCount: number
    createdAt: string
    updatedAt: string
}