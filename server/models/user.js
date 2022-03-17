const mongoose = require('mongoose')
const path = require('path')
const { AVATARS_PATH } = require('../utils/path')
const Schema = mongoose.Schema

const DefaultAvatar = path.join(AVATARS_PATH, '/default.svg')

const userSchema = new Schema({
    // ФИО
    surname: { type: String, required: true },
    name: { type: String, required: true },
    lastname: { type: String, required: false },

    // Регион
    region: { type: Schema.Types.ObjectId, required: false, ref: 'Regions' },

    // Информация о работе
    position: { type: String, required: true },
    rating: { type: Number, required: false },
    salary: { type: Number, required: false },
    award: { type: Number, required: false },
    department: { type: Schema.Types.ObjectId, required: false, ref: 'Departments' },
    sub_department: { type: String, required: false },
    graphic: { type: String, required: false },

    // Задачи
    tasks: [{ type: Schema.Types.ObjectId, required: false, ref: 'Tasks' }],

    // Личная информация
    email: { type: String, required: false },
    login: { type: String, required: false },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    additional_phone: { type: String, required: false },
    education: { type: String, required: false },
    specialty: { type: String, required: false },
    avatar: { type: String, required: false, default: DefaultAvatar },

    employment_date: { type: Date, required: true },
    city: { type: String, required: false },
    street: { type: String, required: false },
    house: { type: String, required: false },
    appartment: { type: String, required: false },

    passport: { type: String, required: false },
    passport_photo: [{ type: String, required: false }],
    inn: { type: String, required: false },

    date_of_birth: { type: Date, default: new Date() },

    token: { type: String, required: false, default: null },
    refresh: { type: String, required: false, default: null },
    children: { type: Array, required: false, default: null},
    // children: [{
    //     fio: { type: String, required: false, default: null },
    //     gender: { type: String, required: false, default: null },
    //     birthDate: { type: Date, required: false, default: null }
    // }],
    options: {
        userEditor: { type: Boolean, required: false, default: false },
    },
    role: { type: String, required: false, default: 'worker' },
    number: { type: String, required: false },
    presonal_number: { type: String, required: false },
    inner_number: { type: String, required: false },
    zodiac_sign: { type: String, required: false },
    element: { type: String, required: false },
    chinese_year: { type: String, required: false },
    deleted: { type: Boolean, required: true, default: false }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)