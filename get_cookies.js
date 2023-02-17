var cookie = document.cookie
cookie = cookie.replaceAll(" ","")
var ask = confirm('Cookie: ' + cookie + '\n\nClick confirm to copy Cookie.'); 
if (ask == true) { 
    copy(cookie); 
    msg = cookie 
} 
else msg = 'Cancel'
