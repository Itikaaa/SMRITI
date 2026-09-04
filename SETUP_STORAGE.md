# SMRITI full-stack storage notes

SMRITI now runs on the full-stack template with Manus OAuth, a MySQL-compatible database accessed through Drizzle, protected tRPC procedures, and the preconfigured S3-compatible storage helper. The required platform environment is already supplied by the project configuration; do not commit a `.env` file or hardcode storage credentials. The development server should be started with `pnpm run dev`, and production verification is available through `pnpm check`, `pnpm test`, and `pnpm build`.

## Storage flow

The caregiver selects a photo, voice note, or care document in the browser. The client encodes the file for the protected upload mutation. The server validates the declared byte length, sanitizes the filename, and calls `storagePut()` with a caregiver-scoped key. The file bytes live in S3-compatible storage, while the database stores only the object key, served path, filename, MIME type, size, purpose, caregiver owner, patient profile association, and consent metadata.

The upload limit is **8 MB**. The caregiver can reclassify a stored item between memory photo and other, remove its database reference, or open the stored path. Removing a reference makes the object unreachable through the application; the platform storage helper does not expose an object-delete endpoint, so a production retention policy should be defined before promising physical deletion.

## Ownership and consent

Every stored file is scoped to the authenticated caregiver’s user ID. Uploads automatically associate with that caregiver’s saved patient profile when one exists. The upload form records `pending`, `confirmed`, or `declined` consent, plus an optional consent note and the time confirmation was recorded. The current prototype does not replace a legal consent workflow, medical-record policy, or access audit system. Caregivers should upload only material that the patient or authorized representative has agreed to keep in the care room.

Avoid placing diagnoses, prescriptions, government identifiers, or other highly sensitive material in the prototype storage area until the production privacy policy, retention schedule, access review, and notification rules have been approved. A future production release should also add audit events, explicit patient-profile selection for multi-patient caregiver accounts, role-aware sharing, and server-side file-type inspection.

## Backend locations

The database schema is in `drizzle/schema.ts`. Query helpers are in `server/db.ts`. Protected profile and file procedures are in `server/routers.ts`. The storage helper is the preconfigured `server/storage.ts`; it should be used instead of storing file bytes in database columns or checked-in project folders.

## Validation

The storage contract has unit coverage in `server/storage.validation.test.ts`. The authenticated logout contract remains covered in `server/auth.logout.test.ts`. Run `pnpm check && pnpm test && pnpm build` before handing a new version to a caregiver or publishing it.
