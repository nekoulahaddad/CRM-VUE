module.exports = async (req, res, next) => {
	try {
		const userId = req.userId.toString()
		const user = await User.findById(userId, 'isAdmin')
		if (user.isAdmin && user.isAdmin === true) {
			next()
		} else {
			throw new Error("Не авторизован")
		}
	} catch (error) {
		next(error)
	}
}
