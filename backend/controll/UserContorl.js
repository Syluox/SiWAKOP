export async function registUser(user,email,pass) 
{
    const data = {user,email,pass};
    try{
        const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data) 
    });

    const result = await res.json();
    if(!res.ok){
        alert("Error : " + result.message);
    }
    else{
        alert("Sucsess");
    }
    }catch(e){
        
    }
}

export async function sulap(text) {
    try{
        const res = await fetch("http://localhost:5000/api/auth/sulap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(text) 
    });

    const result = await res.json();
    if(!res.ok){
        alert(result.message);
    }
    else{
        alert(result.message);
    }
    }catch(e){

    }
}