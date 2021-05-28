import React, { useState } from 'react'
import { useRef } from 'react'
import { useModal } from '../../functionality/ModalClass'
import { useOutsideClick } from '../../hooks/useOutsideClick'

export const ModalWindow = ({children, ...restProps}) => {
	const {openModal, setOpenModal, content} = useModal()
	const modalRef = useRef(null)
	useOutsideClick(modalRef, setOpenModal)
	return (
		<div className = "modal_darkBg" style = {!openModal?{opacity:0, visibility:'hidden', transform:'scale(.95)'}:{}} >
			<div className = "ModalWindow" {...restProps} ref = {modalRef}>
				{content}
			</div>
		</div>
	)
}
