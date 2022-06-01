import md5 from "md5"

export const generatingNumberEmployee = (id, numberOfСharacters = 4) => {
	const arr = []
	if (arr.includes(id))
		console.log('====== При генерации employee.number получились два одинаковых значения ======')

	arr.push(id)
	id = md5(id).replace(/[a-zа-яё]/gi, '') + (id).toString().replace(/[a-zа-яё]/gi, '')
	return id = id.slice(0, numberOfСharacters)
}