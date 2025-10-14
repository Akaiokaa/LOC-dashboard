LOC Project LAB GROUP
User Story #1: As a member of the Learning Outcomes Committee, I can view and update Division information through a centralized form so that I can maintain accurate division data in one place instead of updating it in multiple places.

Acceptance Criteria #1 - View Division Information

Given I am on the Division management form
When I select the Technology division from a dropdown of divisions (Fine Arts, Humanities, Social Science, English, Science, Technology, Health Science, Trades, etc.)
Then I should see editable fields populated with current information for:
Division Name: Technology
Dean: Miebeth Castillo-Booth
PEN Contact: Angie Brenner
LOC Rep: Josh Archer
Chair: Michael Wood
And I should see buttons to Save or Cancel
Acceptance Criteria #2 - Input Validation

Given I have selected a division and left any of the editable fields (Division Name, Dean, PEN Contact, LOC Rep, or Chair) blank
When I click the "Save" button
Then I should see an inline error message for each missing value
And the errors should disappear when I correct them
Acceptance Criteria #3 - Cancel Changes

Given I have selected a division and can see the editable fields
When I click the "Cancel" button
Then all editable fields should be hidden
And the Save and cancel buttons should be hidden
Technical Criteria

All code is well-formatted, commented, and validated
The web page is well-designed, user friendly, and responsive
All code is up-to-date in GitHub; regular commits are well-documented
Deliverables

Submit the URL of your form on Digital Ocean, one submission per team.

https://docs.google.com/document/d/1jm2UlrRt2rRwbU_9rZWHwT-HscOL1H6yyihpbf2aKCI/edit?usp=sharing
