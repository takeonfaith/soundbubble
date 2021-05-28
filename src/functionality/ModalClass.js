import React, { useContext, useState } from 'react'

const ModalContext = React.createContext()

export const useModal = () =>{
	return useContext(ModalContext)
}

export const ModalClassProvider = ({children}) => {
	const [openModal, setOpenModal] = useState(false)
	const [content, setContent] = useState(<h1>Test</h1>)
	
	function toggleModal(){
		setOpenModal(!openModal)
	}

	const value = {
		openModal,
		setOpenModal,
		toggleModal, 
		setContent, 
		content
	}
	return (
		<ModalContext.Provider value = {value}>
			{children}
		</ModalContext.Provider>
	)
}
