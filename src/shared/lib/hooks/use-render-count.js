import { useEffect, useRef } from 'react'

const useRenderCount = (place) => {
	const count = useRef(1)
	useEffect(() => { count.current++ })

	console.log(place, count.current);
}

export default useRenderCount
