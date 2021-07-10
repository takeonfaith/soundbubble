import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { findAmountOfUnseenMessages } from '../../functions/findAmountOfUnseenMessages'
export const AmountOfUnseenMessages = ({amountOfUnseen}) => {
	
	return amountOfUnseen !== 0?(
		<div className = "AmountOfUnseenMessages">
			{amountOfUnseen}
		</div>
	):null
}
