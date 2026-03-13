# ServiceNow-to-Google-Chat-Alert-Bot-
🚀 Serverless ServiceNow to Google Chat integration using Google Apps Script. Automatically parses Gmail incident alerts and pushes interactive V2 Cards to Chat spaces via Webhooks. Zero infrastructure, 100% cloud-based.
# ServiceNow to Google Chat Alert Bot 🚀

[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=for-the-badge&logo=google-apps-script&logoColor=white)](https://developers.google.com/apps-script)
[![ServiceNow](https://img.shields.io/badge/ServiceNow-81B5A1?style=for-the-badge&logo=servicenow&logoColor=white)](https://www.servicenow.com/)

A lightweight, serverless integration built with Google Apps Script that monitors a Gmail queue for new ServiceNow Incident notifications and instantly pushes an interactive Card alert to Google Chat.

## 💡 The Problem

IT Dispatchers and Support Teams often waste time manually refreshing ServiceNow queues or monitoring cluttered shared email inboxes to catch new P1/P2 incidents. Delayed response times to critical tickets can impact SLA metrics and business operations.

## 🎯 The Solution

This automation runs entirely in the cloud (Google Workspace). It parses incoming email notifications, extracts key incident data, and uses an Incoming Webhook to send a highly visible, interactive alert directly to the team's Google Chat space.



## 🛠️ Built With (Tools & Technologies)

* **Google Apps Script (GAS):** A cloud-based JavaScript platform that allows you to integrate with and automate tasks across Google products. It provides the serverless runtime environment for this bot.

* **Google Chat Incoming Webhooks:** A simple API integration that allows external applications to send asynchronous, formatted messages (Cards V2) directly into specific Google Chat spaces.

* **Regular Expressions (Regex):** Used within the script for advanced text pattern matching to reliably extract specific data (like INC numbers or User details) from raw email bodies.

* **ServiceNow (SNOW):** The enterprise IT Service Management platform generating the initial incident email alerts. *(Note: The script can be adapted to any ticketing system).*

## ✨ Key Features

* **100% Serverless & Always On:** Runs 24/7 in the Google Cloud background. You can close your browser, turn off your PC, or go on vacation, and the bot will keep working seamlessly.

* **Event-Driven Architecture:** Uses Google's native time-driven triggers (acting as a Cron-job) instead of inefficient code loops. The script wakes up, checks the queue, and goes back to sleep, optimizing memory and processing power.

* **Smart Parsing:** Extracts INC Number, Affected User, Priority, and Description automatically.

* **Interactive Cards:** Generates Google Chat V2 Cards with direct buttons to open the ServiceNow ticket.

* **Zero Cost & Zero Infrastructure:** Requires no external servers, VMs, or paid API tiers.

## 🔄 Beyond IT Support: Alternative Use Cases

While this project is configured for ServiceNow by default, the underlying **Email-to-Chat parsing engine** is highly versatile. By simply updating the `searchQuery` and Regex variables, you can adapt this bot for various enterprise scenarios:

* 🚨 **DevOps & Infrastructure Monitoring:** Route critical email alerts from monitoring tools (Zabbix, Datadog, AWS CloudWatch) directly to the DevOps on-call channel. *(e.g., "High CPU Usage on Server-PROD-01")*.

* 💼 **Sales & CRM Lead Routing:** Instantly notify the sales team when a new high-value lead fills out a contact form or triggers a HubSpot/Salesforce email notification. 

* 🔒 **SecOps & Security Alerts:** Send automated warnings to the security team about multiple failed login attempts, phishing reports, or expiring SSL certificates.

* 📦 **HR & IT Provisioning:** Catch automated emails from HR systems (like Workday) about new employee onboardings and push a summary card to the IT hardware preparation team.


# How to Setup

  

### 1. Create a Google Chat Webhook

1. Go to your target Google Chat Space.

2. Click the Space name > **Apps & integrations** > **Manage webhooks**.

3. Create a new webhook, name it (e.g., "Queue Bot"), and **copy the URL**.

  

### 2. Deploy the Google Apps Script

1. Log in to the Gmail account that receives the system notifications.

2. Go to [[script.google.com](http://script.google.com/)]([https://script.google.com/](https://script.google.com/)) and create a **New Project**.

3. Copy the contents of `[Code.gs](http://code.gs/)` from this repository and paste it into the editor.

4. Update the configuration variables at the top of the script:

   - `webhookUrl`: Paste your Google Chat Webhook URL.

   - `searchQuery`: Adjust the Gmail search query to match your email notification format.

   - `instanceUrl`: Change to your company's system domain.

5. Save the project.

  

### 3. Customize the Regex (Optional)

Depending on your email template, you might need to adjust the Regular Expressions in the `// --- DATA EXTRACTION ---` section of the code to properly capture your specific fields.

  

### 4. Set up the Trigger (The "Cron Job")

To make the script run fully automatically in the background without manual execution:

1. In the Apps Script editor, click the **Clock icon (Triggers)** on the left menu.

2. Click **Add Trigger**.

3. Set the function to run: `processQueueAlerts`.

4. Select event source: **Time-driven**.

5. Select type of time based trigger: **Minutes timer** -> **Every minute** (or every 3/5 minutes, depending on your needs).

6. Save and grant the necessary permissions. The bot is now autonomous!

## ⚠️ Troubleshooting & FAQ

  

**Q: The script runs but no message appears in Google Chat?**

* **A:** Check the Apps Script "Execution Log". If it says `Found threads: 0`, your `searchQuery` is not matching any *unread* emails. Verify your Gmail search filters. If the execution is successful but no chat appears, verify that your Webhook URL is correct and active.

  

**Q: The Chat Card shows "N/A" or "Unknown" for some fields?**

* **A:** This means the Regular Expressions (Regex) in the script didn't match the text in your email. ServiceNow email templates vary heavily between companies. You will need to adjust the `.match(/YOUR_REGEX/)` lines in the script to fit your specific email formatting.

  

**Q: Does it send duplicate alerts?**

* **A:** No. The script automatically marks the processed emails as `Read` (`message.markRead()`). The search query only looks for `is:unread` messages, ensuring tickets are only pushed once.


## 🛡️ Security Note

This script runs entirely within your authorized Google account. No data is sent to third-party APIs (other than the official Google Chat API). All parsing is done server-side within the Google Workspace boundary.


## 📄 License

MIT License. Feel free to use and modify for your organization!

```mermaid
graph TD
    A[ServiceNow] -- Generates Email Alert --> B(IT Shared Inbox / Gmail)
    B -- Time-driven Trigger Every 1 Min --> C{Google Apps Script}
    C -- Regex Parsing --> D[Extract: INC, User, Priority]
    D -- Build JSON Payload --> E[Google Chat Webhook]
    E -- Push Card Message --> F((Google Chat Space))

    style A fill:#ebf5fb,stroke:#2e86c1
    style C fill:#fef9e7,stroke:#f1c40f
    style F fill:#eafaf1,stroke:#27ae60
