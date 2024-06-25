interface Message {
    type: string;
    data: string; 
}

const handleNewTransaction = (message: Message) => {
    if (message.type === 'NEW_TRANSACTION') {
        console.log('Handling new transaction:', message.data);
    } else {
        console.log('Unknown message type:', message.type);
    }
};

export { handleNewTransaction };
