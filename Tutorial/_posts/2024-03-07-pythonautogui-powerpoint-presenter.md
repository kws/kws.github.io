---
title: "Controlling PowerPoint with Python, PyAutoGUI, and Flask"  
categories: Python Automation PowerPoint
---

Ever found yourself needing to do a PowerPoint presentation but forgot your "clicker"? Of course, as all conversations go these days, we immediately turned to: "Can we hook it up to ChatGPT?". After all, all that is needed is an API. Well, staying slightly more grounded, we decided to use Python and PyAutoGUI to control PowerPoint remotely.

In this tutorial, we'll create a Python application that uses PyAutoGUI and Flask to build a web page with buttons to remotely control a PowerPoint presentation. You'll be able to advance slides, go back, jump to the first or last slide, and more, all from a web browser such as on your phone.

 <!--more-->

![An AI robot controlling powerpoint]({{site.url}}/assets/images/blogs/2024-03-07-robot-powerpoint.webp)

## Prerequisites

Before we begin, make sure you have the following installed:

- Python 3.x
- PyAutoGUI (`pip install pyautogui`)
- Flask (`pip install flask`)
- QRCode (`pip install qrcode`)

## Step 1: Import Required Libraries

Create a new Python file. You can call it whatever you want, but lets assume something like app.py.

The the following library imports at the top of this file:

```python
import socket
import qrcode
import pyautogui

from werkzeug.serving import get_interface_ip
from flask import Flask, render_template
```

## Step 2: Create the Flask App

Initialize a new Flask application by adding the following line to your Python file:

```python
app = Flask(__name__)
```

## Step 3: Define Routes and Functions

Create routes and corresponding functions to handle button clicks. These keyboard shortcuts will control the PowerPoint presentation and are for Windows. If you're using a Mac, you'll need to change the keyboard shortcuts accordingly.

```python
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/next')
def next_slide():
    pyautogui.press('right')
    return render_template('index.html')

@app.route('/previous') 
def previous_slide():
    pyautogui.press('left')
    return render_template('index.html')

@app.route('/first')
def first_slide():
    pyautogui.hotkey('ctrl', 'home')
    return render_template('index.html')

@app.route('/last')
def last_slide(): 
    pyautogui.hotkey('ctrl', 'end')
    return render_template('index.html')
```

## Step 4: Create the HTML Template

Create a new directory named `templates` in the same directory as your Python file.

In the `templates` directory, create a file named `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>PowerPoint Remote</title>
    <meta name="viewport" content="width=50%, initial-scale=2">
</head>
<body>
    <h1>PowerPoint Remote Control</h1>
    <button onclick="location.href='/next'">Next Slide</button>
    <button onclick="location.href='/previous'">Previous Slide</button>
    <button onclick="location.href='/first'">First Slide</button>
    <button onclick="location.href='/last'">Last Slide</button>
</body>
</html>
```

## Step 5: Run the Application

Finally, go back to your python file and add the following code to run the application:

```python
if __name__ == '__main__':
    port = 5000

    ip = get_interface_ip(socket.AF_INET)
    url = f'http://{ip}:{port}'

    qr = qrcode.QRCode()
    qr.add_data(url)
    qr.print_ascii()

    app.run(host='0.0.0.0', port=port, debug=True)
```

Now run the Python script. Type `python app.py` in your terminal. You should see the IP address and port number printed, along with a QR code. You can scan the QR code with your phone to open the web page on your mobile device. The mobile has to be on the same network as the computer running the Python script.

You should see the control buttons. Clicking them will send the corresponding keyboard shortcuts to your active PowerPoint window when it is in fullscreen mode.

Open your PowerPoint presentation in presentation mode, and then click the buttons on the web page to control the presentation.

That's it! You've created a web-based remote control for PowerPoint using Python, PyAutoGUI, and Flask. Feel free to extend this application with additional functionality as needed. There are many more keyboard shortcuts you can use to control PowerPoint, and you can add more buttons to the web page to control them: <https://support.microsoft.com/en-au/office/use-keyboard-shortcuts-to-deliver-powerpoint-presentations-1524ffce-bd2a-45f4-9a7f-f18b992b93a0>.

You can read more about the tools we've used:

- [PyAutoGUI](https://pyautogui.readthedocs.io/en/latest/)
- [Flask](https://flask.palletsprojects.com/en/2.0.x/)
- [QRCode](https://pypi.org/project/qrcode/)

An implementation of this tutorial can be found at <https://github.com/kws/powerpoint-remote>

If you want to go further and do the full ChatGPT integration, check out FastAPI, which is a modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints: <https://fastapi.tiangolo.com/>.

Happy presenting!
