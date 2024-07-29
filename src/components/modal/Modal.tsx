import { useRef } from 'react'
import { useClickOutside } from '../hooks/useClickOutside'
import './modal.css'

type Props = {
	message: string
	onConfirm: () => void
	onClose: () => void
}

const Modal = ({ message, onConfirm, onClose }: Props) => {
	const outsideRef = useRef(null)
	useClickOutside(outsideRef, onClose)

	return (
		<div className='modalBg'>
			<div
				className='modal'
				ref={outsideRef}
			>
				<h3>{message}</h3>
				<div className='buttonGroup'>
					<button
						className='button applyBtn'
						onClick={onConfirm}
					>
						Подтвердить
					</button>
					<button
						className='button cancelBtn'
						onClick={onClose}
					>
						Отменить
					</button>
				</div>
			</div>
		</div>
	)
}

export default Modal
