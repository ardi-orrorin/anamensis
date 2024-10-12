interface SocketMessage {
    sender: string;
    content: string;
    chatRoomId: number;
    id: number;
    createAt: string;
    inputting: boolean;
    completed: boolean;

}