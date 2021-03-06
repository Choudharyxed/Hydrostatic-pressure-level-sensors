# Hydrostatic-pressure-level-sensors: Serverless Computing for IoT
Hydrostatic pressure level sensors are submersible sensors used for measuring the level of water in deep tanks.

## Table of Content
[- Introduction](#Introduction): Introduction to the Project\
[- Architecture](#Architecture): Architecture of the Project\
[- Project structure](#Project-structure): Based structure of the Project\
[- Building project](#Building-project): Building the Project

## Introduction

This project is a demonstration of serverless computing and submitted as a project for subect of Serverless Computing fir IoT.

The main idea is to mimic a **hydeostatic pressure level senor** placed inside a water tank which will **alert** the user when the level on the water inside the tank is **low**.\
The notification is generated by the **Telegram bot**. The user, when notified, have to select the most suitable option from the below options presented to them with notification via Telegram bot. This options are as under:

- **Turn on water pump.**
- **Warn someone to turn on the water pump.**
- **Ignore the alert.**

## Architecture

The main phase of the project is to mimic the sending of the data by a hydrostatic pressure level sensor  as there is no real sensor available in this project.

In this project, the sending data can be done by two applications:

- By creating a function on **Nuclio** (Function created with name **waterlevelrandomvalue** in this project).
- By using a **MQTT client application on a Smartphone**.

The sending data is an interger value between 0 and 100 and indicated the **percentage of the water level** in the tank. The value is published in the queue '**iot/waterlevel**' of **RabbitMQ**.

When a value issued in the queue, a function on Nuclio created with the name **waterlevelsensor** is triggered, which then processes the issued value. This function check if the received value is low set for the water level in tank which is **&le;10%** and if so, it will publish a new message in the queue '**iot/alerts**', otherwise it will log in the queue of '**iot/logs**'.


**Bot_Telegram.js** intercept the publications in **iot/alerts** and a notification message is sent to the user via a **Telegram Bot**

After receiving the notification, the user have to choose most likely option from the given options mentioned earlier.
![architecture](https://user-images.githubusercontent.com/107116860/172752884-b2474a55-f504-422c-83f2-edae207d1d25.jpeg)

## Project structure

- node.js/
  - **Bot_Telegram.js**: Bi-directional communication with Telegram bot.
  - **Alert_logger.js**: Publish both when the water level is not too low and the user response from the bot.

- yaml_function/
  - **waterlevelrandomvalue.yaml**: Sends a random value to the queue iot/waterlevel.
  - **waterlevelsensor.yaml**: Process received random values and notify the user or log data.

## Building Project

**This project require the installation of Node.js and Docker**

After the installation of Docker, start Docker to run **RabbitMQ** and **Nuclio** with the below commands via terminal or CMD:


- **Docker RabbitMQ**:

  docker run -p 9000:15672  -p 1883:1883 -p 5672:5672  cyrilix/rabbitmq-mqtt
 

- **Docker Nuclio**:

  docker run -p 8070:8070 -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp nuclio/dashboard:stable-amd64
  
  **Update and deploy functions steps**:
  
  - Type '**localhost:8070**' on your browser to open the homepage of Nuclio.
  - Create new project and call it **Water Level Detection**.
  - Press '**Create function**', '**Import**' and upload the two functions .yaml files that are in the **yaml_functions** folder.
  - In both .yaml funstion files, **change the already present IP with your computer present IP address**.
  - Press **'Deploy'**.

- **Create Telegram Bot**:

  - Open Telegram and search for [BotFather].
  - Press **start** and type **/newbot**.
  - Give it a **name** and a **unique id**.
  - Copy and paste the **Token** that BotFather gave you in the **Telegraf constructor** in **Bot_Telegram.js**.

- **Install all dependencies, start Telegram Bot's Server and start Logger**:

Open two terminal or CMD and type the following commands on each:

**node Bot_Telegram.js**

and on second one:

**node logger.js**

-**Note: Specify the location of the folder in terminal or CMD where the files or present and then run the command.**

- **Start Telegram Bot Client**:

Run the bot created on Telegram.
After all these steps, you are able to send a value using both **waterlevelrandomvalue** on Nuclio and an **MQTT client** from smartphone and if this provided value is **less than or equal to 10**, user will be notified on the Telegram bot and asked to choose the option prefered.

## Demo

Following videos demonstrate the value send from the MQTT client via smartphone and the notification received on Telegram bot.

**Sending random value using MQTT client via smartphone**



https://user-images.githubusercontent.com/107116860/172761928-db04f00b-e027-4cf8-a13e-47c8cc7c985d.mp4




**Notification on Telegram via Telegram bot**




https://user-images.githubusercontent.com/107116860/172761996-45e996b6-4fa0-43e7-9999-8fcd96e2612f.mp4



