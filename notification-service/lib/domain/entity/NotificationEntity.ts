class NotificationEntity {
    id: string | null;
    type: 'info' | 'success' | 'warning' | 'error' | 'system';
    message: string;
    link: string | null;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
  
    constructor({
      id,
      type,
      message,
      link,
      isRead,
      createdAt,
      updatedAt,
    }: {
      id?: string;
      type?: 'info' | 'success' | 'warning' | 'error' | 'system';
      message: string;
      link?: string;
      isRead?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
    }) {
      this.id = id || null;
      this.type = type || 'info';
      this.message = message;
      this.link = link || null; 
      this.isRead = isRead || false;
      this.createdAt = createdAt || new Date();
      this.updatedAt = updatedAt || new Date();
    }
  
    markAsRead() {
      this.isRead = true;
      this.updatedAt = new Date();
    }
  
    markAsUnread() {
      this.isRead = false;
      this.updatedAt = new Date();
    }
  }
  