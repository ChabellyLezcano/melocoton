export interface MessageResponse {
    ok:       boolean;
    msg:      string;
    messages: Message[];
    message: Message
}

export interface Message {
    _id:         string;
    text:        string;
    user: {
        _id: string;
        username: string;
        photo: string; 
        role: string;
      };
    date:        Date;
    attachments: any[];
    __v:         number;
}