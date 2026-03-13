function runTestBot() {

  // ==========================================
  // CONFIGURATION 
  // ==========================================
  
  // 1. PASTE YOUR GOOGLE CHAT WEBHOOK URL HERE
  const webhookUrl = "YOUR_CHAT_WEBHOOK_URL";

  // 2. PASTE YOUR SERVICENOW INSTANCE URL HERE (Remember the trailing slash '/')
  const instanceUrl = "https://YOUR_COMPANY.service-now.com/";

  // ==========================================
  // MAIN LOGIC
  // ==========================================

  // Search query targeting the dummy test email
  const searchQuery = 'subject:"[New Incident]" is:unread'; 
  const threads = GmailApp.search(searchQuery, 0, 5);

  console.log("Found threads matching test query: " + threads.length);

  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();

    for (var j = 0; j < messages.length; j++) {
      var message = messages[j];

      if (message.isUnread()) {
        var body = message.getPlainBody();
        var subject = message.getSubject();

        // --- DATA EXTRACTION (Tailored to the test email) ---
        var incMatch = subject.match(/(INC\d+)/);
        var incNumber = incMatch ? incMatch[1] : "N/A";

        var userMatch = body.match(/Affected User:\s*(.+)/i);
        var affectedUser = userMatch ? userMatch[1].trim() : "N/A";

        var priorityMatch = body.match(/Priority:\s*(.+)/i);
        var priority = priorityMatch ? priorityMatch[1].trim() : "N/A";

        var descMatch = body.match(/Short Description:\s*(.+)/i);
        var shortDesc = descMatch ? descMatch[1].trim() : "N/A";

        // Generate the dynamic link to the specific Incident
        var snowLink = instanceUrl + "nav_to.do?uri=incident.do?sysparm_query=number=" + incNumber;

        // --- BUILD GOOGLE CHAT CARD ---
        var payload = {
          "cardsV2": [
            {
              "cardId": incNumber,
              "card": {
                "header": {
                  "title": "New Incident in Queue: " + incNumber,
                  "subtitle": "Priority: " + priority,
                  "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2f/ServiceNow_logo.png",
                  "imageType": "CIRCLE"
                },
                "sections": [
                  {
                    "widgets": [
                      {
                        "textParagraph": {
                          "text": "<b>User:</b> " + affectedUser + "<br><br><b>Description:</b> " + shortDesc
                        }
                      },
                      {
                        "buttonList": {
                          "buttons": [
                            {
                              "text": "Open in ServiceNow",
                              "onClick": {
                                "openLink": {
                                  "url": snowLink
                                }
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        };

        // --- SEND TO GOOGLE CHAT ---
        var options = {
          'method': 'post',
          'contentType': 'application/json',
          'payload': JSON.stringify(payload)
        };

        try {
          UrlFetchApp.fetch(webhookUrl, options);
          console.log("Successfully sent test card to Google Chat!");
          message.markRead(); // Mark as read so it doesn't trigger again
        } catch (e) {
          console.error("Error sending webhook: " + e.message);
        }
      }
    }
  }
}
