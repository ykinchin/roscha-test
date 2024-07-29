import { RefObject, useEffect } from 'react'

export const useClickOutside = (
	ref: RefObject<HTMLElement>,
	cb: () => void
) => {
	useEffect(() => {
		const onClick = ({ target }: MouseEvent) => {
			if (ref.current && !ref.current.contains(target as Node)) {
				cb()
			}
		}

		const timer = setTimeout(() => {
			document.addEventListener('click', onClick)
		}, 0)

		return () => {
			clearTimeout(timer)
			document.removeEventListener('click', onClick)
		}
	}, [cb, ref])
}
