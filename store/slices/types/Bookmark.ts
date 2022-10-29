import { Settings } from "http2";

export enum BookmarkStatus {
    NOT_PROCESSED = 'NOT_PROCESSED',
    PROCESSING = 'PROCESSING',
    PROCESSED = 'PROCESSED'
}

export interface Bookmark {
    id: string;
    collectionId: string;
    url: string;
    html: string;
    title: string;
    author: string;
    coverImg: string;
    summary: string;
    links: string;
    isHidden: boolean;
    status: BookmarkStatus
}