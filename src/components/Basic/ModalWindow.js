import React, { useState } from 'react'
import { useRef } from 'react'
import { useModal } from '../../contexts/ModalContext'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import {useScreen} from '../../contexts/ScreenContext'
export const ModalWindow = ({...restProps}) => {
	const {openModal, setOpenModal, content} = useModal()
	const modalRef = useRef(null)
	const {screenHeight} = useScreen()
	useOutsideClick(modalRef, setOpenModal)
	return (
		<div className = "modal_darkBg" style = {!openModal?{opacity:0, visibility:'hidden'}:{height:screenHeight}} >
			<div className = "ModalWindow" {...restProps} ref = {modalRef} style = {!openModal?{opacity:0, visibility:'hidden', transform:'translateY(40px)'}:{}}>
				{content}
			</div>
		</div>
	)
}
