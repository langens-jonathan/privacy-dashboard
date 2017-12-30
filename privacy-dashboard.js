const registerCookiesHTML = "http://localhost:8888/cookies";

function sendCookiesForTab(tabs) {
    //get the first tab object in the array
    let tab = tabs.pop();

    //get all cookies in the domain
    var gettingAllCookies = browser.cookies.getAll({url: tab.url});
    gettingAllCookies.then((cookies) => {
        var lCookies = [];
        let cookiesEl = document.getElementById('cookies');

        if (cookies.length > 0) {
            for (let cookie of cookies) {
                lCookies.push( {
                    "name": cookie.name,
                    "value": cookie.value,
                    "domain": cookie.domain,
                    "path": cookie.path,
                    "expirationDate": cookie.expirationDate
                });
            }
            let cookieTableHTML = "<table><thead><tr><th>name</th><th>value</th><th>domain</th><th>path</th><th>expiration date</th></tr></thead><tbody>";
            for(cn in lCookies) {
                let c = lCookies[cn];
                cookieTableHTML += "<tr><td>" + c["name"] + "</td><td>" + c.value + "</td><td>" + c.domain;
                cookieTableHTML += "</td><td>" + c.path + "</td><td>" + c.expirationDate +  "</td></tr>";
            }
            cookieTableHTML += "</tbody></table>";
            cookiesEl.innerHTML = cookieTableHTML;

            // then we send the cookies to the registerCookiesHTML
            var http = new XMLHttpRequest();
            http.open("POST", registerCookiesHTML, true);
            http.setRequestHeader("Content-Type", "application/json");
            http.onreadystatechange = function() {//Call a function when the state changes.
                if(http.readyState == 4 && http.status == 200) {
                }
            };
            http.send(JSON.stringify(lCookies));
        } else {
            let p = document.createElement("p");
            let content = document.createTextNode("No cookies in this tab.");
            let parent = cookieEl.parentNode;
                        p.appendChild(content);
            parent.appendChild(p);
        }
    });
}

function getActiveTab() {
    return browser.tabs.query({currentWindow: true, active: true});
}
getActiveTab().then(sendCookiesForTab);
