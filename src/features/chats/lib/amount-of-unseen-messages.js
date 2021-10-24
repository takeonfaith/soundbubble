export function amountOfUnseenMessages(messages, currentUser) {
	return messages.reduce((accum, message) => {
		if (message.sender !== currentUser.uid) {
			if (message.seenBy !== undefined) {
				if (!message.seenBy.includes(currentUser.uid)) {
					return ++accum
				}
			}
		}
		return accum
	}, 0)
}