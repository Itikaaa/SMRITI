# SMRITI full-stack upgrade

- [x] Read the full-stack project guidance and inspect the existing frontend storage assumptions.
- [x] Upgrade the project to the full-stack template with database, user management, backend routes, and file storage scaffolding.
- [x] Define a safe stored-media model for caregiver uploads, including ownership and consent metadata.
- [x] Add a caregiver-facing upload and media-management flow to SMRITI.
- [x] Connect stored media to the patient profile/session context without exposing files publicly by default.
- [x] Run type checks/build validation and document any required environment or consent steps.
- [x] Save a final checkpoint and deliver the upgraded project version.
- [x] Add explicit consent metadata to stored files and save it through the caregiver flow.
- [x] Expand the memory library with remove, reclassify, and profile-association controls plus query error states.
- [x] Wire uploads to the saved patient profile by persisting and using patientProfileId end to end.
- [x] Create setup and privacy documentation covering auth, storage, file limits, and caregiver consent responsibilities.
- [x] Add a visible caregiver control to view and change each file’s patient-profile association, wired to the protected update procedure.
- [x] Fix invalid OAuth state during caregiver sign-in and validate the callback flow.
