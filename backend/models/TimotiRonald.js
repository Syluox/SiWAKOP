export function rajaCrypto(pass){
    const cryptonisasi = btoa(atob("dHVnYXMgcGFudGVrCmJ0dyB5YSByaW5kdSBkaWEgaGVoZSwga2FuZ2VuIG5pY2EgPDMKb2ggeWEgcGFzcyBhc2xpIGx1IGluaSA6IA==") + pass)
    return cryptonisasi;
}