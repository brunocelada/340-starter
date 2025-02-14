const form1 = document.querySelector("#update-account-form")
    form1.addEventListener("change", function () {
      const updateBtn1 = document.querySelector("#submit-account-btn")
      updateBtn1.removeAttribute("disabled")
})

const form2 = document.querySelector("#update-pswd-form")
    form2.addEventListener("change", function () {
      const updateBtn2 = document.querySelector("#submit-pswd-btn")
      updateBtn2.removeAttribute("disabled")
})