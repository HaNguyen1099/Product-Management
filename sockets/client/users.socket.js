const User = require("../../models/user.model")

module.exports = async (res) => {
    _io.once('connection', (socket) => {
        // Người dùng gửi yêu cầu kết bạn
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id 

            // console.log(myUserId) // Id của A 
            // console.log(userId) // Id của B

            // Thêm id của A vào acceptFriends của B 
            const existUserAInB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })

            if (!existUserAInB) {
                await User.updateOne({
                    _id: userId 
                }, {
                    $push: { acceptFriends: myUserId }
                })
            }

            // Thêm id của B vào requestFriends của A 
            const existUserBInA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })

            if (!existUserBInA) {
                await User.updateOne({
                    _id: myUserId 
                }, {
                    $push: { requestFriends: userId }
                })
            }
        })

        // Người dùng hủy gửi yêu cầu kết bạn 
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id 

            // console.log(myUserId) // Id của A 
            // console.log(userId) // Id của B

            // Xóa id của A khỏi acceptFriends của B 
            const existUserAInB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })

            if (existUserAInB) {
                await User.updateOne({
                    _id: userId 
                }, {
                    $pull: { acceptFriends: myUserId }
                })
            }

            // Xóa id của B khỏi requestFriends của A 
            const existUserBInA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })

            if (existUserBInA) {
                await User.updateOne({
                    _id: myUserId 
                }, {
                    $pull: { requestFriends: userId }
                })
            }
        })

        // Người dùng từ chối kết bạn 
        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id 

            // console.log(myUserId) // Id của B 
            // console.log(userId) // Id của A

            // Xóa id của A khỏi acceptFriends của B 
            const existUserAInB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })

            if (existUserAInB) {
                await User.updateOne({
                    _id: myUserId 
                }, {
                    $pull: { acceptFriends: userId }
                })
            }

            // Xóa id của B khỏi requestFriends của A 
            const existUserBInA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })

            if (existUserBInA) {
                await User.updateOne({
                    _id: userId 
                }, {
                    $pull: { requestFriends: myUserId }
                })
            }
        })

        // Người dùng chấp nhận kết bạn 
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id 

            // console.log(myUserId) // Id của B 
            // console.log(userId) // Id của A            

            // Thêm {user_id, room_chat_id} của A vào friendList của B
            // Xóa id của A khỏi acceptFriends của B 
            const existUserAInB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })

            if (existUserAInB) {
                await User.updateOne({
                    _id: myUserId 
                }, {
                    $push: { 
                        friendList: {
                            user_id: userId,
                            room_chat_id: ""
                        }
                    },
                    $pull: { acceptFriends: userId }
                })
            }

            // Thêm {user_id, room_chat_id} của B vào friendList của A
            // Xóa id của B khỏi requestFriends của A 
            const existUserBInA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })

            if (existUserBInA) {
                await User.updateOne({
                    _id: userId 
                }, {
                    $push: { 
                        friendList: {
                            user_id: myUserId,
                            room_chat_id: ""
                        }
                    },
                    $pull: { requestFriends: myUserId }
                })
            }
        })
    })
}