# Security Spec for सरकारी सेवा पोर्टल

## 1. Data Invariants
- A `GovLink` must have a valid `category` from the allowed list.
- Only authenticated admins in the `/admins` collection can create, update, or delete links.
- `createdAt` must be set to the server time on document creation.
- `updatedAt` must be set to the server time on document updates.
- All users (authenticated or not) can read links.

## 2. The Dirty Dozen Payloads

1. **Unauthorized Creation**: Attempting to add a link without being an admin.
2. **Spoofed CreatedBy**: Authenticated user trying to set `createdBy` to someone else's UID.
3. **Invalid Category**: Setting category to "malicious-category".
4. **Massive ID**: Injecting a 2MB string as a document ID.
5. **PII Exposure**: Trying to read the `/admins` collection as a regular user.
6. **Future Timestamp**: Setting `createdAt` to a year from now.
7. **Shadow Field**: Adding `isPromoted: true` to a link document when it's not in the schema.
8. **Malicious URL**: Injecting `javascript:alert(1)` into the `url` field.
9. **Admin Self-Promotion**: A regular user trying to create a document in the `/admins` collection for themselves.
10. **Link Takeover**: User trying to update a link they didn't create (if we had per-user restrictions, but here it's any admin).
11. **Empty Required Fields**: Creating a link without a title or URL.
12. **Bypassing App Logic**: Directly writing to Firestore skipping frontend validation.

## 3. Test Scenarios (Logical)
- `create` link: `isSignedIn() && isAdmin() && isValidLink(incoming())`
- `update` link: `isSignedIn() && isAdmin() && isValidLink(incoming()) && incoming().diff(existing()).affectedKeys().hasOnly([...])`
- `delete` link: `isSignedIn() && isAdmin()`
- `list` links: `allow read: if true` (Public access for the portal)
- `get` admins: `isSignedIn() && (request.auth.uid == uid || isAdmin())`
