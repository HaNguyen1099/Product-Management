import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// CLIENT_SEND_MESSAGE 
const formSendData = document.querySelector(".chat .inner-form")
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault()
        const content = e.target.elements.content.value 

        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content)
            e.target.elements.content.value = ""
        }
    })
}

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id")
    const body = document.querySelector(".chat .inner-body") 

    const div = document.createElement("div")

    let htmlFullName = ""

    if (myId == data.userId) {
        div.classList.add("inner-outgoing")
    } else {
        div.classList.add("inner-incoming")
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`
    }

    div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content">${data.content}</div>
    `

    body.appendChild(div)
    body.scrollTop = body.scrollHeight
})

// Scoll chat to bottom 
const bodyChat = document.querySelector(".chat .inner-body")
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight
}

// Emoji 
// Show PopUp
const buttonIcon = document.querySelector(".button-icon")
if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(buttonIcon, tooltip)

    buttonIcon.onclick = () => {
        tooltip.classList.toggle("shown")
    }
}
// Insert Icon
const emojiPicker = document.querySelector("emoji-picker") 
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']")

    emojiPicker.addEventListener("emoji-click", (e) => {
        const icon = e.detail.unicode 
        inputChat.value = inputChat.value + icon
    })
}