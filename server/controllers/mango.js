const mongoose = require('mongoose')
const User = require('../models/user')
const request = require('request')
const VPBX = require('mango-vpbx');
const vpbx = new VPBX(process.env.MANGO_TOKEN, process.env.MANGO_KEY);


exports.getMangoCallsRecording = async(req, res, next) => {
    try {

        const json = {
            recording_id: 'MToxMDA2MjA1OToxMDYwMTQ4NDgwODow',
            expires: 'MAX',
        };
        const { success, recording } = await vpbx.recording(json);
        console.log(recording);
        res.status(200).json({
            success,
            recording
        })
    } catch (error) {
        next(error)
    }
}

exports.getMangoCalls = async(req, res, next) => {
    try {

        const json = {
            date_from: leftSide,
            date_to: rightSide,
            to: {
                number: '79162621059'
            },
            fields: 'entry_id'
        };
        const { success, stats } = await vpbx.stats(json);
        console.log(stats[0][0])
        res.status(200).json({
            success,
            stats
        })
    } catch (error) {
        next(error)
    }
}

exports.callFromManagerToClient = async(req, res, next) => {
    try {
        const userId = req.userId
        console.log(req.body)
        const phone = req.body.phone.replace('+', '').replace(/ /g, "");

        const user = await User.findById(mongoose.Types.ObjectId(userId)).lean()
        console.log(user.inner_number)
        const json = {
            from: {
                extension: user.inner_number
            },
            to_number: phone,
        };
        const resultCall = await vpbx.call(json);
        console.log(resultCall.success)

        res.status(200).json({
            resultCall
        })
    } catch (error) {
        next(error)
    }
}

exports.callHangUp = async(req, res, next) => {
    try {
        const callId = req.body.call_id

        const json = {
            call_id: callId
        };
        const { success } = await vpbx.hangup(json);
        console.log(success)
        res.status(200).json({
            success
        })
    } catch (error) {
        next(error)
    }
}