import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
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
	const [rows, setRows] = useState<{ id: string; data: boolean[] }[]>([])

	const paintTable = async () => {
		try {
			const cols = await createColumns()
			const rowsData = await createRows(cols.length)
			const rowsWithIds = rowsData.map((row) => ({
				id: uuidv4(),
				data: row
			}))
			setColumns(cols)
			setRows(rowsWithIds)
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
				{
					id: uuidv4(),
					data: Array.from(
						{ length: columns.length },
						() => Math.random() >= 0.5
					)
				}
			])
			setIsModalOpen(false)
		})
		setIsModalOpen(true)
	}

	const handleDeleteRow = (id: string) => {
		setModalMessage('Вы уверены, что хотите удалить строку?')
		setModalAction(() => () => {
			setRows(rows.filter((row) => row.id !== id))
			setIsModalOpen(false)
		})
		setIsModalOpen(true)
	}

	const handleChangeRow = (id: string) => {
		setModalMessage('Вы уверены, что хотите изменить строку?')
		setModalAction(() => () => {
			const newRow = rows.map((row) =>
				row.id === id
					? { ...row, data: row.data.map(() => Math.random() > 0.5) }
					: row
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
							<tr key={row.id}>
								<td className='cell rowHeader'>
									<span>Заказ {rowIndex + 1}</span>
									<div className='buttonGroup'>
										<button
											className='button applyBtn'
											onClick={() => handleChangeRow(row.id)}
										>
											Редактировать
										</button>
										<button
											className='button cancelBtn'
											onClick={() => handleDeleteRow(row.id)}
										>
											Удалить
										</button>
									</div>
								</td>
								{row.data.map((highlight, cellIndex) => (
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
