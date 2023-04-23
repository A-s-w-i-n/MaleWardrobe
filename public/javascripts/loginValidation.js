function loginval(){
    var name=document.submission.name.value
    var password=document.submission.password.value

    let pass=document.getElementsByClassName("text-danger")

    const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/gm

    if(name==""&&password==""){
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
        pass[0].innerHTML="name should contain 5 letters"
        
        return false
    }
    if(password==""){
        pass[1].innerHTML="Password is empty"
        return false
    }
    if(passwordRegex.test(password)==false){
        pass[1].innerHTML="Enter propper password"
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