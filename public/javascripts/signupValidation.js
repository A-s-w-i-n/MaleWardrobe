function signupVal(){
    var name=document.submission.name.value
    var email=document.submission.email.value
    var phone=document.submission.phone.value
    var password=document.submission.password.value
    var confirmPassword=document.submission.confirmpassword.value

    let pass=document.getElementsByClassName("text-danger")
    const phoneRegex= /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
    const emailRegex= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const passwordRegex= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/gm
    const nameRegex=/^[a-z ,.'-]+$/i
    
    if(name==""&&email==""&&phone==""&&password==""&&confirmPassword==""){
        let i=0
        while(i<pass.length){
            pass[i].innerHTML="Please fill the field"
            i++
        }
        return false
    }
    if(name==""){
        pass[0].innerHTML="The name is empty"
      
        return false
    }
    if(name.length<5){
        
        pass[0].innerHTML='Name should contain 5 letters'
         return false
    }
    if(nameRegex.test(name)==false){
        pass[0].innerHTML="Enter correct name"

        return false
    }
    if(email==""){
        pass[1].innerHTML="Email is empty"

        return false
    }
    if(emailRegex.test(email)==false){
        pass[1].innerHTML="Invalid email"
        return false
    }
    if(phone==""){
        pass[2].innerHTML="Phone number is empty"
        return false
    }
    if(phoneRegex.test(phone)==false){
        pass[2].innerHTML="Need minimum 10 numbers"
        return false
    }
    if(password==""){
        pass[3].innerHTML="Password is empty"
        return false
    }
    if(passwordRegex.test(password)==false){
        pass[4].innerHTML="Enter proper password"
        return false
    }
    if(confirmPassword!=password){
        pass[5].innerHTML="Password is incorrect"
        return false
    }
    return true
}

    function clearform(){
        let pass=document.getElementsByClassName("text-danger")
        let i=0
        while(i<pass.length){
            pass[i].innerHTML=""
            i++
        }
    }

