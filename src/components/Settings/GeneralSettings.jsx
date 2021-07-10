import React from 'react'
import { useModal } from '../../contexts/ModalContext'

export const GeneralSettings = () => {
	const {setContent} = useModal()
	return (
		<div className = "GeneralSettings">
			Settings
		</div>
	)
}
