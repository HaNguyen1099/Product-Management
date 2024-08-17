// Show Alert 
const showAlert = document.querySelector("[show-alert]")
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"))
    const closeAlert = showAlert.querySelector("[close-alert]")

    setTimeout(() => {
        showAlert.classList.add("alert-hidden")
    }, time)

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden")
    })
}

// Button Go Back 
const buttonGoBack = document.querySelectorAll("[button-go-back]")
if (buttonGoBack.length > 0) {
    buttonGoBack.forEach(button => {
        button.addEventListener("click", () => {
            history.back()
        })
    })
}

// Preview Image 
const uploadImage = document.querySelector("[upload-image]")
const closeButton = document.querySelector(".close-button")

if (uploadImage) {
    const uploadImageInput = document.querySelector("[upload-image-input]")
    const uploadImagePreview = document.querySelector("[upload-image-preview]")
    
    uploadImageInput.addEventListener("change", (e) => {
        console.log(e)
        const file = e.target.files[0]
        console.log(file)
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file)
            console.log(uploadImagePreview.src)

            closeButton.classList.remove("d-none")
            closeButton.addEventListener(("click"), () => {
                uploadImageInput.value = ""
                uploadImagePreview.src = ""
                closeButton.classList.add("d-none")
            })
        } 
    })
}