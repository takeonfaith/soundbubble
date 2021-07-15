export function findAmountOfUnseenMessages(messages, currentUser) {
	return messages.reduce((accum, message)=>{
		if(message.sender !== currentUser.uid){
			if(message.seenBy !== undefined){
				if(!message.seenBy.includes(currentUser.uid)){
					console.log("i'm here")
					return ++accum
				}
			}
		}
		return accum
	}, 0)
}