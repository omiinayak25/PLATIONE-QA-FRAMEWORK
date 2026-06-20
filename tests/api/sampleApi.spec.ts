import { test, expect } from "../../helper/fixtures";
import { ContactFactory } from "../../data/factories/contactFactory";
import { ContactBuilder } from "../../api/builders/contactBuilder";
import { ActionBuilder } from "../../api/builders/actionBuilder";
import { CommonAssertions } from "../../api/assertions/commonAssertions";
import { ContactAssertions } from "../../api/assertions/contactAssertions";

test.describe("Platione Sales Assist API Client Tests", () => {
  
  test("API: Create, Read, Update, and Delete Contact Workflow", async ({ contactClient }) => {
    // 1. Generate contact model via builder
    const newContact = new ContactBuilder()
      .withFirstName("Alice")
      .withLastName("Smith")
      .withEmail("alice.smith@salesassist.com")
      .withStatus("Active")
      .build();

    // Measure start time for SLA checks
    const startTime = Date.now();

    // 2. Create Contact via API
    const createRes = await contactClient.createContact(newContact);
    const elapsed = Date.now() - startTime;

    // Verify creation status code (201 Created) and schema properties
    await ContactAssertions.assertContactCreated(createRes, newContact);
    CommonAssertions.assertResponseTime(elapsed, 1000); // Latency SLA < 1000ms

    const createdContact = await createRes.json();
    const contactId = createdContact.id;

    // 3. Retrieve Contact by ID
    const getRes = await contactClient.getContact(contactId);
    await CommonAssertions.assertStatusCode(getRes, 200);
    const retrievedContact = await getRes.json();
    expect(retrievedContact.id).toBe(contactId);

    // 4. Update Contact status
    const updatePayload = { status: "Customer" as const };
    const updateRes = await contactClient.updateContact(contactId, updatePayload);
    await CommonAssertions.assertStatusCode(updateRes, 200);
    const updatedContact = await updateRes.json();
    expect(updatedContact.status).toBe("Customer");

    // 5. Delete Contact
    const deleteRes = await contactClient.deleteContact(contactId);
    await CommonAssertions.assertStatusCode(deleteRes, 204);
  });

  test("API: Negative Case - Invalid Contact Registration (Validation Check)", async ({ contactClient }) => {
    // Email containing invalid characters/format
    const invalidContact = ContactFactory.createContact({ email: "invalid-email-format" });
    const response = await contactClient.createContact(invalidContact);

    // Assert 400 Bad Request with error body
    await CommonAssertions.assertError(response, 400, "invalid email");
  });

  test("API: Negative Case - Prevent Duplicate Contacts", async ({ contactClient }) => {
    // Setup email that triggers mocked duplicate alert
    const duplicateContact = ContactFactory.createContact({ email: "duplicate@test.com" });
    const response = await contactClient.createContact(duplicateContact);

    // Assert 409 Conflict duplicate error
    await ContactAssertions.assertDuplicateContactError(response);
  });

  test("API Seeder: Inject and Teardown Test Data lifecycle validation", async ({ apiSeeder }) => {
    // 1. Seed contact
    const contactData = ContactFactory.createContact();
    const seededContact = await apiSeeder.seedContact(contactData);
    expect(seededContact.id).toBeDefined();

    // 2. Seed Planned Action linked to contact
    const actionData = new ActionBuilder(seededContact.id!)
      .withTitle("Schedule introductory demo")
      .withType("Meeting")
      .build();
    const seededAction = await apiSeeder.seedAction(actionData);
    expect(seededAction.id).toBeDefined();
    expect(seededAction.contactId).toBe(seededContact.id);

    // Tear-down cleanup is automatically run by the Playwright apiSeeder fixture!
    // We can also trigger it manually to verify no exceptions occur
    await expect(apiSeeder.cleanup()).resolves.not.toThrow();
  });
});
