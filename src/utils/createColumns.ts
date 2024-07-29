export const createColumns = async (): Promise<string[]> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			const columnCount = Math.floor(Math.random() * 99) + 2
			const columns = Array.from(
				{ length: columnCount },
				(_, index) => `Обработка ${index + 1}`
			)
			resolve(columns)
		}, 1500)
	})
}
