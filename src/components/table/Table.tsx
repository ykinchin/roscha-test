import { useEffect, useState } from 'react'
import { createColumns } from '../../utils/createColumns'
import { createRows } from '../../utils/createRows'
import Modal from '../modal/Modal'
import './table.css'

const Table = () => {
	const [isLoading, setIsLoading] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalAction, setModalAction] = useState<() => void>(() => {})
	const [modalMessage, setModalMessage] = useState('')

	const [columns, setColumns] = useState<string[]>([])
	const [rows, setRows] = useState<boolean[][]>([])

	const paintTable = async () => {
		try {
			const cols = await createColumns()
			const rowsData = await createRows(cols.length)
			setColumns(cols)
			setRows(rowsData)
		} catch (error) {
			console.error('Error painting table:', error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		paintTable()
	}, [])

	const handleAddRow = () => {
		setModalMessage('Вы уверены, что хотите добавить строку?')
		setModalAction(() => () => {
			setRows([
				...rows,
				Array.from({ length: columns.length }, () => Math.random() >= 0.5)
			])
			setIsModalOpen(false)
		})
		setIsModalOpen(true)
	}

	const handleDeleteRow = (index: number) => {
		setModalMessage('Вы уверены, что хотите удалить строку?')
		setModalAction(() => () => {
			setRows(rows.filter((_, i) => i !== index))
			setIsModalOpen(false)
		})
		setIsModalOpen(true)
	}

	const handleChangeRow = (index: number) => {
		setModalMessage('Вы уверены, что хотите изменить строку?')
		setModalAction(() => () => {
			const newRow = rows.map((row, i) =>
				i === index ? row.map(() => Math.random() > 0.5) : row
			)
			setRows(newRow)
			setIsModalOpen(false)
		})
		setIsModalOpen(true)
	}

	if (isLoading) {
		return <div>Painting table...</div>
	}

	return (
		<>
			<div className='container'>
				<table className='table'>
					<thead>
						<tr>
							<th></th>
							{columns.map((col, index) => (
								<th
									key={index}
									className='header'
								>
									{col}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rows.map((row, rowIndex) => (
							<tr key={rowIndex}>
								<td className='cell rowHeader'>
									<span>Заказ {rowIndex + 1}</span>
									<div className='buttonGroup'>
										<button
											className='button applyBtn'
											onClick={() => handleChangeRow(rowIndex)}
										>
											Редактировать
										</button>
										<button
											className='button cancelBtn'
											onClick={() => handleDeleteRow(rowIndex)}
										>
											Удалить
										</button>
									</div>
								</td>
								{row.map((highlight, cellIndex) => (
									<td
										key={cellIndex}
										className={`cell ${highlight ? 'highlight' : ''}`}
									></td>
								))}
							</tr>
						))}
					</tbody>
				</table>
				<button
					className='addButton'
					onClick={handleAddRow}
				>
					Добавить строку
				</button>
			</div>
			{isModalOpen && (
				<Modal
					message={modalMessage}
					onConfirm={modalAction}
					onClose={() => setIsModalOpen(false)}
				/>
			)}
		</>
	)
}

export default Table
