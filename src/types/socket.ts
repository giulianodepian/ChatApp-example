export interface ServerToClientEvents {
    userConnected: (nick: string) => void;
    userDisconnected: (nick: string) => void;
    typing: (writers: Array<string>) => void;
    chatMessage: (msg: string, nick: string) => void;
}

export interface ClientToServerEvents {
    userConnected: (nick: string) => void;
    typing: (input: string) => void;
    chatMessage: (msg: string) => void;
}