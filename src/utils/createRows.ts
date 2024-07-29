export const createRows = async (columnCount: number): Promise<boolean[][]> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			const rowCount = Math.floor(Math.random() * 99) + 2
			const rows = Array.from({ length: rowCount }, () =>
				Array.from({ length: columnCount }, () => Math.random() >= 0.5)
			)
			resolve(rows)
		}, 1500)
	})
}
