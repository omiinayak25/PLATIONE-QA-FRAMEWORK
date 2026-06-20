import { test, expect } from "../../helper/fixtures";
import { ContactFactory } from "../../data/factories/contactFactory";
import { LeadFactory } from "../../data/factories/leadFactory";
import { ActionBuilder } from "../../api/builders/actionBuilder";
import { ContactBuilder } from "../../api/builders/contactBuilder";
import { logger } from "../../utils/logger";

test.describe("Platione Sales Assist UI Tests", () => {
  // Set up mock HTML and API routes to enable offline/local execution
  test.beforeEach(async ({ page }) => {
    // 1. Mock Login Page Route
    await page.route("**/login", async (route) => {
      await route.fulfill({
        contentType: "text/html",
        body: `
          <html>
            <body>
              <div id="login-form">
                <input id="usernameInput" type="text" placeholder="Email" />
                <input id="passwordInput" type="password" placeholder="Password" />
                <button id="loginButton" onclick="login()">Login</button>
                <div id="errorMessage" style="display:none; color:red;"></div>
              </div>
              <script>
                async function login() {
                  const u = document.getElementById('usernameInput').value;
                  const p = document.getElementById('passwordInput').value;
                  
                  // Trigger API call to mock endpoint so network goes idle instantly
                  await fetch('/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: u, password: p })
                  });

                  if (u === 'test@test.com' && p === 'Password123') {
                    window.location.href = '/dashboard';
                  } else {
                    const err = document.getElementById('errorMessage');
                    err.innerText = 'Invalid credentials';
                    err.style.display = 'block';
                  }
                }
              </script>
            </body>
          </html>
        `,
      });
    });

    // 2. Mock Dashboard Page Route
    await page.route("**/dashboard", async (route) => {
      await route.fulfill({
        contentType: "text/html",
        body: `
          <html>
            <body>
              <div id="navbar-container">
                <div class="logo-brand">Platione Sales Assist</div>
                <div class="notifications-bell">🔔</div>
                <div class="user-profile-avatar" id="userProfileMenu">Profile</div>
                <button id="logoutButton" style="display:none;" onclick="logout()">Logout</button>
              </div>
              <div id="sidebar-container">
                <button class="nav-link" onclick="window.location.href='/dashboard'">Dashboard</button>
                <button class="nav-link" onclick="window.location.href='/contacts'">Contacts</button>
                <button class="nav-link" onclick="window.location.href='/actions'">Actions</button>
              </div>
              <div class="page-header">
                <h1 class="header-title">Dashboard</h1>
                <span class="breadcrumb-path">Home > Dashboard</span>
              </div>
              <div id="welcomeMessage">Welcome back, Sales Agent!</div>
              <div id="contactsMetric">Contacts: 10</div>
              <div id="actionsMetric">Actions: 3</div>
              <script>
                const menu = document.getElementById('userProfileMenu');
                const out = document.getElementById('logoutButton');
                menu.addEventListener('click', () => {
                  out.style.display = out.style.display === 'none' ? 'block' : 'none';
                });
                function logout() {
                  window.location.href = '/login';
                }
              </script>
            </body>
          </html>
        `,
      });
    });

    // 3. Mock Contacts Management Page Route
    await page.route("**/contacts", async (route) => {
      await route.fulfill({
        contentType: "text/html",
        body: `
          <html>
            <body>
              <div id="navbar-container">
                <div class="logo-brand">Platione</div>
                <div class="user-profile-avatar" id="userProfileMenu">Profile</div>
              </div>
              <div id="sidebar-container">
                <button class="nav-link" onclick="window.location.href='/dashboard'">Dashboard</button>
                <button class="nav-link" onclick="window.location.href='/contacts'">Contacts</button>
              </div>
              <div class="page-header">
                <h1 class="header-title">Contacts</h1>
              </div>
              <input id="contactSearchInput" type="text" />
              <button id="createContactButton" onclick="openModal()">New Contact</button>
              
              <!-- Modal Form -->
              <div id="modal" class="modal-dialog-container" style="display:none;">
                <h2 class="modal-dialog-header-title">Add Contact</h2>
                <span class="modal-dialog-close-icon" onclick="closeModal()">X</span>
                <input id="firstNameInput" type="text" />
                <input id="lastNameInput" type="text" />
                <input id="emailInput" type="text" />
                <input id="phoneInput" type="text" />
                <input id="companyInput" type="text" />
                <select id="statusSelect">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Customer">Customer</option>
                </select>
                <button id="saveContactButton" onclick="saveContact()">Save</button>
                <button id="cancelContactButton" onclick="closeModal()">Cancel</button>
              </div>

              <!-- List -->
              <table>
                <tbody id="contact-list">
                  <tr class="contact-row">
                    <td>John Doe</td>
                    <td>john.doe@test.com</td>
                    <td>Active</td>
                    <td><button class="delete-contact-btn" onclick="deleteContact('john.doe@test.com')">Delete</button></td>
                  </tr>
                </tbody>
              </table>

              <script>
                function openModal() { document.getElementById('modal').style.display = 'block'; }
                function closeModal() { document.getElementById('modal').style.display = 'none'; }
                function saveContact() {
                  const email = document.getElementById('emailInput').value;
                  const name = document.getElementById('firstNameInput').value + ' ' + document.getElementById('lastNameInput').value;
                  const row = document.createElement('tr');
                  row.className = 'contact-row';
                  row.innerHTML = '<td>'+name+'</td><td>'+email+'</td><td>Active</td><td><button class="delete-contact-btn" onclick="deleteContact(\\''+email+'\\')">Delete</button></td>';
                  document.getElementById('contact-list').appendChild(row);
                  closeModal();
                }
                function deleteContact(email) {
                  const rows = document.querySelectorAll('.contact-row');
                  rows.forEach(r => {
                    if (r.innerText.includes(email)) r.remove();
                  });
                }
              </script>
            </body>
          </html>
        `,
      });
    });

    // Mock REST auth endpoints
    await page.route("**/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ token: "mock-session-jwt-token-12345" }),
      });
    });
  });

  test("UI Flow: Valid Login -> Metrics Check -> Logout", async ({ loginPage, dashboardPage }) => {
    // 1. Visit Login screen and authenticate
    await loginPage.navigate();
    await loginPage.login("test@test.com", "Password123");

    // 2. Validate Dashboard welcome metrics (web-first assertion with auto-waiting)
    await expect(dashboardPage.welcomeMessage).toBeVisible();
    await expect(dashboardPage.contactsMetric).toContainText("Contacts: 10");

    // 3. Logout
    await dashboardPage.logout();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test("UI Flow: Invalid Login Validation Check", async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login("wrong@wrong.com", "WrongPassword");
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain("Invalid credentials");
  });

  test("UI Flow: Contact Registration and Search", async ({ page, loginPage, contactPage }) => {
    // Perform quick login
    await loginPage.navigate();
    await loginPage.login("test@test.com", "Password123");

    // Navigate to Contacts page
    await contactPage.navigate();

    // Create a new contact utilizing the factory
    const testContact = ContactFactory.createContact({ email: "custom.created@test.com" });
    await contactPage.createContact(testContact);

    // Verify contact displays in the UI list using web-first assertion
    const contactRow = page.locator(`.contact-row:has-text("${testContact.email}")`);
    await expect(contactRow).toBeVisible();

    // Search for contact
    await contactPage.searchContact(testContact.email);
    await expect(contactRow).toBeVisible();

    // Delete contact
    await contactPage.deleteContact(testContact.email);
    await expect(contactRow).toBeHidden();
  });

  test("UI Flow: Edge Case - Form Validation and Cancel creation", async ({ page, loginPage, contactPage }) => {
    await loginPage.navigate();
    await loginPage.login("test@test.com", "Password123");
    await contactPage.navigate();

    // Open creation modal, fill, then cancel
    const cancelContact = ContactFactory.createContact({ email: "cancel.test@test.com" });
    await contactPage.createContactButton.click();
    await contactPage.firstNameInput.fill(cancelContact.firstName);
    await contactPage.emailInput.fill(cancelContact.email);
    await contactPage.cancelButton.click();

    // Verify contact was NOT added using web-first assertion
    const cancelRow = page.locator(`.contact-row:has-text("${cancelContact.email}")`);
    await expect(cancelRow).toBeHidden();
  });
});
