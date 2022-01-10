# Serving Web Apps locally
**IMPORTANT**
To use this server, make sure to turn ON testing in experience-manager.js line 10
```
10     const inTesting = true
```

Serving web app locally from your computer can be tricky as browsers require HTTPS certificates to access the camera on your phone through a browser.  As a convenience, We have provided a "serve" script that will run a local https webserver on your development computer.

## Serving locally from Mac

1. Install Node.js and npm

If you don't already have Node.js and npm installed, get it here: https://www.npmjs.com/get-npm

2. Open a terminal window (Terminal.app, iTerm2, etc):

```
# cd <to_this_serve_directory>
# npm install
# cd ..
# ./serve/bin/serve -d <sample_project_location>
```

Example:
```
./serve/bin/serve -n -d gettingstarted/xraframe/ -p 7777
```

**IMPORTANT**: To connect to this local webserver, make sure to copy the **entire** "Listening" URL into your browser, including both the "**https://**" at the beginning and **port** number at the end.

**NOTE**: If the serve script states it's listening on **127.0.0.1**:<port\> (which is the loopback device aka "localhost") your mobile phone won't be able to connect to that IP address directly.  Please re-run the `serve` script with the `-i` flag to specify the network interface the serve script should listen on.

Example - specify network interface:
```
./serve/bin/serve -d gettingstarted/xraframe/ -p 7777 -i en0
```

## Serving locally From Windows

1. Install Node.js and npm

If you don't already have Node.js and npm installed, get it here: https://www.npmjs.com/get-npm

2. Open a Command Prompt (cmd.exe)

```
# cd <to_this_serve_directory>
# npm install
# cd ..
# serve\bin\serve.bat -d <sample_project_dir>
```

Example:
```
serve\bin\serve.bat -n -d gettingstarted\xraframe -p 7777
```
**IMPORTANT**: To connect to this local webserver, make sure to copy the **entire** "Listening" URL into your browser, including both the "**https://**" at the beginning and **port** number at the end.

**NOTE**: If the serve script states it's listening on **127.0.0.1**:<port\> (which is the loopback device aka "localhost") your mobile phone won't be able to connect to that IP address directly.  Please re-run the `serve` script with the `-i` flag to specify the network interface the serve script should listen on.

Example - specify network interface:
```
serve\bin\serve.bat -d gettingstarted\xraframe -p 7777 -i WiFi
```



**To Test for Multiple Devices**

**IMPORTANT**
To use this server, make sure to turn OFF testing in experience-manager.js line 10
```
10     const inTesting = false
```

1.	Open a Command Prompt (cmd.exe)

```
# cd <project root>
#npm update
#npm start
```

2.	Local server will start and display listening port (i.e. 3000)

3.	Using a web browser go to https://127.0.0.1:PORT i.e. https://127.0.0.1:3000/

4.	From mobile device on same network access webserver by going to https://<local webserver IP>:PORT i.e. https://192.168.1.190:3000

**IMPORTANT NOTE** 
Be sure https:// precedes webserver IP! Using 127.0.0.1:3000 will not properly start https webserver. Be sure to use https://127.0.0.1:3000
The same must be done on mobile device 
**Always use https://**