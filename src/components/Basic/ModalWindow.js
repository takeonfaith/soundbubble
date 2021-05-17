import React from 'react'

export const ModalWindow = ({children, ...restProps}) => {
	return (
		<div className = "modal_darkBg">
			<div className = "ModalWindow" {...restProps}>
				{children}
			</div>
		</div>
	)
}
