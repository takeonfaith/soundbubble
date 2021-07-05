import React from 'react'
import { useModal } from '../../functionality/ModalClass'

export const GeneralSettings = () => {
	const {setContent} = useModal()
	return (
		<div className = "GeneralSettings">
			Settings
		</div>
	)
}
