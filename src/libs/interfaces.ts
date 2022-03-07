export interface payload {
    PhoneNumber: string;
    Message: string;
}

export function validatePayload(msg:string) {
    // potential issues with correct titles but incorrect data i.e phoneNumber: sixsevenfive
    // TODO: realistically need regex 
    return  msg.includes("PhoneNumber") && (msg.match(/\+\d{12}/) !== null) && msg.includes("Message")    
}