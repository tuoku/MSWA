# Artster

Artster is a social platform, where users can share their art that they have worked hard on.

This was created as a project for Metropolias Web-teknologian peruskonseptit course

## Deployment

1. Clone repository by running `git clone https://github.com/tuoku/MSWA.git`  command
2. Move **public** folder to a location of your choice.
3. Change the URL in **index.js** to an appropriate address.
4. Import SQL Dump to a SQL Server
5. Setup your **.env** file appropriately 
6. Run `npm i` and `node app.js`


## Example request

```javascript
const data = {"username": "tester", "password": "AAAA1234"};
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  };
 
  const response = await fetch(url + '/auth/login', fetchOptions);
  const json = await response.json();
```
You receive user object from database and a token
```javascript
"user": {
        "id": 35,
        "username": "tester",
        "isAdmin": {
            "type": "Buffer",
            "data": [
                0
            ]
        },
        "banned": {
            "type": "Buffer",
            "data": [
                0
            ]
        },
        "email": "tester@tester.com",
        "profileFilename": "placeholder",
        "vst": "2021-04-30T08:53:52.000Z",
        "vet": null
    },
    "token": "dfbgmkpdfgmpkfgdposdflUNi+0gfdgertrte.hfghfghhtrtAHFAF"
```

## Dreamteam

**tuoku** https://github.com/tuoku \
**TheKents0209** https://github.com/TheKents0209 \
**ddiyar** https://github.com/ddiyar 


## License
[MIT](https://choosealicense.com/licenses/mit/)
