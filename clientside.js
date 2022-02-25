var wpcf7Form = document.querySelector( '.wpcf7' );

wpcf7Form.addEventListener( 'wpcf7submit', function( event ) {
    console.log("submitting message")
    let fields = {}
    let payload = ""
    const http = new XMLHttpRequest()

    http.onreadystatechange = function() { // request sent
        console.log(`readystate is ${this.readyState}`) // debugging
        if (this.readyState == 2) {
            document.getElementsByClassName("wpcf7-spinner")[0].style.visibility = "visible";
            document.getElementsByClassName("wpcf7-submit")[0].value = "Sender...";
            document.getElementsByClassName("wpcf7-response-output")[0].style.display = "";
       }
        if (this.readyState == 4) {  // received answer
            document.getElementsByClassName("wpcf7-spinner")[0].style.visibility = "hidden";
            if (this.status != 200) {
            document.getElementsByClassName("wpcf7-response-output")[0].innerHTML = `Fejl ${this.status}: Beskeden kunne desværre ikke sendes. Prøv igen eller ring i stedet.`;
            document.getElementsByClassName("wpcf7-spinner")[0].style.border = '2px solid #f66f6f';
            }
            else {
            document.getElementsByClassName("wpcf7-response-output")[0].innerHTML = "Tak for din besked. Den er nu afsendt.";
            document.getElementsByClassName("wpcf7-spinner")[0].style.border = '2px solid #edae44';
            document.getElementsByClassName("wpcf7-submit")[0].value = "Sendt!";
            }
       }
    };

    event.detail.inputs.forEach((element, i, array) => {Object.assign(fields,{[element['name']] : element['value']})});
    http.open('POST', '/mailhook', true);
    http.setRequestHeader('content-type', 'application/json');
    payload = JSON.stringify({"body" : fields});
    console.log("submitted message");
    console.log(payload);
    http.send(payload);
    console.log(http.responseText);
}, false );

