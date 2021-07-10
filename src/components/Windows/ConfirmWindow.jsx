import React, { useRef } from 'react'
import { useModal } from '../../contexts/ModalContext'
import { useOutsideClick } from '../../hooks/useOutsideClick'

export const ConfirmWindow = () => {
	const { isOpenConfirm, confirmContent, setIsOpenConfirm, closeComfirm } = useModal()
	const confirmRef = useRef(null)
	useOutsideClick(confirmRef, setIsOpenConfirm)
	return (
		<div className="modal_darkBg confirm" style={!isOpenConfirm ? { opacity: 0, visibility: 'hidden' } : {}} >
			<div className="ConfirmWindow" ref = {confirmRef} style={!isOpenConfirm ? { transform: 'translateY(40px)' } : {}}>
				<h3>{confirmContent.question}</h3>
				<div className="confirmButtons">
					<button onClick={confirmContent.onConfirm} className = "standartButton">{confirmContent.confirmText}</button>
					<button onClick={confirmContent.onReject} className = "standartButton">{confirmContent.rejectText}</button>
				</div>
			</div>
		</div>
	)
}
