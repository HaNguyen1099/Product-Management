const Chat = require("../../models/chat.model")

const uploadToCloudinary = require("../../helpers/uploadToCloudinary")

module.exports = async (res) => {
    const userId = res.locals.user.id 
    const fullName = res.locals.user.fullName 

    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            let images = []

            for (const imageBufer of data.images) {
                const link = await uploadToCloudinary(imageBufer)
                images.push(link)
            }

            // Lưu vào database 
            const chat = new Chat({
                user_id: userId,
                content: data.content,
                images: images
            })
            await chat.save()

            // Trả data về cho client 
            _io.emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images: images
            })
        })

        socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullName: fullName,
                type: type
            })
        })
    })
}