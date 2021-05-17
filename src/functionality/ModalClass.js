import React, { useContext } from 'react'

const ModalContext = React.createContext()

export const useModal = () =>{
	return useContext(ModalContext)
}


export const ModalClassProvider = ({children}) => {
	class ModalWindow{
		constructor(){
			super();
			this.state = {
				open:false,
				content:null
			}
			this.open = this.open.bind(this);
			this.close = this.close.bind(this);
			this.initContent = this.initContent.bind(this);
		}

		open(){
			this.setState(state=>({
				open:true
			}))
		}

		close(){
			this.setState(state=>({
				open:false
			}))
		}

		initContent(content){
			this.setState(state=>({
				content:content
			}))
		}
	}
	return (
		<ModalContext.Provider value = {ModalWindow}>
			{children}
		</ModalContext.Provider>
	)
}
